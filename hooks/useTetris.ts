"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Block, Position, TetrominoType, Cell, GameField } from '../types/tetris';

// 테트리스 블록 모양 및 색상 정의
const TETROMINOS: Record<TetrominoType, { shape: number[][]; color: string }> = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-400' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-300' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-400' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-400' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-400' },
};

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;
const DROP_BASE_INTERVAL = 800; // ms, 스테이지 1 기준
const DROP_ACCEL = 1.2; // 스테이지마다 속도 증가 배수

// 기본 셀 생성
const createEmptyField = (): GameField =>
  Array.from({ length: FIELD_HEIGHT }, () =>
    Array.from({ length: FIELD_WIDTH }, () => ({ type: null, color: null, filled: false }))
  );

// 랜덤 블록 생성
const getRandomBlock = (): Block => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  const { shape, color } = TETROMINOS[type];
  return { shape, type, color };
};

// 블록 회전(시계방향)
function rotateMatrix(matrix: number[][]): number[][] {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

// 충돌 체크
function checkCollision(field: GameField, shape: number[][], pos: Position): boolean {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (!shape[y][x]) continue;
      const fx = pos.x + x;
      const fy = pos.y + y;
      if (fx < 0 || fx >= FIELD_WIDTH || fy >= FIELD_HEIGHT) return true;
      if (fy >= 0 && field[fy][fx].filled) return true;
    }
  }
  return false;
}

// 블록을 필드에 고정
function mergeBlock(field: GameField, shape: number[][], pos: Position, type: TetrominoType, color: string): GameField {
  const newField = field.map(row => row.map(cell => ({ ...cell })));
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const fx = pos.x + x;
        const fy = pos.y + y;
        if (fy >= 0 && fy < FIELD_HEIGHT && fx >= 0 && fx < FIELD_WIDTH) {
          newField[fy][fx] = { type, color, filled: true };
        }
      }
    }
  }
  return newField;
}

// 줄 삭제 및 점수 계산
function clearLines(field: GameField): { newField: GameField; lines: number } {
  const newField = field.filter(row => !row.every(cell => cell.filled));
  const lines = FIELD_HEIGHT - newField.length;
  while (newField.length < FIELD_HEIGHT) {
    newField.unshift(Array.from({ length: FIELD_WIDTH }, () => ({ type: null, color: null, filled: false })));
  }
  return { newField, lines };
}

// 점수 계산 (테트리스 규칙: 1줄=100, 2줄=400, 3줄=900, 4줄=1600)
function calcScore(lines: number): number {
  switch (lines) {
    case 1: return 100;
    case 2: return 400;
    case 3: return 900;
    case 4: return 1600;
    default: return 0;
  }
}

const EMPTY_BLOCK: Block = {
  shape: [[0]],
  type: 'O',
  color: 'bg-gray-800',
};

export function useTetris() {
  // 항상 랜덤 블록으로 초기화
  const [gameState, setGameState] = useState<GameState>({
    field: createEmptyField(),
    activeBlock: {
      block: getRandomBlock(),
      position: { x: 3, y: 0 },
      rotation: 0,
    },
    nextBlocks: [getRandomBlock(), getRandomBlock()],
    score: 0,
    stage: 1,
    isPaused: false,
    isGameOver: false,
  });

  const dropInterval = useRef<number>(DROP_BASE_INTERVAL);
  const dropTimer = useRef<NodeJS.Timeout | null>(null);

  // 블록 자동 낙하
  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;
    dropInterval.current = DROP_BASE_INTERVAL / Math.pow(DROP_ACCEL, gameState.stage - 1);
    dropTimer.current && clearTimeout(dropTimer.current);

    const tick = () => {
      moveDown();
      dropTimer.current = setTimeout(tick, dropInterval.current);
    };
    dropTimer.current = setTimeout(tick, dropInterval.current);

    return () => {
      if (dropTimer.current) clearTimeout(dropTimer.current);
    };
    // eslint-disable-next-line
  }, [gameState.isPaused, gameState.isGameOver, gameState.stage]);

  // 블록 이동
  const move = useCallback((dx: number, dy: number, rotateBlock = false) => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver) return prev;
      let { block, position, rotation } = prev.activeBlock;
      let shape = block.shape;
      if (rotateBlock) {
        shape = rotateMatrix(shape);
      }
      const newPos = { x: position.x + dx, y: position.y + dy };
      if (!checkCollision(prev.field, shape, newPos)) {
        return {
          ...prev,
          activeBlock: {
            block: rotateBlock ? { ...block, shape } : block,
            position: newPos,
            rotation: rotateBlock ? (rotation + 1) % 4 : rotation,
          },
        };
      }
      // 회전 시 벽킥(간단히 좌우 한 칸만 시도)
      if (rotateBlock) {
        for (const offset of [-1, 1, -2, 2]) {
          const testPos = { x: position.x + offset, y: position.y };
          if (!checkCollision(prev.field, shape, testPos)) {
            return {
              ...prev,
              activeBlock: {
                block: { ...block, shape },
                position: testPos,
                rotation: (rotation + 1) % 4,
              },
            };
          }
        }
      }
      return prev;
    });
  }, []);

  // 좌우 이동
  const moveLeft = useCallback(() => move(-1, 0), [move]);
  const moveRight = useCallback(() => move(1, 0), [move]);
  // 아래로 이동
  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver) return prev;
      const { block, position } = prev.activeBlock;
      const shape = block.shape;
      const newPos = { x: position.x, y: position.y + 1 };
      if (!checkCollision(prev.field, shape, newPos)) {
        return {
          ...prev,
          activeBlock: {
            ...prev.activeBlock,
            position: newPos,
          },
        };
      }
      // 바닥에 닿으면 고정 및 다음 블록
      const merged = mergeBlock(prev.field, shape, position, block.type, block.color);
      const { newField, lines } = clearLines(merged);
      let newScore = prev.score + calcScore(lines);
      let newStage = prev.stage;
      if (newScore >= prev.stage * 3000) newStage++;
      // 새 블록
      const [next, ...rest] = prev.nextBlocks.length ? prev.nextBlocks : [getRandomBlock(), getRandomBlock()];
      const newActive = {
        block: next,
        position: { x: 3, y: 0 },
        rotation: 0,
      };
      // 게임오버 체크
      if (checkCollision(newField, next.shape, newActive.position)) {
        return {
          ...prev,
          field: newField,
          score: newScore,
          stage: newStage,
          isGameOver: true,
        };
      }
      return {
        ...prev,
        field: newField,
        activeBlock: newActive,
        nextBlocks: rest.length < 2 ? [...rest, getRandomBlock()] : rest,
        score: newScore,
        stage: newStage,
      };
    });
  }, []);
  // 회전
  const rotate = useCallback(() => move(0, 0, true), [move]);
  // 하드 드롭
  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.isPaused || prev.isGameOver) return prev;
      let { block, position } = prev.activeBlock;
      let shape = block.shape;
      let y = position.y;
      while (!checkCollision(prev.field, shape, { x: position.x, y: y + 1 })) {
        y++;
      }
      // 바닥에 닿으면 고정 및 다음 블록
      const merged = mergeBlock(prev.field, shape, { x: position.x, y }, block.type, block.color);
      const { newField, lines } = clearLines(merged);
      let newScore = prev.score + calcScore(lines);
      let newStage = prev.stage;
      if (newScore >= prev.stage * 3000) newStage++;
      // 새 블록
      const [next, ...rest] = prev.nextBlocks.length ? prev.nextBlocks : [getRandomBlock(), getRandomBlock()];
      const newActive = {
        block: next,
        position: { x: 3, y: 0 },
        rotation: 0,
      };
      // 게임오버 체크
      if (checkCollision(newField, next.shape, newActive.position)) {
        return {
          ...prev,
          field: newField,
          score: newScore,
          stage: newStage,
          isGameOver: true,
        };
      }
      return {
        ...prev,
        field: newField,
        activeBlock: newActive,
        nextBlocks: rest.length < 2 ? [...rest, getRandomBlock()] : rest,
        score: newScore,
        stage: newStage,
      };
    });
  }, []);

  // 일시정지
  const pause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);
  // 재개
  const resume = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);
  // 재시작
  const restart = useCallback(() => {
    setGameState({
      field: createEmptyField(),
      activeBlock: {
        block: getRandomBlock(),
        position: { x: 3, y: 0 },
        rotation: 0,
      },
      nextBlocks: [getRandomBlock(), getRandomBlock()],
      score: 0,
      stage: 1,
      isPaused: false,
      isGameOver: false,
    });
  }, []);

  return {
    gameState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    pause,
    resume,
    restart,
  };
} 
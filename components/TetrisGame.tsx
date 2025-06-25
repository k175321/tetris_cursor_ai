"use client";
import React from 'react';
import GameBoard from './GameBoard';
import NextBlocks from './NextBlocks';
import ScoreBoard from './ScoreBoard';
import Controls from './Controls';
import Overlay from './Overlay';
import { useTetris } from '../hooks/useTetris';

export default function TetrisGame() {
  const {
    gameState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    pause,
    resume,
    restart,
    ghostPosition,
  } = useTetris();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver) return;
      if (gameState.isPaused && e.key !== 'Escape') return;
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ': // Space
          hardDrop();
          break;
        case 'Escape':
          if (gameState.isPaused) resume();
          else pause();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isPaused, gameState.isGameOver, moveLeft, moveRight, moveDown, rotate, hardDrop, pause, resume]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-300 relative">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Tetris</h1>
      <div className="flex flex-col md:flex-row gap-6 relative items-center justify-center">
        {/* 왼쪽: 점수/스테이지 */}
        <div className="flex flex-col items-center md:items-end md:mr-4 mb-4 md:mb-0">
          <ScoreBoard score={gameState.score} stage={gameState.stage} />
        </div>
        {/* 가운데: 게임 보드 및 오버레이 */}
        <div className="relative">
          <GameBoard 
            field={gameState.field} 
            activeBlock={gameState.activeBlock} 
            ghostPosition={ghostPosition}
            blockShape={gameState.activeBlock.block.shape}
          />
          <Overlay isPaused={gameState.isPaused} isGameOver={gameState.isGameOver} onRestart={restart} />
        </div>
        {/* 오른쪽: 다음 블록 카드 */}
        <div className="flex flex-col gap-4 items-center md:items-start md:ml-4">
          <div className="bg-gray-800 dark:bg-gray-900 rounded-md p-4 w-[96px] h-[160px] flex flex-col items-center justify-start shadow-md overflow-hidden">
            <div className="text-sm text-gray-300 mb-1 text-center">Next</div>
            <NextBlocks nextBlocks={gameState.nextBlocks} />
          </div>
        </div>
      </div>
      <Controls
        onLeft={moveLeft}
        onRight={moveRight}
        onDown={moveDown}
        onRotate={rotate}
        onHardDrop={hardDrop}
        onPause={gameState.isPaused ? resume : pause}
      />
    </div>
  );
} 
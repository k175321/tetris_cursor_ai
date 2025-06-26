import React from 'react';
import type { GameField, ActiveBlock, Block, Position } from '../types/tetris';

interface GameBoardProps {
  field: GameField;
  activeBlock: ActiveBlock;
  ghostPosition: Position;
  blockShape: number[][];
}

// GameBoard: 테트리스 필드와 현재 블록, 고스트 블록을 렌더링
const GameBoard: React.FC<GameBoardProps> = ({ field, activeBlock, ghostPosition, blockShape }) => {
  // activeBlock의 셀 위치 계산
  const getCellType = (x: number, y: number) => {
    // 고스트 블록(반투명)
    for (let by = 0; by < blockShape.length; by++) {
      for (let bx = 0; bx < blockShape[by].length; bx++) {
        if (
          blockShape[by][bx] &&
          y === ghostPosition.y + by &&
          x === ghostPosition.x + bx
        ) {
          // activeBlock 위치와 겹치면 activeBlock이 우선
          if (
            y >= activeBlock.position.y &&
            y < activeBlock.position.y + activeBlock.block.shape.length &&
            x >= activeBlock.position.x &&
            x < activeBlock.position.x + activeBlock.block.shape[0].length &&
            activeBlock.block.shape[y - activeBlock.position.y]?.[x - activeBlock.position.x]
          ) {
            continue;
          }
          return { color: activeBlock.block.color + ' opacity-20', filled: true, ghost: true };
        }
      }
    }
    // activeBlock
    const { block, position } = activeBlock;
    const shape = block.shape;
    for (let by = 0; by < shape.length; by++) {
      for (let bx = 0; bx < shape[by].length; bx++) {
        if (
          shape[by][bx] &&
          y === position.y + by &&
          x === position.x + bx
        ) {
          return { color: block.color, filled: true };
        }
      }
    }
    return field[y][x];
  };

  return (
    <div
      className="grid grid-cols-10 grid-rows-17 gap-0 bg-gray-700 p-1 rounded-md w-[300px] h-[510px] md:w-[400px] md:h-[680px] mx-auto touch-none select-none outline outline-2 outline-gray-800"
      aria-label="테트리스 게임 보드"
      tabIndex={0}
    >
      {field.map((row, y) =>
        row.map((cell, x) => {
          const c = getCellType(x, y);
          return (
            <div
              key={`${y}-${x}`}
              className={`w-full h-full min-w-0 min-h-0 rounded-sm ${c.filled ? c.color : 'bg-gray-900'}`}
              style={{ 
                width: '100%', 
                height: '100%', 
                boxShadow: 'inset 0 0 0 0.75px #374151' // 배경색과 동일한 그리드
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default GameBoard; 
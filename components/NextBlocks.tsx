import React from 'react';
import type { Block } from '../types/tetris';

interface NextBlocksProps {
  nextBlocks: Block[];
}

// NextBlocks: 다음에 나올 블록 2개를 세로로 미리보기 (카드 내부 고정 크기)
const NextBlocks: React.FC<NextBlocksProps> = ({ nextBlocks }) => {
  return (
    <div className="flex flex-col items-center justify-center w-20 h-36 gap-2">
      {nextBlocks.slice(0, 2).map((block, idx) => (
        <div key={idx} className="flex flex-col items-center mb-2 last:mb-0">
          {block.shape.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={x}
                  className={`w-4 h-4 m-[1px] rounded-sm border border-gray-700 ${cell ? block.color : 'bg-gray-800'}`}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NextBlocks; 
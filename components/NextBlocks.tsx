import React from 'react';
import type { Block } from '../types/tetris';

interface NextBlocksProps {
  nextBlocks: Block[];
}

// NextBlocks: 다음에 나올 블록 2개를 세로로 미리보기 (카드 내부 고정 크기)
const NextBlocks: React.FC<NextBlocksProps> = ({ nextBlocks }) => {
  return (
    <div className="flex flex-col items-center justify-center w-28 h-52 gap-3">
      {nextBlocks.slice(0, 2).map((block, idx) => (
        <div key={idx} className="flex flex-col items-center mb-2 last:mb-0">
          {block.shape.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={x}
                  className={`w-6 h-6 m-[2px] rounded-sm border ${cell ? `border-gray-700 ${block.color}` : 'border-transparent bg-transparent'}`}
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
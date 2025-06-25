import React from 'react';

interface ScoreBoardProps {
  score: number;
  stage: number;
  horizontal?: boolean;
}

// ScoreBoard: 점수와 스테이지 표시
const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, stage, horizontal }) => {
  if (horizontal) {
    return (
      <div className="flex flex-row items-center gap-8 p-2 bg-gray-800 rounded-md text-white dark:bg-gray-900 w-[144px]">
        <span className="text-lg font-bold font-mono tracking-widest">
          Score <span className="text-2xl align-middle">{score.toString().padStart(4, '0')}</span>
          <span className="mx-4" />
          Stage <span className="text-xl align-middle">{stage}</span>
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2 p-2 bg-gray-800 rounded-md text-white dark:bg-gray-900 w-[144px]">
      <div className="text-lg font-bold">Score</div>
      <div className="text-2xl font-mono">{score}</div>
      <div className="text-lg font-bold mt-2">Stage</div>
      <div className="text-xl font-mono">{stage}</div>
    </div>
  );
};

export default ScoreBoard; 
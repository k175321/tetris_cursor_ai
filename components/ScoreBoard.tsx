import React from 'react';

interface ScoreBoardProps {
  score: number;
  stage: number;
}

// ScoreBoard: 점수와 스테이지 표시
const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, stage }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-2 bg-gray-800 rounded-md text-white dark:bg-gray-900">
      <div className="text-lg font-bold">Score</div>
      <div className="text-2xl font-mono">{score}</div>
      <div className="text-lg font-bold mt-2">Stage</div>
      <div className="text-xl font-mono">{stage}</div>
    </div>
  );
};

export default ScoreBoard; 
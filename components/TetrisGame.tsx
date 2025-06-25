"use client";
import React from 'react';
import GameBoard from './GameBoard';
import NextBlocks from './NextBlocks';
import ScoreBoard from './ScoreBoard';
import Controls, { ControlsGuide } from './Controls';
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
      <div className="flex flex-col md:flex-row gap-6 relative items-center justify-center">
        {/* 가운데: 게임 보드 및 오버레이 */}
        <div className="relative">
          <GameBoard 
            field={gameState.field} 
            activeBlock={gameState.activeBlock} 
            ghostPosition={ghostPosition}
            blockShape={gameState.activeBlock.block.shape}
          />
          <Overlay 
            isPaused={gameState.isPaused} 
            isGameOver={gameState.isGameOver} 
            onRestart={restart}
            onResume={gameState.isPaused && !gameState.isGameOver ? resume : undefined}
          />
        </div>
        {/* 오른쪽: 다음 블록 카드 + 점수/스테이지 */}
        <div className="flex flex-col gap-4 items-center md:items-start md:ml-4">
          <div className="bg-gray-800 dark:bg-gray-900 rounded-md p-6 w-[144px] h-[240px] flex flex-col items-center justify-start shadow-md overflow-hidden">
            <div className="text-lg font-bold text-white mb-2 text-center">Next</div>
            <NextBlocks nextBlocks={gameState.nextBlocks} />
          </div>
          <ScoreBoard score={gameState.score} stage={gameState.stage} />
          <ControlsGuide />
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
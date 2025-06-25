import React from 'react';

interface OverlayProps {
  isPaused: boolean;
  isGameOver: boolean;
  onRestart?: () => void;
}

// Overlay: 일시정지/게임오버 오버레이
const Overlay: React.FC<OverlayProps> = ({ isPaused, isGameOver, onRestart }) => {
  if (!isPaused && !isGameOver) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
      {isPaused && !isGameOver && (
        <>
          <div className="text-4xl font-bold text-white mb-2">Pause</div>
          {onRestart && (
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md text-lg font-semibold hover:bg-blue-600 transition mt-4"
              onClick={onRestart}
            >
              Restart
            </button>
          )}
        </>
      )}
      {isGameOver && (
        <>
          <div className="text-4xl font-bold text-red-400 mb-4">Game Over</div>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md text-lg font-semibold hover:bg-blue-600 transition"
            onClick={onRestart}
          >
            Restart
          </button>
        </>
      )}
    </div>
  );
};

export default Overlay; 
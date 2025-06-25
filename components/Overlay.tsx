import React from 'react';

interface OverlayProps {
  isPaused: boolean;
  isGameOver: boolean;
  onRestart?: () => void;
  onResume?: () => void;
}

// Overlay: 일시정지/게임오버 오버레이
const Overlay: React.FC<OverlayProps> = ({ isPaused, isGameOver, onRestart, onResume }) => {
  if (!isPaused && !isGameOver) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
      {isPaused && !isGameOver && (
        <>
          <div className="text-4xl font-bold text-white mb-2">Pause</div>
          {onResume && (
            <button
              className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-md text-lg font-semibold hover:bg-yellow-500 transition mt-2 mb-2"
              onClick={onResume}
            >
              Resume
            </button>
          )}
          {onRestart && (
            <button
              className="px-6 py-2 bg-orange-400 text-white rounded-md text-lg font-semibold hover:bg-orange-500 transition mt-2"
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
            className="px-6 py-2 bg-orange-400 text-white rounded-md text-lg font-semibold hover:bg-orange-500 transition"
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
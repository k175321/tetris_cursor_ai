import React from 'react';

interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
}

// Controls: 키보드 및 모바일 조작법 안내 + 모바일 터치 버튼
const Controls: React.FC<ControlsProps> = ({ onLeft, onRight, onDown, onRotate, onHardDrop, onPause }) => {
  return (
    <div className="w-full max-w-[360px] flex flex-col items-center mt-2 gap-2">
      {/* 키보드 안내 */}
      <div className="text-xs text-gray-400 flex flex-col gap-1 items-center mb-2">
        <div>← → : 좌우 이동</div>
        <div>↑ : 회전</div>
        <div>↓ : 한 칸 내리기</div>
        <div>Space : 하드 드롭</div>
        <div>ESC : 일시정지</div>
      </div>
      {/* 모바일 터치 버튼 (md 이하에서만 보임) */}
      <div className="flex flex-col gap-2 w-full md:hidden">
        <div className="flex justify-between gap-2">
          <button aria-label="왼쪽" className="flex-1 py-2 bg-gray-700 text-white rounded-md active:bg-gray-600" onClick={onLeft}>←</button>
          <button aria-label="회전" className="flex-1 py-2 bg-purple-500 text-white rounded-md active:bg-purple-600" onClick={onRotate}>⟳</button>
          <button aria-label="오른쪽" className="flex-1 py-2 bg-gray-700 text-white rounded-md active:bg-gray-600" onClick={onRight}>→</button>
        </div>
        <div className="flex justify-between gap-2 mt-1">
          <button aria-label="하드드롭" className="flex-1 py-2 bg-cyan-500 text-white rounded-md active:bg-cyan-600" onClick={onHardDrop}>↓↯</button>
          <button aria-label="아래로" className="flex-1 py-2 bg-gray-700 text-white rounded-md active:bg-gray-600" onClick={onDown}>↓</button>
          <button aria-label="일시정지" className="flex-1 py-2 bg-red-500 text-white rounded-md active:bg-red-600" onClick={onPause}>⏸</button>
        </div>
      </div>
    </div>
  );
};

export default Controls; 
// 테트리스 블록 모양 정의
export type Tetromino = number[][];

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Block {
  shape: Tetromino;
  type: TetrominoType;
  color: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface ActiveBlock {
  block: Block;
  position: Position;
  rotation: number;
}

export type Cell = {
  type: TetrominoType | null;
  color: string | null;
  filled: boolean;
};

export type GameField = Cell[][];

export interface GameState {
  field: GameField;
  activeBlock: ActiveBlock;
  nextBlocks: Block[];
  score: number;
  stage: number;
  isPaused: boolean;
  isGameOver: boolean;
} 
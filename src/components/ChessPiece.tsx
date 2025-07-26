import { ChessPiece as ChessPieceType } from '../types/chess';

interface ChessPieceProps {
  piece: ChessPieceType;
  size?: number;
}

const pieceSymbols = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

export const ChessPiece = ({ piece, size }: ChessPieceProps) => {
  const symbol = pieceSymbols[piece.color][piece.type];
  
  return (
    <div 
      className="chess-piece flex items-center justify-center select-none text-2xl sm:text-4xl md:text-5xl"
      style={size ? { fontSize: `${size}px` } : {}}
    >
      {symbol}
    </div>
  );
};
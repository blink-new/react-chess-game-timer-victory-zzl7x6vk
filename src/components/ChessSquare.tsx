import { ChessPiece as ChessPieceType, Position } from '../types/chess';
import { ChessPiece } from './ChessPiece';

interface ChessSquareProps {
  position: Position;
  piece: ChessPieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: (position: Position) => void;
}

export const ChessSquare = ({ 
  position, 
  piece, 
  isLight, 
  isSelected, 
  isValidMove, 
  onClick 
}: ChessSquareProps) => {
  const baseClasses = "chess-square aspect-square flex items-center justify-center relative cursor-pointer";
  const colorClasses = isLight ? "bg-amber-100" : "bg-amber-800";
  const stateClasses = `${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''}`;
  
  return (
    <div
      className={`${baseClasses} ${colorClasses} ${stateClasses}`}
      onClick={() => onClick(position)}
    >
      {piece && <ChessPiece piece={piece} />}
      {isValidMove && !piece && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 sm:w-4 sm:h-4 bg-accent rounded-full opacity-60" />
        </div>
      )}
      {isValidMove && piece && (
        <div className="absolute inset-0 border-2 sm:border-4 border-accent rounded-full opacity-60" />
      )}
    </div>
  );
};
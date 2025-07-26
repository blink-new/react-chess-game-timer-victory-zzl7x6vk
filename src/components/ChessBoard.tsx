import { Board, Position } from '../types/chess';
import { ChessSquare } from './ChessSquare';

interface ChessBoardProps {
  board: Board;
  selectedSquare: Position | null;
  validMoves: Position[];
  onSquareClick: (position: Position) => void;
}

export const ChessBoard = ({ board, selectedSquare, validMoves, onSquareClick }: ChessBoardProps) => {
  const isSquareLight = (row: number, col: number) => (row + col) % 2 === 0;
  
  const isSelected = (row: number, col: number) => 
    selectedSquare?.row === row && selectedSquare?.col === col;
  
  const isValidMove = (row: number, col: number) =>
    validMoves.some(move => move.row === row && move.col === col);

  return (
    <div className="w-full max-w-[90vw] sm:max-w-[600px] mx-auto border-4 border-primary rounded-lg shadow-2xl bg-primary p-1 sm:p-2">
      <div className="grid grid-cols-8 gap-0 w-full">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              position={{ row: rowIndex, col: colIndex }}
              piece={piece}
              isLight={isSquareLight(rowIndex, colIndex)}
              isSelected={isSelected(rowIndex, colIndex)}
              isValidMove={isValidMove(rowIndex, colIndex)}
              onClick={onSquareClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
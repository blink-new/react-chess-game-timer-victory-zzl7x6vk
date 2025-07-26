import { Board, ChessPiece, Position, PieceColor, PieceType } from '../types/chess';

export const createInitialBoard = (): Board => {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  
  // Place other pieces
  const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieceOrder[col], color: 'black' };
    board[7][col] = { type: pieceOrder[col], color: 'white' };
  }
  
  return board;
};

export const isValidPosition = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

export const getPieceAt = (board: Board, pos: Position): ChessPiece | null => {
  if (!isValidPosition(pos)) return null;
  return board[pos.row][pos.col];
};

export const isSquareOccupiedByColor = (board: Board, pos: Position, color: PieceColor): boolean => {
  const piece = getPieceAt(board, pos);
  return piece !== null && piece.color === color;
};

export const isSquareEmpty = (board: Board, pos: Position): boolean => {
  return getPieceAt(board, pos) === null;
};

const getPawnMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Move forward one square
  const oneForward = { row: from.row + direction, col: from.col };
  if (isValidPosition(oneForward) && isSquareEmpty(board, oneForward)) {
    moves.push(oneForward);
    
    // Move forward two squares from starting position
    if (from.row === startRow) {
      const twoForward = { row: from.row + 2 * direction, col: from.col };
      if (isValidPosition(twoForward) && isSquareEmpty(board, twoForward)) {
        moves.push(twoForward);
      }
    }
  }
  
  // Capture diagonally
  const captureLeft = { row: from.row + direction, col: from.col - 1 };
  const captureRight = { row: from.row + direction, col: from.col + 1 };
  
  if (isValidPosition(captureLeft) && !isSquareEmpty(board, captureLeft) && !isSquareOccupiedByColor(board, captureLeft, color)) {
    moves.push(captureLeft);
  }
  
  if (isValidPosition(captureRight) && !isSquareEmpty(board, captureRight) && !isSquareOccupiedByColor(board, captureRight, color)) {
    moves.push(captureRight);
  }
  
  return moves;
};

const getRookMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { row: 0, col: 1 },   // right
    { row: 0, col: -1 },  // left
    { row: 1, col: 0 },   // down
    { row: -1, col: 0 }   // up
  ];
  
  for (const dir of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: from.row + dir.row * i, col: from.col + dir.col * i };
      
      if (!isValidPosition(newPos)) break;
      
      if (isSquareEmpty(board, newPos)) {
        moves.push(newPos);
      } else {
        if (!isSquareOccupiedByColor(board, newPos, color)) {
          moves.push(newPos);
        }
        break;
      }
    }
  }
  
  return moves;
};

const getBishopMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { row: 1, col: 1 },   // down-right
    { row: 1, col: -1 },  // down-left
    { row: -1, col: 1 },  // up-right
    { row: -1, col: -1 }  // up-left
  ];
  
  for (const dir of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: from.row + dir.row * i, col: from.col + dir.col * i };
      
      if (!isValidPosition(newPos)) break;
      
      if (isSquareEmpty(board, newPos)) {
        moves.push(newPos);
      } else {
        if (!isSquareOccupiedByColor(board, newPos, color)) {
          moves.push(newPos);
        }
        break;
      }
    }
  }
  
  return moves;
};

const getQueenMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  return [...getRookMoves(board, from, color), ...getBishopMoves(board, from, color)];
};

const getKingMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 },                        { row: 0, col: 1 },
    { row: 1, col: -1 },  { row: 1, col: 0 },  { row: 1, col: 1 }
  ];
  
  for (const dir of directions) {
    const newPos = { row: from.row + dir.row, col: from.col + dir.col };
    
    if (isValidPosition(newPos) && !isSquareOccupiedByColor(board, newPos, color)) {
      moves.push(newPos);
    }
  }
  
  return moves;
};

const getKnightMoves = (board: Board, from: Position, color: PieceColor): Position[] => {
  const moves: Position[] = [];
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 },  { row: 1, col: 2 },
    { row: 2, col: -1 },  { row: 2, col: 1 }
  ];
  
  for (const move of knightMoves) {
    const newPos = { row: from.row + move.row, col: from.col + move.col };
    
    if (isValidPosition(newPos) && !isSquareOccupiedByColor(board, newPos, color)) {
      moves.push(newPos);
    }
  }
  
  return moves;
};

export const getValidMoves = (board: Board, from: Position): Position[] => {
  const piece = getPieceAt(board, from);
  if (!piece) return [];
  
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, from, piece.color);
    case 'rook':
      return getRookMoves(board, from, piece.color);
    case 'bishop':
      return getBishopMoves(board, from, piece.color);
    case 'queen':
      return getQueenMoves(board, from, piece.color);
    case 'king':
      return getKingMoves(board, from, piece.color);
    case 'knight':
      return getKnightMoves(board, from, piece.color);
    default:
      return [];
  }
};

export const findKing = (board: Board, color: PieceColor): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

export const isInCheck = (board: Board, color: PieceColor): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  
  const opponentColor = color === 'white' ? 'black' : 'white';
  
  // Check if any opponent piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const moves = getValidMoves(board, { row, col });
        if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

export const isCheckmate = (board: Board, color: PieceColor): boolean => {
  if (!isInCheck(board, color)) return false;
  
  // Try all possible moves for the current player
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col });
        
        for (const move of moves) {
          // Simulate the move
          const newBoard = board.map(row => [...row]);
          newBoard[move.row][move.col] = newBoard[row][col];
          newBoard[row][col] = null;
          
          // Check if this move gets the king out of check
          if (!isInCheck(newBoard, color)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
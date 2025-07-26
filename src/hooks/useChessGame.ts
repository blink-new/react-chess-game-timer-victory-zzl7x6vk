import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Position, Move, PieceColor } from '../types/chess';
import { 
  createInitialBoard, 
  getValidMoves, 
  getPieceAt, 
  isInCheck, 
  isCheckmate 
} from '../utils/chessLogic';

const INITIAL_TIME = 600; // 10 minutes in seconds

export const useChessGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    gameStatus: 'playing',
    winner: null,
    moveHistory: [],
    timer: {
      white: INITIAL_TIME,
      black: INITIAL_TIME,
      isRunning: false,
      activePlayer: 'white'
    }
  }));

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (gameState.timer.isRunning && gameState.gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTime = prev.timer.activePlayer === 'white' 
            ? Math.max(0, prev.timer.white - 1)
            : Math.max(0, prev.timer.black - 1);
          
          // Check for time out
          if (newTime === 0) {
            const winner = prev.timer.activePlayer === 'white' ? 'black' : 'white';
            return {
              ...prev,
              gameStatus: 'checkmate',
              winner,
              timer: {
                ...prev.timer,
                isRunning: false,
                [prev.timer.activePlayer]: 0
              }
            };
          }
          
          return {
            ...prev,
            timer: {
              ...prev.timer,
              [prev.timer.activePlayer]: newTime
            }
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.timer.isRunning, gameState.gameStatus]);

  const makeMove = useCallback((from: Position, to: Position) => {
    setGameState(prev => {
      const piece = getPieceAt(prev.board, from);
      if (!piece || piece.color !== prev.currentPlayer) return prev;

      const capturedPiece = getPieceAt(prev.board, to);
      
      // Create new board with the move
      const newBoard = prev.board.map(row => [...row]);
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;

      // Create move record
      const move: Move = {
        from,
        to,
        piece,
        capturedPiece: capturedPiece || undefined,
        timestamp: Date.now()
      };

      const nextPlayer: PieceColor = prev.currentPlayer === 'white' ? 'black' : 'white';
      
      // Check game status - King capture ends the game immediately
      let gameStatus = 'playing';
      let winner = null;
      
      // If a king was captured, the game ends immediately
      if (capturedPiece && capturedPiece.type === 'king') {
        gameStatus = 'checkmate';
        winner = prev.currentPlayer;
      } else {
        // Otherwise check for check/checkmate as before
        if (isInCheck(newBoard, nextPlayer)) {
          if (isCheckmate(newBoard, nextPlayer)) {
            gameStatus = 'checkmate';
            winner = prev.currentPlayer;
          } else {
            gameStatus = 'check';
          }
        }
      }

      return {
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        selectedSquare: null,
        validMoves: [],
        gameStatus,
        winner,
        moveHistory: [...prev.moveHistory, move],
        timer: {
          ...prev.timer,
          activePlayer: nextPlayer,
          isRunning: gameStatus === 'playing' ? prev.timer.isRunning : false
        }
      };
    });
  }, []);

  const selectSquare = useCallback((position: Position) => {
    setGameState(prev => {
      const piece = getPieceAt(prev.board, position);
      
      // If clicking on a valid move, make the move
      if (prev.selectedSquare && prev.validMoves.some(move => 
        move.row === position.row && move.col === position.col
      )) {
        makeMove(prev.selectedSquare, position);
        return prev;
      }
      
      // If clicking on own piece, select it
      if (piece && piece.color === prev.currentPlayer) {
        const validMoves = getValidMoves(prev.board, position);
        return {
          ...prev,
          selectedSquare: position,
          validMoves
        };
      }
      
      // Otherwise, deselect
      return {
        ...prev,
        selectedSquare: null,
        validMoves: []
      };
    });
  }, [makeMove]);

  const toggleTimer = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      timer: {
        ...prev.timer,
        isRunning: !prev.timer.isRunning
      }
    }));
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      gameStatus: 'playing',
      winner: null,
      moveHistory: [],
      timer: {
        white: INITIAL_TIME,
        black: INITIAL_TIME,
        isRunning: false,
        activePlayer: 'white'
      }
    });
  }, []);

  return {
    gameState,
    selectSquare,
    toggleTimer,
    resetGame
  };
};
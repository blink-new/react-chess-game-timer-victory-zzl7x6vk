import { useState, useEffect, useRef } from 'react';
import { ChessBoard } from './components/ChessBoard';
import { GameControls } from './components/GameControls';
import { VictoryModal } from './components/VictoryModal';
import { useChessGame } from './hooks/useChessGame';
import { Crown, Sparkles } from 'lucide-react';

function App() {
  const { gameState, selectSquare, toggleTimer, resetGame } = useChessGame();
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const lastGameStatusRef = useRef(gameState.gameStatus);
  const modalShownForGameRef = useRef(false);

  // Show victory modal when game ends (only once per game)
  useEffect(() => {
    const gameEnded = gameState.gameStatus === 'checkmate' || gameState.gameStatus === 'stalemate';
    const gameStatusChanged = lastGameStatusRef.current !== gameState.gameStatus;
    
    if (gameEnded && gameStatusChanged && !modalShownForGameRef.current) {
      setTimeout(() => {
        setShowVictoryModal(true);
        modalShownForGameRef.current = true;
      }, 500);
    }
    
    // Reset modal tracking when game is reset
    if (gameState.gameStatus === 'playing') {
      modalShownForGameRef.current = false;
    }
    
    lastGameStatusRef.current = gameState.gameStatus;
  }, [gameState.gameStatus]);

  const handleResetGame = () => {
    resetGame();
    setShowVictoryModal(false);
    modalShownForGameRef.current = false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Chess Master</h1>
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <p className="text-muted-foreground text-lg">
            A beautiful chess game with timer and victory celebrations
          </p>
        </div>

        {/* Game Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 lg:gap-8">
          {/* Chess Board */}
          <div className="w-full lg:flex-shrink-0 lg:w-auto">
            <ChessBoard
              board={gameState.board}
              selectedSquare={gameState.selectedSquare}
              validMoves={gameState.validMoves}
              onSquareClick={selectSquare}
            />
          </div>

          {/* Game Controls */}
          <div className="w-full max-w-md lg:w-80">
            <GameControls
              currentPlayer={gameState.currentPlayer}
              whiteTime={gameState.timer.white}
              blackTime={gameState.timer.black}
              isTimerRunning={gameState.timer.isRunning}
              gameStatus={gameState.gameStatus}
              onToggleTimer={toggleTimer}
              onResetGame={handleResetGame}
            />
          </div>
        </div>

        {/* Victory Modal */}
        <VictoryModal
          isOpen={showVictoryModal}
          winner={gameState.winner}
          gameStatus={gameState.gameStatus}
          onClose={() => setShowVictoryModal(false)}
          onResetGame={handleResetGame}
        />
      </div>
    </div>
  );
}

export default App;
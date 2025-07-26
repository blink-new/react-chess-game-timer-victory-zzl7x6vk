import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { PieceColor } from '../types/chess';
import { formatTime } from '../utils/chessLogic';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface GameControlsProps {
  currentPlayer: PieceColor;
  whiteTime: number;
  blackTime: number;
  isTimerRunning: boolean;
  gameStatus: string;
  onToggleTimer: () => void;
  onResetGame: () => void;
}

export const GameControls = ({
  currentPlayer,
  whiteTime,
  blackTime,
  isTimerRunning,
  gameStatus,
  onToggleTimer,
  onResetGame
}: GameControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Timer Display */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold">Game Timer</h3>
          </div>
          
          <div className="space-y-3">
            {/* White Timer */}
            <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              currentPlayer === 'white' && isTimerRunning 
                ? 'bg-primary/20 ring-2 ring-primary timer-active' 
                : 'bg-muted/50'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full"></div>
                <span className="font-medium">White</span>
              </div>
              <span className="text-xl font-mono font-bold">
                {formatTime(whiteTime)}
              </span>
            </div>
            
            {/* Black Timer */}
            <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              currentPlayer === 'black' && isTimerRunning 
                ? 'bg-primary/20 ring-2 ring-primary timer-active' 
                : 'bg-muted/50'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded-full"></div>
                <span className="font-medium">Black</span>
              </div>
              <span className="text-xl font-mono font-bold">
                {formatTime(blackTime)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Status */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Turn</div>
            <div className={`text-lg font-bold capitalize ${
              currentPlayer === 'white' ? 'text-gray-700' : 'text-gray-900'
            }`}>
              {currentPlayer}
            </div>
            {gameStatus !== 'playing' && (
              <div className="text-sm font-medium text-destructive">
                {gameStatus === 'check' && 'Check!'}
                {gameStatus === 'checkmate' && 'Checkmate!'}
                {gameStatus === 'stalemate' && 'Stalemate!'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <div className="space-y-2">
        <Button
          onClick={onToggleTimer}
          variant="outline"
          size="lg"
          className="w-full bg-accent/10 hover:bg-accent/20 border-accent text-accent-foreground"
        >
          {isTimerRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Stop Timer
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </>
          )}
        </Button>
        
        <Button
          onClick={onResetGame}
          variant="outline"
          size="lg"
          className="w-full hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Game
        </Button>
      </div>
    </div>
  );
};
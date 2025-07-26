import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { PieceColor } from '../types/chess';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VictoryModalProps {
  isOpen: boolean;
  winner: PieceColor | null;
  gameStatus: string;
  onClose: () => void;
  onResetGame: () => void;
}

export const VictoryModal = ({ isOpen, winner, gameStatus, onClose, onResetGame }: VictoryModalProps) => {
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (isOpen && winner) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        color: ['#D4AF37', '#8B4513', '#F5F5DC', '#FFD700'][Math.floor(Math.random() * 4)]
      }));
      setConfettiPieces(pieces);
    }
  }, [isOpen, winner]);

  const getVictoryMessage = () => {
    if (gameStatus === 'checkmate') {
      return `${winner?.charAt(0).toUpperCase()}${winner?.slice(1)} wins by checkmate!`;
    }
    if (gameStatus === 'stalemate') {
      return "It's a stalemate - Draw!";
    }
    return `${winner?.charAt(0).toUpperCase()}${winner?.slice(1)} wins!`;
  };

  const getPlayerName = () => {
    return winner === 'white' ? 'White Player' : 'Black Player';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-accent/20 to-primary/20 border-accent">
        {/* Confetti Animation */}
        {winner && confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="confetti absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`
            }}
          />
        ))}
        
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {winner ? (
              <div className="relative">
                <Trophy className="w-16 h-16 text-accent animate-bounce" />
                <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-pulse" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
            )}
          </div>
          
          <DialogTitle className="text-2xl font-bold text-center">
            {winner ? 'Victory!' : 'Game Over!'}
          </DialogTitle>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-center">
              {getVictoryMessage()}
            </p>
            
            {winner && (
              <div className="bg-accent/20 rounded-lg p-4 border border-accent/30">
                <p className="text-xl font-bold text-center text-accent-foreground">
                  🎉 {getPlayerName()}, Congratulations! 🎉
                </p>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={() => {
              onResetGame();
              onClose();
            }}
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          
          <Button
            onClick={()=>{ onClose(); }}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
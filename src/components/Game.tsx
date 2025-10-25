import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSound } from '@/hooks/useMusic';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'block' | 'platform' | 'speed_boost';
}

interface Level {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Extreme';
  color: string;
  objects: GameObject[];
  duration: number;
  speed: number;
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Stereo Madness',
    difficulty: 'Easy',
    color: '#8B5CF6',
    speed: 5,
    duration: 22,
    objects: [
      { x: 300, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 500, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 700, y: 300, width: 100, height: 50, type: 'platform' },
      { x: 900, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1100, y: 250, width: 120, height: 50, type: 'platform' },
      { x: 1300, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1500, y: 320, width: 80, height: 50, type: 'block' },
      { x: 1700, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1900, y: 280, width: 100, height: 50, type: 'platform' },
      { x: 2100, y: 350, width: 40, height: 40, type: 'spike' },
    ]
  },
  {
    id: 2,
    name: 'Back on Track',
    difficulty: 'Medium',
    color: '#0EA5E9',
    speed: 6,
    duration: 23,
    objects: [
      { x: 250, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 400, y: 280, width: 100, height: 50, type: 'platform' },
      { x: 600, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 700, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 900, y: 240, width: 120, height: 50, type: 'platform' },
      { x: 1100, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1250, y: 300, width: 80, height: 50, type: 'block' },
      { x: 1450, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1600, y: 260, width: 100, height: 50, type: 'platform' },
      { x: 1800, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2000, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2200, y: 220, width: 120, height: 50, type: 'platform' },
    ]
  },
  {
    id: 3,
    name: 'Polargeist',
    difficulty: 'Hard',
    color: '#F97316',
    speed: 7,
    duration: 24,
    objects: [
      { x: 200, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 350, y: 250, width: 100, height: 50, type: 'platform' },
      { x: 550, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 650, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 800, y: 200, width: 120, height: 50, type: 'platform' },
      { x: 1000, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1100, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1200, y: 300, width: 50, height: 60, type: 'speed_boost' },
      { x: 1250, y: 280, width: 80, height: 50, type: 'block' },
      { x: 1450, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1600, y: 230, width: 100, height: 50, type: 'platform' },
      { x: 1800, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1900, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2100, y: 190, width: 120, height: 50, type: 'platform' },
      { x: 2300, y: 350, width: 40, height: 40, type: 'spike' },
    ]
  },
  {
    id: 4,
    name: 'Dry Out',
    difficulty: 'Expert',
    color: '#D946EF',
    speed: 8,
    duration: 25,
    objects: [
      { x: 180, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 280, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 430, y: 240, width: 100, height: 50, type: 'platform' },
      { x: 600, y: 280, width: 50, height: 60, type: 'speed_boost' },
      { x: 630, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 730, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 880, y: 180, width: 120, height: 50, type: 'platform' },
      { x: 1080, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1180, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1330, y: 270, width: 80, height: 50, type: 'block' },
      { x: 1530, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1680, y: 210, width: 100, height: 50, type: 'platform' },
      { x: 1850, y: 260, width: 50, height: 60, type: 'speed_boost' },
      { x: 1880, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1980, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2180, y: 170, width: 120, height: 50, type: 'platform' },
      { x: 2380, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2480, y: 350, width: 40, height: 40, type: 'spike' },
    ]
  },
  {
    id: 5,
    name: 'Hexagon Force',
    difficulty: 'Extreme',
    color: '#EF4444',
    speed: 9,
    duration: 26,
    objects: [
      { x: 150, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 250, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 350, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 500, y: 230, width: 100, height: 50, type: 'platform' },
      { x: 670, y: 270, width: 50, height: 60, type: 'speed_boost' },
      { x: 700, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 800, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 950, y: 160, width: 120, height: 50, type: 'platform' },
      { x: 1150, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1250, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1400, y: 260, width: 80, height: 50, type: 'block' },
      { x: 1570, y: 280, width: 50, height: 60, type: 'speed_boost' },
      { x: 1600, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 1750, y: 190, width: 100, height: 50, type: 'platform' },
      { x: 1950, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2050, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2220, y: 240, width: 50, height: 60, type: 'speed_boost' },
      { x: 2250, y: 150, width: 120, height: 50, type: 'platform' },
      { x: 2450, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2550, y: 350, width: 40, height: 40, type: 'spike' },
      { x: 2650, y: 350, width: 40, height: 40, type: 'spike' },
    ]
  }
];

interface GameProps {
  onBack: () => void;
  levelId: number;
}

export default function Game({ onBack, levelId }: GameProps) {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { jumpSound, deathSound, victorySound } = useSound();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [playerY, setPlayerY] = useState(320);
  const [velocityY, setVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [cameraX, setCameraX] = useState(0);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];
  const PLAYER_SIZE = 40;
  const PLAYER_X = 100;
  const GROUND_Y = 360;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;

  useEffect(() => {
    if (!isPlaying || gameOver || victory) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let currentVelocityY = velocityY;
    let currentPlayerY = playerY;
    let currentCameraX = cameraX;
    const currentSpeedMultiplier = speedMultiplier;
    const currentCollectedBoosts = [...collectedBoosts];
    let isOnGround = false;

    const gameLoop = () => {
      ctx.fillStyle = '#1A1F2C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#2A2F3C';
      ctx.fillRect(0, GROUND_Y + PLAYER_SIZE, canvas.width, canvas.height);

      currentCameraX += level.speed * currentSpeedMultiplier;
      setCameraX(currentCameraX);

      const progressPercent = Math.min((currentCameraX / (level.objects[level.objects.length - 1].x + 500)) * 100, 100);
      setProgress(progressPercent);

      if (progressPercent >= 100) {
        setVictory(true);
        setIsPlaying(false);
        return;
      }

      currentVelocityY += GRAVITY;
      currentPlayerY += currentVelocityY;

      isOnGround = false;
      for (let i = 0; i < level.objects.length; i++) {
        const obj = level.objects[i];
        const objScreenX = obj.x - currentCameraX;
        
        if (
          PLAYER_X + PLAYER_SIZE > objScreenX &&
          PLAYER_X < objScreenX + obj.width &&
          currentPlayerY + PLAYER_SIZE > obj.y &&
          currentPlayerY < obj.y + obj.height
        ) {
          if (obj.type === 'spike') {
            setGameOver(true);
            setIsPlaying(false);
            setAttempts(prev => prev + 1);
            return;
          }
          
          if (obj.type === 'speed_boost' && !currentCollectedBoosts.includes(i)) {
            currentSpeedMultiplier = Math.min(currentSpeedMultiplier + 0.5, 2.5);
            currentCollectedBoosts.push(i);
            setSpeedMultiplier(currentSpeedMultiplier);
            setCollectedBoosts(currentCollectedBoosts);
          }
          
          if (obj.type === 'platform' || obj.type === 'block') {
            if (currentVelocityY > 0 && currentPlayerY + PLAYER_SIZE - currentVelocityY <= obj.y) {
              currentPlayerY = obj.y - PLAYER_SIZE;
              currentVelocityY = 0;
              isOnGround = true;
            }
          }
        }
      }

      if (currentPlayerY >= GROUND_Y) {
        currentPlayerY = GROUND_Y;
        currentVelocityY = 0;
        isOnGround = true;
      }

      if (currentPlayerY < 0) {
        currentPlayerY = 0;
        currentVelocityY = 0;
      }

      setPlayerY(currentPlayerY);
      setVelocityY(currentVelocityY);
      setIsJumping(!isOnGround);

      level.objects.forEach((obj, index) => {
        const objScreenX = obj.x - currentCameraX;
        
        if (objScreenX > -obj.width && objScreenX < canvas.width) {
          if (obj.type === 'spike') {
            ctx.fillStyle = '#EF4444';
            ctx.beginPath();
            ctx.moveTo(objScreenX + obj.width / 2, obj.y);
            ctx.lineTo(objScreenX + obj.width, obj.y + obj.height);
            ctx.lineTo(objScreenX, obj.y + obj.height);
            ctx.closePath();
            ctx.fill();
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#EF4444';
            ctx.fill();
            ctx.shadowBlur = 0;
          } else if (obj.type === 'speed_boost') {
            const isCollected = currentCollectedBoosts.includes(index);
            const boostColor = isCollected ? '#4B5563' : '#10B981';
            
            ctx.fillStyle = boostColor;
            ctx.fillRect(objScreenX, obj.y, obj.width, obj.height);
            
            if (!isCollected) {
              ctx.shadowBlur = 20;
              ctx.shadowColor = '#10B981';
              ctx.fillRect(objScreenX, obj.y, obj.width, obj.height);
              ctx.shadowBlur = 0;
              
              ctx.fillStyle = '#FFFFFF';
              ctx.font = 'bold 30px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('»»', objScreenX + obj.width / 2, obj.y + obj.height / 2);
            }
          } else if (obj.type === 'platform') {
            ctx.fillStyle = level.color;
            ctx.fillRect(objScreenX, obj.y, obj.width, obj.height);
            
            ctx.shadowBlur = 10;
            ctx.shadowColor = level.color;
            ctx.fillRect(objScreenX, obj.y, obj.width, obj.height);
            ctx.shadowBlur = 0;
          } else if (obj.type === 'block') {
            ctx.fillStyle = '#6B7280';
            ctx.fillRect(objScreenX, obj.y, obj.width, obj.height);
            ctx.strokeStyle = '#9CA3AF';
            ctx.lineWidth = 2;
            ctx.strokeRect(objScreenX, obj.y, obj.width, obj.height);
          }
        }
      });

      const gradient = ctx.createLinearGradient(PLAYER_X, currentPlayerY, PLAYER_X + PLAYER_SIZE, currentPlayerY + PLAYER_SIZE);
      gradient.addColorStop(0, level.color);
      gradient.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = gradient;
      ctx.fillRect(PLAYER_X, currentPlayerY, PLAYER_SIZE, PLAYER_SIZE);
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = level.color;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.strokeRect(PLAYER_X, currentPlayerY, PLAYER_SIZE, PLAYER_SIZE);
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, gameOver, victory, level, velocityY, playerY, cameraX, speedMultiplier, collectedBoosts]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && isPlaying && !isJumping) {
        setVelocityY(JUMP_STRENGTH);
      }
    };

    const handleClick = () => {
      if (isPlaying && !isJumping) {
        setVelocityY(JUMP_STRENGTH);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [isPlaying, isJumping]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setVictory(false);
    setPlayerY(GROUND_Y);
    setVelocityY(0);
    setCameraX(0);
    setProgress(0);
    setSpeedMultiplier(1);
    setCollectedBoosts([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-6 bg-card/50 backdrop-blur-sm border-2" style={{ borderColor: level.color }}>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold" style={{ color: level.color }}>{level.name}</h2>
            <p className="text-sm text-muted-foreground">{level.difficulty}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Скорость</p>
            <p className="text-xl font-bold text-green-400">{speedMultiplier.toFixed(1)}x</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Попыток</p>
            <p className="text-xl font-bold">{attempts}</p>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full border-2 rounded-lg"
            style={{ borderColor: level.color, backgroundColor: '#1A1F2C' }}
          />
          
          {!isPlaying && !gameOver && !victory && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
              <div className="text-center">
                <Button onClick={startGame} size="lg" className="gap-2 animate-bounce-in" style={{ backgroundColor: level.color }}>
                  <Icon name="Play" size={24} />
                  Начать
                </Button>
                <p className="mt-4 text-muted-foreground">Нажми пробел или кликни для прыжка</p>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
              <div className="text-center animate-slide-up">
                <Icon name="X" size={64} className="mx-auto mb-4 text-destructive" />
                <h3 className="text-3xl font-bold mb-4">Game Over!</h3>
                <p className="text-muted-foreground mb-6">Прогресс: {Math.floor(progress)}%</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="gap-2" style={{ backgroundColor: level.color }}>
                    <Icon name="RotateCcw" size={20} />
                    Ещё раз
                  </Button>
                  <Button onClick={onBack} variant="outline">
                    Меню
                  </Button>
                </div>
              </div>
            </div>
          )}

          {victory && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
              <div className="text-center animate-bounce-in">
                <Icon name="Trophy" size={64} className="mx-auto mb-4 animate-pulse-glow" style={{ color: level.color }} />
                <h3 className="text-3xl font-bold mb-4">Победа!</h3>
                <p className="text-muted-foreground mb-6">Попыток: {attempts + 1}</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="gap-2" style={{ backgroundColor: level.color }}>
                    <Icon name="RotateCcw" size={20} />
                    Ещё раз
                  </Button>
                  <Button onClick={onBack} variant="outline">
                    Меню
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Прогресс</span>
            <span className="text-sm font-bold">{Math.floor(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-200 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: level.color }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
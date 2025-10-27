import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MiniGamesProps {
  onClose: () => void;
  onWin: (coins: number) => void;
}

type GameType = 'menu' | 'fishing' | 'guess' | 'clicker';

const MiniGames = ({ onClose, onWin }: MiniGamesProps) => {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  if (currentGame === 'fishing') {
    return <FishingGame onBack={() => setCurrentGame('menu')} onWin={onWin} />;
  }

  if (currentGame === 'guess') {
    return <GuessGame onBack={() => setCurrentGame('menu')} onWin={onWin} />;
  }

  if (currentGame === 'clicker') {
    return <ClickerGame onBack={() => setCurrentGame('menu')} onWin={onWin} />;
  }

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-600">🎮 Мини-игры</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setCurrentGame('fishing')}
            className="w-full h-20 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎣</div>
              <div className="text-left">
                <div className="font-bold text-lg">Поймай рыбку</div>
                <div className="text-sm opacity-90">Награда: 15 монет</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => setCurrentGame('guess')}
            className="w-full h-20 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🐾</div>
              <div className="text-left">
                <div className="font-bold text-lg">Угадай лапку</div>
                <div className="text-sm opacity-90">Награда: 20 монет</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => setCurrentGame('clicker')}
            className="w-full h-20 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">⚡</div>
              <div className="text-left">
                <div className="font-bold text-lg">Быстрые клики</div>
                <div className="text-sm opacity-90">Награда: до 25 монет</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

const FishingGame = ({ onBack, onWin }: { onBack: () => void; onWin: (coins: number) => void }) => {
  const [fishPosition, setFishPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFishPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      if (score >= 5) {
        onWin(15);
      }
    }
  }, [timeLeft, gameOver, score, onWin]);

  const catchFish = () => {
    setScore(score + 1);
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
      <div className="bg-gradient-to-b from-blue-300 to-blue-500 rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">🎣 Поймай рыбку</h3>
            <p className="text-white/90 text-sm">Поймай 5 рыбок за 10 секунд!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white rounded-full">
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="flex justify-between text-lg font-bold">
            <span>🐟 Рыбок: {score}/5</span>
            <span>⏱️ Время: {timeLeft}с</span>
          </div>
        </div>

        <div className="relative bg-blue-600 rounded-2xl h-80 overflow-hidden">
          {!gameOver ? (
            <button
              onClick={catchFish}
              className="absolute text-4xl transition-all duration-300 hover:scale-125 cursor-pointer"
              style={{ left: `${fishPosition.x}%`, top: `${fishPosition.y}%` }}
            >
              🐟
            </button>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">{score >= 5 ? '🎉' : '😿'}</div>
                <h3 className="text-3xl font-bold mb-2">
                  {score >= 5 ? 'Победа!' : 'Попробуй ещё!'}
                </h3>
                <p className="text-xl mb-4">Поймано: {score}/5</p>
                <Button onClick={onBack} className="bg-white text-blue-600 hover:bg-gray-100">
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GuessGame = ({ onBack, onWin }: { onBack: () => void; onWin: (coins: number) => void }) => {
  const [cups, setCups] = useState([0, 1, 2]);
  const [correctCup, setCorrectCup] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [shuffling, setShuffling] = useState(false);

  const shuffle = () => {
    setShuffling(true);
    setSelected(null);
    const newCorrect = Math.floor(Math.random() * 3);
    setCorrectCup(newCorrect);
    
    setTimeout(() => {
      const shuffled = [...cups].sort(() => Math.random() - 0.5);
      setCups(shuffled);
      setShuffling(false);
    }, 1000);
  };

  useEffect(() => {
    shuffle();
  }, []);

  const handleSelect = (index: number) => {
    if (shuffling || selected !== null) return;
    
    setSelected(index);
    if (index === correctCup) {
      setTimeout(() => {
        onWin(20);
        onBack();
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
      <div className="bg-gradient-to-b from-pink-300 to-pink-500 rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">🐾 Угадай лапку</h3>
            <p className="text-white/90 text-sm">Под какой чашкой лапка?</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white rounded-full">
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="flex justify-center gap-4 mb-6 min-h-[200px] items-center">
          {cups.map((cup, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={shuffling}
              className={`text-6xl transition-all hover:scale-110 ${
                shuffling ? 'animate-bounce' : ''
              } ${selected === index ? 'scale-125' : ''}`}
            >
              {selected === index && index === correctCup ? '🐾' : '☕'}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="text-center text-white">
            <div className="text-4xl mb-2">
              {selected === correctCup ? '🎉 Победа! +20 монет' : '😿 Не угадал!'}
            </div>
            <Button onClick={shuffle} className="bg-white text-pink-600 hover:bg-gray-100 mt-4">
              Играть ещё
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ClickerGame = ({ onBack, onWin }: { onBack: () => void; onWin: (coins: number) => void }) => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      const reward = Math.min(clicks, 25);
      if (reward > 0) {
        onWin(reward);
      }
    }
  }, [timeLeft, gameOver, clicks, onWin]);

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
      <div className="bg-gradient-to-b from-green-300 to-green-500 rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">⚡ Быстрые клики</h3>
            <p className="text-white/90 text-sm">Кликай как можно быстрее!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white rounded-full">
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-4">
          <div className="flex justify-between text-lg font-bold">
            <span>⚡ Кликов: {clicks}</span>
            <span>⏱️ Время: {timeLeft}с</span>
          </div>
        </div>

        <div className="relative bg-green-600 rounded-2xl h-80 flex items-center justify-center">
          {!gameOver ? (
            <button
              onClick={() => setClicks(clicks + 1)}
              className="text-9xl hover:scale-110 active:scale-95 transition-transform"
            >
              ⚡
            </button>
          ) : (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold mb-2">Результат!</h3>
              <p className="text-2xl mb-4">Кликов: {clicks}</p>
              <p className="text-xl mb-4">Награда: +{Math.min(clicks, 25)} монет</p>
              <Button onClick={onBack} className="bg-white text-green-600 hover:bg-gray-100">
                Закрыть
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniGames;

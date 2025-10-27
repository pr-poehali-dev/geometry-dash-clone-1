import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import MiniGames from '@/components/MiniGames';

interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  coins: number;
  level: number;
}

interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  hungerBoost: number;
  happinessBoost: number;
  energyBoost: number;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'fish', name: 'Рыбка', icon: '🐟', cost: 10, hungerBoost: 30, happinessBoost: 10, energyBoost: 0 },
  { id: 'premium', name: 'Премиум корм', icon: '🥩', cost: 25, hungerBoost: 50, happinessBoost: 20, energyBoost: 10 },
  { id: 'toy', name: 'Игрушка', icon: '🎾', cost: 15, hungerBoost: 0, happinessBoost: 40, energyBoost: -10 },
  { id: 'bed', name: 'Лежанка', icon: '🛏️', cost: 30, hungerBoost: 0, happinessBoost: 15, energyBoost: 50 },
];

const PetGame = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<PetStats>({
    hunger: 80,
    happiness: 70,
    energy: 60,
    coins: 50,
    level: 1,
  });
  const [showShop, setShowShop] = useState(false);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [petMood, setPetMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [activity, setActivity] = useState<string>('');
  const [petAnimation, setPetAnimation] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
        energy: Math.max(0, prev.energy - 0.3),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const avgStats = (stats.hunger + stats.happiness + stats.energy) / 3;
    if (avgStats > 60) setPetMood('happy');
    else if (avgStats > 30) setPetMood('neutral');
    else setPetMood('sad');
  }, [stats]);

  const buyItem = (item: ShopItem) => {
    if (stats.coins < item.cost) {
      toast({
        title: '💰 Недостаточно монет!',
        description: `Нужно ${item.cost} монет`,
        variant: 'destructive',
      });
      return;
    }

    setStats(prev => ({
      ...prev,
      coins: prev.coins - item.cost,
      hunger: Math.min(100, prev.hunger + item.hungerBoost),
      happiness: Math.min(100, prev.happiness + item.happinessBoost),
      energy: Math.min(100, prev.energy + item.energyBoost),
    }));

    setPetAnimation('animate-bounce');
    setTimeout(() => setPetAnimation(''), 1000);

    toast({
      title: `${item.icon} ${item.name}`,
      description: 'Мявл довольна!',
    });

    setShowShop(false);
  };

  const feed = () => {
    if (stats.coins < 10) {
      toast({
        title: '💰 Нужны монеты',
        description: 'Погуляй или поиграй!',
        variant: 'destructive',
      });
      return;
    }

    setStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      happiness: Math.min(100, prev.happiness + 10),
      coins: prev.coins - 10,
    }));

    setPetAnimation('animate-pulse');
    setActivity('Ням-ням! 😋');
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
    }, 2000);

    toast({
      title: '🍽️ Покормлена!',
      description: '+30 сытости',
    });
  };

  const walk = () => {
    if (stats.energy < 20) {
      toast({
        title: '😴 Мявл устала',
        description: 'Дай ей поспать',
        variant: 'destructive',
      });
      return;
    }

    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      energy: Math.max(0, prev.energy - 15),
      coins: prev.coins + 5,
    }));

    setPetAnimation('animate-bounce');
    setActivity('Гуляю! 🌳');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
    }, 3000);

    toast({
      title: '🚶 Прогулка',
      description: '+25 счастья, +5 монет',
    });
  };

  const play = () => {
    if (stats.energy < 15) {
      toast({
        title: '😴 Нет энергии',
        description: 'Мявл хочет спать',
        variant: 'destructive',
      });
      return;
    }

    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      energy: Math.max(0, prev.energy - 10),
      hunger: Math.max(0, prev.hunger - 5),
      coins: prev.coins + 3,
    }));

    setPetAnimation('animate-spin');
    setActivity('Играю! 🎉');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
    }, 1500);

    toast({
      title: '🎮 Игра',
      description: '+30 счастья, +3 монеты',
    });
  };

  const sleep = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      hunger: Math.max(0, prev.hunger - 10),
    }));

    setPetAnimation('animate-pulse');
    setActivity('Сплю... 💤');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
    }, 4000);

    toast({
      title: '😴 Сон',
      description: '+40 энергии',
    });
  };

  const bathroom = () => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
    }));

    setPetAnimation('animate-bounce');
    setActivity('В туалет! 🚽');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
    }, 2000);

    toast({
      title: '🚿 Туалет',
      description: '+15 счастья',
    });
  };

  const getMoodEmoji = () => {
    if (petMood === 'happy') return '😸';
    if (petMood === 'sad') return '😿';
    return '😺';
  };

  const getStatColor = (value: number) => {
    if (value > 70) return 'bg-green-500';
    if (value > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleGameWin = (coins: number) => {
    setStats(prev => ({ ...prev, coins: prev.coins + coins }));
    setPetAnimation('animate-bounce');
    setActivity(`+${coins} монет! 🎉`);
    toast({
      title: '🎉 Победа!',
      description: `Получено ${coins} монет`,
    });
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
      setShowMiniGames(false);
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
            {getMoodEmoji()}
          </div>
          <div>
            <h1 className="font-bold text-lg">Мявл</h1>
            <p className="text-xs opacity-90">Уровень {stats.level}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
            <Icon name="Coins" size={20} className="text-yellow-300" />
            <span className="font-bold text-lg">{stats.coins}</span>
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-4 right-4 flex gap-2 z-10">
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 shadow-lg">
          <Icon name="UtensilsCrossed" size={16} className="text-orange-500" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${getStatColor(stats.hunger)}`}
              style={{ width: `${stats.hunger}%` }}
            />
          </div>
        </div>

        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 shadow-lg">
          <Icon name="Heart" size={16} className="text-pink-500" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${getStatColor(stats.happiness)}`}
              style={{ width: `${stats.happiness}%` }}
            />
          </div>
        </div>

        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 shadow-lg">
          <Icon name="Zap" size={16} className="text-yellow-500" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${getStatColor(stats.energy)}`}
              style={{ width: `${stats.energy}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative pt-20">
        {activity && (
          <div className="absolute top-8 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-bold shadow-lg animate-bounce-in z-20">
            {activity}
          </div>
        )}
        
        <div className={`relative ${petAnimation}`}>
          <img 
            src="https://cdn.poehali.dev/files/910f5975-a30d-409e-844f-f83559059fa0.jpg" 
            alt="Мявл"
            className="w-80 h-80 object-cover rounded-full border-8 border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform"
            onClick={() => {
              setPetAnimation('animate-bounce');
              setTimeout(() => setPetAnimation(''), 500);
              toast({ title: '😻 Мявл рада тебя видеть!' });
            }}
          />
        </div>
      </div>

      {showShop && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-600">🛒 Магазин</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowShop(false)}
                className="rounded-full"
              >
                <Icon name="X" size={24} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SHOP_ITEMS.map(item => (
                <Button
                  key={item.id}
                  onClick={() => buyItem(item)}
                  variant="outline"
                  className="h-auto flex-col p-4 rounded-2xl hover:bg-purple-50 hover:scale-105 transition-transform"
                  disabled={stats.coins < item.cost}
                >
                  <div className="text-5xl mb-2">{item.icon}</div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs text-yellow-600 flex items-center gap-1 font-bold">
                    <Icon name="Coins" size={14} />
                    {item.cost}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMiniGames && (
        <MiniGames 
          onClose={() => setShowMiniGames(false)} 
          onWin={handleGameWin}
        />
      )}

      <div className="bg-white/95 backdrop-blur-sm p-4 shadow-2xl rounded-t-3xl">
        <div className="flex gap-2 mb-3 max-w-2xl mx-auto">
          <Button 
            onClick={() => setShowMiniGames(true)}
            className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Icon name="Trophy" size={24} />
            <span className="text-sm font-bold">Мини-игры</span>
          </Button>
        </div>

        <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
          <Button 
            onClick={feed}
            className="flex flex-col gap-1 h-20 rounded-2xl bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-lg hover:scale-105 transition-transform"
          >
            <Icon name="UtensilsCrossed" size={28} />
            <span className="text-xs font-bold">Еда</span>
          </Button>

          <Button 
            onClick={play}
            className="flex flex-col gap-1 h-20 rounded-2xl bg-gradient-to-b from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 shadow-lg hover:scale-105 transition-transform"
          >
            <Icon name="Gamepad2" size={28} />
            <span className="text-xs font-bold">Игра</span>
          </Button>

          <Button 
            onClick={sleep}
            className="flex flex-col gap-1 h-20 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-lg hover:scale-105 transition-transform"
          >
            <Icon name="Moon" size={28} />
            <span className="text-xs font-bold">Сон</span>
          </Button>

          <Button 
            onClick={walk}
            className="flex flex-col gap-1 h-20 rounded-2xl bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg hover:scale-105 transition-transform"
          >
            <Icon name="Trees" size={28} />
            <span className="text-xs font-bold">Прогулка</span>
          </Button>

          <Button 
            onClick={bathroom}
            className="flex flex-col gap-1 h-20 rounded-2xl bg-gradient-to-b from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 shadow-lg hover:scale-105 transition-transform"
          >
            <Icon name="Droplet" size={28} />
            <span className="text-xs font-bold">Туалет</span>
          </Button>

          <Button 
            onClick={() => setShowShop(true)}
            className="flex flex-col gap-1 h-20 rounded-2xl bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-lg hover:scale-105 transition-transform"
          >
            <Icon name="ShoppingCart" size={28} />
            <span className="text-xs font-bold">Магазин</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetGame;
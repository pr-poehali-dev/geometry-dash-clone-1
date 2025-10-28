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
  experience: number;
  costume?: string;
  ownedCostumes?: string[];
}

interface Costume {
  id: string;
  name: string;
  icon: string;
  cost: number;
  image: string;
  requiredLevel: number;
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

const COSTUMES: Costume[] = [
  { id: 'default', name: 'Обычная', icon: '🐱', cost: 0, requiredLevel: 1, image: 'https://cdn.poehali.dev/files/d8cdc41b-8201-49b9-a4e4-707018bd4f9a.png' },
  { id: 'wizard', name: 'Волшебница', icon: '🧙', cost: 100, requiredLevel: 3, image: 'https://cdn.poehali.dev/projects/e8518974-a6f2-4129-8808-7604e9cea2ca/files/b83c578a-de84-4de5-87ad-b7049efce955.jpg' },
  { id: 'pirate', name: 'Пират', icon: '🏴‍☠️', cost: 150, requiredLevel: 5, image: 'https://cdn.poehali.dev/projects/e8518974-a6f2-4129-8808-7604e9cea2ca/files/2a34d6b9-72c4-426e-a39d-3d1653e4362d.jpg' },
  { id: 'princess', name: 'Принцесса', icon: '👑', cost: 200, requiredLevel: 8, image: 'https://cdn.poehali.dev/projects/e8518974-a6f2-4129-8808-7604e9cea2ca/files/615d1d98-db1c-43d5-9eed-169dd51c788d.jpg' },
  { id: 'astronaut', name: 'Космонавт', icon: '🚀', cost: 300, requiredLevel: 12, image: 'https://cdn.poehali.dev/projects/e8518974-a6f2-4129-8808-7604e9cea2ca/files/bd036c6d-fe94-4b5e-9bc7-55f7b21729e9.jpg' },
  { id: 'ninja', name: 'Ниндзя', icon: '🥷', cost: 400, requiredLevel: 15, image: 'https://cdn.poehali.dev/projects/e8518974-a6f2-4129-8808-7604e9cea2ca/files/f6a1b03c-1524-4263-83fe-ce9ce0e98357.jpg' },
];

type Location = 'home' | 'kitchen' | 'bedroom' | 'bathroom' | 'park' | 'play';

const LOCATION_BACKGROUNDS: Record<Location, string> = {
  home: 'bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300',
  kitchen: 'bg-gradient-to-br from-orange-300 via-yellow-200 to-red-300',
  bedroom: 'bg-gradient-to-br from-indigo-400 via-purple-300 to-blue-400',
  bathroom: 'bg-gradient-to-br from-cyan-300 via-blue-200 to-teal-300',
  park: 'bg-gradient-to-br from-green-400 via-emerald-300 to-lime-300',
  play: 'bg-gradient-to-br from-pink-400 via-rose-300 to-fuchsia-300',
};

const SAVE_KEY = 'myavl_pet_save';

const loadSave = (): PetStats | null => {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return data;
    }
  } catch (error) {
    console.error('Ошибка загрузки сохранения:', error);
  }
  return null;
};

const PetGame = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<PetStats>(() => {
    const saved = loadSave();
    return saved || {
      hunger: 80,
      happiness: 70,
      energy: 60,
      coins: 50,
      level: 1,
      experience: 0,
      costume: 'default',
      ownedCostumes: ['default'],
    };
  });
  const [showShop, setShowShop] = useState(false);
  const [showCostumes, setShowCostumes] = useState(false);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [petMood, setPetMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [activity, setActivity] = useState<string>('');
  const [petAnimation, setPetAnimation] = useState('');
  const [lastSave, setLastSave] = useState<Date>(new Date());
  const [location, setLocation] = useState<Location>('home');

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(stats));
      setLastSave(new Date());
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  }, [stats]);

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

  const addExperience = (amount: number) => {
    const expNeeded = stats.level * 100;
    const newExp = stats.experience + amount;
    
    if (newExp >= expNeeded) {
      const newLevel = stats.level + 1;
      setStats(prev => ({
        ...prev,
        level: newLevel,
        experience: newExp - expNeeded,
      }));
      
      toast({
        title: '⭐ Повышение уровня!',
        description: `Теперь уровень ${newLevel}! Новые костюмы доступны!`,
      });
    } else {
      setStats(prev => ({ ...prev, experience: newExp }));
    }
  };

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

  const buyCostume = (costume: Costume) => {
    if (stats.ownedCostumes?.includes(costume.id)) {
      setStats(prev => ({ ...prev, costume: costume.id }));
      toast({
        title: `${costume.icon} ${costume.name}`,
        description: 'Костюм надет!',
      });
      setShowCostumes(false);
      return;
    }

    if (stats.level < costume.requiredLevel) {
      toast({
        title: '🔒 Нужен уровень!',
        description: `Требуется ${costume.requiredLevel} уровень`,
        variant: 'destructive',
      });
      return;
    }

    if (stats.coins < costume.cost) {
      toast({
        title: '💰 Недостаточно монет!',
        description: `Нужно ${costume.cost} монет`,
        variant: 'destructive',
      });
      return;
    }

    setStats(prev => ({
      ...prev,
      coins: prev.coins - costume.cost,
      costume: costume.id,
      ownedCostumes: [...(prev.ownedCostumes || []), costume.id],
    }));

    setPetAnimation('animate-spin');
    setTimeout(() => setPetAnimation(''), 1000);

    toast({
      title: `${costume.icon} ${costume.name}`,
      description: 'Костюм куплен и надет!',
    });

    setShowCostumes(false);
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

    setLocation('kitchen');
    setStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      happiness: Math.min(100, prev.happiness + 10),
      coins: prev.coins - 10,
    }));
    
    addExperience(5);

    setPetAnimation('animate-pulse');
    setActivity('Ням-ням! 😋');
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
      setLocation('home');
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

    setLocation('park');
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      energy: Math.max(0, prev.energy - 15),
      coins: prev.coins + 5,
    }));
    
    addExperience(10);

    setPetAnimation('animate-bounce');
    setActivity('Гуляю! 🌳');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
      setLocation('home');
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

    setLocation('play');
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      energy: Math.max(0, prev.energy - 10),
      hunger: Math.max(0, prev.hunger - 5),
      coins: prev.coins + 3,
    }));
    
    addExperience(8);

    setPetAnimation('animate-spin');
    setActivity('Играю! 🎉');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
      setLocation('home');
    }, 1500);

    toast({
      title: '🎮 Игра',
      description: '+30 счастья, +3 монеты',
    });
  };

  const sleep = () => {
    setLocation('bedroom');
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      hunger: Math.max(0, prev.hunger - 10),
    }));
    
    addExperience(3);

    setPetAnimation('animate-pulse');
    setActivity('Сплю... 💤');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
      setLocation('home');
    }, 4000);

    toast({
      title: '😴 Сон',
      description: '+40 энергии',
    });
  };

  const bathroom = () => {
    setLocation('bathroom');
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
    }));
    
    addExperience(2);

    setPetAnimation('animate-bounce');
    setActivity('В туалет! 🚽');
    
    setTimeout(() => {
      setPetAnimation('');
      setActivity('');
      setLocation('home');
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

  const resetProgress = () => {
    const defaultStats = {
      hunger: 80,
      happiness: 70,
      energy: 60,
      coins: 50,
      level: 1,
      experience: 0,
      costume: 'default',
      ownedCostumes: ['default'],
    };
    setStats(defaultStats);
    localStorage.setItem(SAVE_KEY, JSON.stringify(defaultStats));
    toast({
      title: '🔄 Прогресс сброшен',
      description: 'Игра начата заново!',
    });
  };

  const handleGameWin = (coins: number) => {
    setStats(prev => ({
      ...prev,
      coins: prev.coins + coins,
      happiness: Math.min(100, prev.happiness + 10),
    }));
    
    addExperience(15);
    
    setPetAnimation('animate-bounce');
    setActivity('Победа! 🎉');
    
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

  const currentCostume = COSTUMES.find(c => c.id === stats.costume) || COSTUMES[0];

  return (
    <div className={`h-screen flex flex-col ${LOCATION_BACKGROUNDS[location]} overflow-hidden touch-manipulation transition-colors duration-700`}>
      <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-xl sm:text-2xl">
            {getMoodEmoji()}
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg">Мявл</h1>
            <div className="flex items-center gap-1">
              <p className="text-xs opacity-90">Ур. {stats.level}</p>
              <div className="w-12 sm:w-16 bg-white/30 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-yellow-300 transition-all"
                  style={{ width: `${(stats.experience / (stats.level * 100)) * 100}%` }}
                  title={`${stats.experience}/${stats.level * 100} опыта`}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 sm:gap-2 items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2 flex items-center gap-1 sm:gap-2">
            <Icon name="Coins" size={18} className="text-yellow-300" />
            <span className="font-bold text-base sm:text-lg">{stats.coins}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetProgress}
            className="text-white hover:bg-white/20 rounded-full h-8 w-8 sm:h-10 sm:w-10"
            title="Сбросить прогресс"
          >
            <Icon name="RotateCcw" size={18} />
          </Button>
        </div>
      </div>

      <div className="absolute top-14 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 flex gap-1 sm:gap-2 z-10">
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-lg">
          <Icon name="UtensilsCrossed" size={14} className="text-orange-500" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${getStatColor(stats.hunger)}`}
              style={{ width: `${stats.hunger}%` }}
            />
          </div>
        </div>

        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-lg">
          <Icon name="Heart" size={14} className="text-pink-500" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${getStatColor(stats.happiness)}`}
              style={{ width: `${stats.happiness}%` }}
            />
          </div>
        </div>

        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1 sm:gap-2 shadow-lg">
          <Icon name="Zap" size={14} className="text-yellow-500" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${getStatColor(stats.energy)}`}
              style={{ width: `${stats.energy}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative pt-16 sm:pt-20">
        {activity && (
          <div className="absolute top-8 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-bold shadow-lg animate-bounce-in z-20">
            {activity}
          </div>
        )}
        
        <div className={`relative ${petAnimation}`}>
          <img 
            src={currentCostume.image} 
            alt="Мявл"
            className="w-48 h-56 sm:w-64 sm:h-72 md:w-80 md:h-96 object-contain drop-shadow-2xl active:scale-95 transition-transform"
            onClick={() => {
              setPetAnimation('animate-bounce');
              setTimeout(() => setPetAnimation(''), 500);
              toast({ title: '😻 Мявл рада тебя видеть!' });
            }}
          />
        </div>
      </div>

      {showShop && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600">🛒 Магазин</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowShop(false)}
                className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
              >
                <Icon name="X" size={22} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {SHOP_ITEMS.map(item => (
                <Button
                  key={item.id}
                  onClick={() => buyItem(item)}
                  variant="outline"
                  className="h-auto flex-col p-3 sm:p-4 rounded-2xl active:bg-purple-50 active:scale-95 transition-transform"
                  disabled={stats.coins < item.cost}
                >
                  <div className="text-4xl sm:text-5xl mb-1 sm:mb-2">{item.icon}</div>
                  <div className="font-bold text-xs sm:text-sm">{item.name}</div>
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

      {showCostumes && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-600">👗 Костюмы</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowCostumes(false)}
                className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
              >
                <Icon name="X" size={22} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {COSTUMES.map(costume => {
                const owned = stats.ownedCostumes?.includes(costume.id);
                const equipped = stats.costume === costume.id;
                const locked = stats.level < costume.requiredLevel;
                
                return (
                  <Button
                    key={costume.id}
                    onClick={() => buyCostume(costume)}
                    variant={equipped ? "default" : "outline"}
                    className="h-auto flex-col p-3 sm:p-4 rounded-2xl active:bg-purple-50 active:scale-95 transition-transform relative"
                    disabled={(!owned && stats.coins < costume.cost) || locked}
                  >
                    {equipped && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                    {locked && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <Icon name="Lock" size={24} className="mx-auto text-white mb-1" />
                          <p className="text-white text-xs font-bold">Ур. {costume.requiredLevel}</p>
                        </div>
                      </div>
                    )}
                    <div className="text-4xl sm:text-5xl mb-1 sm:mb-2">{costume.icon}</div>
                    <div className="font-bold text-xs sm:text-sm">{costume.name}</div>
                    {!owned && !locked && (
                      <div className="text-xs text-yellow-600 flex items-center gap-1 font-bold">
                        <Icon name="Coins" size={14} />
                        {costume.cost}
                      </div>
                    )}
                    {owned && !equipped && (
                      <div className="text-xs text-green-600 font-bold">Надеть</div>
                    )}
                  </Button>
                );
              })}
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

      <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-4 shadow-2xl rounded-t-3xl safe-area-bottom">
        <div className="flex gap-2 mb-2 sm:mb-3 max-w-2xl mx-auto">
          <Button 
            onClick={() => setShowMiniGames(true)}
            className="flex-1 h-12 sm:h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 active:scale-95 shadow-lg transition-transform flex items-center justify-center gap-2 text-white"
          >
            <Icon name="Trophy" size={20} />
            <span className="text-xs sm:text-sm font-bold">Мини-игры</span>
          </Button>
          <Button 
            onClick={() => setShowCostumes(true)}
            className="flex-1 h-12 sm:h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 active:scale-95 shadow-lg transition-transform flex items-center justify-center gap-2 text-white"
          >
            <Icon name="Shirt" size={20} />
            <span className="text-xs sm:text-sm font-bold">Костюмы</span>
          </Button>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:gap-2 max-w-2xl mx-auto">
          <Button 
            onClick={feed}
            className="flex flex-col gap-0.5 sm:gap-1 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-b from-orange-400 to-orange-600 active:scale-95 shadow-lg transition-transform text-white"
          >
            <Icon name="UtensilsCrossed" size={24} />
            <span className="text-[10px] sm:text-xs font-bold">Еда</span>
          </Button>

          <Button 
            onClick={play}
            className="flex flex-col gap-0.5 sm:gap-1 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-b from-pink-400 to-pink-600 active:scale-95 shadow-lg transition-transform text-white"
          >
            <Icon name="Gamepad2" size={24} />
            <span className="text-[10px] sm:text-xs font-bold">Игра</span>
          </Button>

          <Button 
            onClick={sleep}
            className="flex flex-col gap-0.5 sm:gap-1 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600 active:scale-95 shadow-lg transition-transform text-white"
          >
            <Icon name="Moon" size={24} />
            <span className="text-[10px] sm:text-xs font-bold">Сон</span>
          </Button>

          <Button 
            onClick={walk}
            className="flex flex-col gap-0.5 sm:gap-1 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-b from-green-400 to-green-600 active:scale-95 shadow-lg transition-transform text-white"
          >
            <Icon name="Trees" size={24} />
            <span className="text-[10px] sm:text-xs font-bold leading-tight">Прогул<wbr/>ка</span>
          </Button>

          <Button 
            onClick={bathroom}
            className="flex flex-col gap-0.5 sm:gap-1 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-b from-cyan-400 to-cyan-600 active:scale-95 shadow-lg transition-transform text-white"
          >
            <Icon name="Droplet" size={24} />
            <span className="text-[10px] sm:text-xs font-bold">Туалет</span>
          </Button>

          <Button 
            onClick={() => setShowShop(true)}
            className="flex flex-col gap-0.5 sm:gap-1 h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-b from-yellow-400 to-yellow-600 active:scale-95 shadow-lg transition-transform text-white"
          >
            <Icon name="ShoppingCart" size={24} />
            <span className="text-[10px] sm:text-xs font-bold leading-tight">Мага<wbr/>зин</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetGame;
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  coins: number;
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
  { id: 'bed', name: 'Мягкая лежанка', icon: '🛏️', cost: 30, hungerBoost: 0, happinessBoost: 15, energyBoost: 50 },
];

const PetGame = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<PetStats>({
    hunger: 80,
    happiness: 70,
    energy: 60,
    coins: 50,
  });
  const [showShop, setShowShop] = useState(false);
  const [petMood, setPetMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [activity, setActivity] = useState<string>('Спит в уютной квартире');

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
        title: 'Недостаточно монет!',
        description: `Нужно ${item.cost} монет, а у вас ${stats.coins}`,
        variant: 'destructive',
      });
      return;
    }

    setStats(prev => ({
      coins: prev.coins - item.cost,
      hunger: Math.min(100, prev.hunger + item.hungerBoost),
      happiness: Math.min(100, prev.happiness + item.happinessBoost),
      energy: Math.min(100, prev.energy + item.energyBoost),
    }));

    toast({
      title: `Куплено: ${item.name}!`,
      description: 'Мявл довольна! 😻',
    });

    setActivity(`Получила ${item.name}`);
    setTimeout(() => setActivity('Отдыхает в квартире'), 3000);
  };

  const walk = () => {
    if (stats.energy < 20) {
      toast({
        title: 'Мявл устала!',
        description: 'Дайте ей отдохнуть',
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

    setActivity('Гуляет на улице!');
    toast({
      title: 'Прогулка!',
      description: '+25 счастья, +5 монет',
    });

    setTimeout(() => setActivity('Вернулась домой'), 4000);
  };

  const play = () => {
    if (stats.energy < 15) {
      toast({
        title: 'Мявл устала!',
        description: 'Нужно больше энергии',
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

    setActivity('Играет с вами!');
    toast({
      title: 'Игра!',
      description: '+30 счастья, +3 монеты',
    });

    setTimeout(() => setActivity('Отдыхает после игры'), 4000);
  };

  const sleep = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      hunger: Math.max(0, prev.hunger - 10),
    }));

    setActivity('Сладко спит... 💤');
    toast({
      title: 'Сон',
      description: '+40 энергии',
    });

    setTimeout(() => setActivity('Проснулась!'), 5000);
  };

  const getMoodEmoji = () => {
    if (petMood === 'happy') return '😸';
    if (petMood === 'sad') return '😿';
    return '😺';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 bg-white/90 backdrop-blur-sm shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Мявл - Котосова</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Icon name="Coins" size={20} className="text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600">{stats.coins}</span>
          </p>
        </div>

        <div className="relative bg-gradient-to-b from-sky-200 to-green-200 rounded-xl p-8 mb-6 min-h-[300px] flex flex-col items-center justify-center border-4 border-purple-300">
          <div className="absolute top-4 right-4 bg-white/80 rounded-lg px-3 py-1 text-sm">
            {activity}
          </div>
          
          <div className="text-center">
            <div className="text-9xl mb-4 animate-bounce-in">
              {getMoodEmoji()}
            </div>
            <img 
              src="https://cdn.poehali.dev/files/910f5975-a30d-409e-844f-f83559059fa0.jpg" 
              alt="Мявл"
              className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-xl mx-auto"
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="flex items-center gap-2">
                <Icon name="UtensilsCrossed" size={18} className="text-orange-500" />
                Голод
              </span>
              <span className="font-bold">{Math.round(stats.hunger)}%</span>
            </div>
            <Progress value={stats.hunger} className="h-3" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="flex items-center gap-2">
                <Icon name="Heart" size={18} className="text-pink-500" />
                Счастье
              </span>
              <span className="font-bold">{Math.round(stats.happiness)}%</span>
            </div>
            <Progress value={stats.happiness} className="h-3" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="flex items-center gap-2">
                <Icon name="Zap" size={18} className="text-yellow-500" />
                Энергия
              </span>
              <span className="font-bold">{Math.round(stats.energy)}%</span>
            </div>
            <Progress value={stats.energy} className="h-3" />
          </div>
        </div>

        {!showShop ? (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={walk} className="gap-2 bg-green-500 hover:bg-green-600">
              <Icon name="Trees" size={20} />
              Погулять
            </Button>
            <Button onClick={play} className="gap-2 bg-purple-500 hover:bg-purple-600">
              <Icon name="Gamepad2" size={20} />
              Играть
            </Button>
            <Button onClick={sleep} className="gap-2 bg-blue-500 hover:bg-blue-600">
              <Icon name="Moon" size={20} />
              Спать
            </Button>
            <Button onClick={() => setShowShop(true)} className="gap-2 bg-yellow-500 hover:bg-yellow-600">
              <Icon name="ShoppingCart" size={20} />
              Магазин
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Магазин</h3>
              <Button variant="ghost" onClick={() => setShowShop(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SHOP_ITEMS.map(item => (
                <Button
                  key={item.id}
                  onClick={() => buyItem(item)}
                  variant="outline"
                  className="h-auto flex-col p-4 hover:bg-purple-50"
                  disabled={stats.coins < item.cost}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-yellow-600 flex items-center gap-1">
                    <Icon name="Coins" size={14} />
                    {item.cost}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PetGame;

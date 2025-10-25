import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Game from '@/components/Game';

interface Level {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Extreme';
  color: string;
  stars: number;
}

const LEVELS: Level[] = [
  { id: 1, name: 'Stereo Madness', difficulty: 'Easy', color: '#8B5CF6', stars: 1 },
  { id: 2, name: 'Back on Track', difficulty: 'Medium', color: '#0EA5E9', stars: 2 },
  { id: 3, name: 'Polargeist', difficulty: 'Hard', color: '#F97316', stars: 3 },
  { id: 4, name: 'Dry Out', difficulty: 'Expert', color: '#D946EF', stars: 4 },
  { id: 5, name: 'Hexagon Force', difficulty: 'Extreme', color: '#EF4444', stars: 5 }
];

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400',
  Medium: 'text-blue-400',
  Hard: 'text-orange-400',
  Expert: 'text-purple-400',
  Extreme: 'text-red-400'
};

export default function Index() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  if (selectedLevel !== null) {
    return <Game levelId={selectedLevel} onBack={() => setSelectedLevel(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-glow shadow-lg shadow-primary/50">
              <Icon name="Zap" size={32} className="text-primary-foreground" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Geometry Rush
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Прыгай через препятствия и покоряй уровни
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          {LEVELS.map((level, index) => (
            <Card 
              key={level.id} 
              className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up shadow-lg hover:shadow-2xl"
              style={{ 
                borderColor: level.color,
                animationDelay: `${index * 0.1}s`,
                boxShadow: `0 0 20px ${level.color}40`
              }}
              onClick={() => setSelectedLevel(level.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl animate-pulse-glow shadow-lg"
                    style={{ 
                      backgroundColor: level.color,
                      boxShadow: `0 0 15px ${level.color}`
                    }}
                  >
                    {level.id}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{level.name}</h3>
                    <p className={`text-sm font-semibold ${DIFFICULTY_COLORS[level.difficulty]}`}>
                      {level.difficulty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex gap-1">
                    {[...Array(level.stars)].map((_, i) => (
                      <Icon 
                        key={i} 
                        name="Star" 
                        size={20} 
                        className="animate-pulse-glow"
                        style={{ color: level.color }}
                      />
                    ))}
                  </div>
                  <Button 
                    size="lg" 
                    className="gap-2 shadow-lg"
                    style={{ 
                      backgroundColor: level.color,
                      boxShadow: `0 0 15px ${level.color}60`
                    }}
                  >
                    <Icon name="Play" size={20} />
                    Играть
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-card/30 backdrop-blur-sm border border-border">
          <div className="flex items-start gap-4">
            <Icon name="Info" size={24} className="text-primary mt-1" />
            <div>
              <h4 className="font-bold mb-2 text-lg">Как играть</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mouse" size={16} className="text-primary" />
                  Кликай мышкой или нажимай пробел для прыжка
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Zap" size={16} className="text-secondary" />
                  Избегай красных шипов
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Box" size={16} className="text-accent" />
                  Прыгай по цветным платформам и серым блокам
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Trophy" size={16} className="text-yellow-400" />
                  Пройди уровень на 100% чтобы победить
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

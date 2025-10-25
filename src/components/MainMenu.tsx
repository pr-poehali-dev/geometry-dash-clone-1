import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/i18n/translations';

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

const LANGUAGES = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

interface MainMenuProps {
  onSelectLevel: (levelId: number) => void;
}

export default function MainMenu({ onSelectLevel }: MainMenuProps) {
  const { t, language, setLanguage } = useLanguage();
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const [view, setView] = useState<'main' | 'leaderboard' | 'settings' | 'profile'>('main');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const handleAuth = async () => {
    setAuthError('');
    try {
      if (authMode === 'login') {
        await login(authForm.username, authForm.password);
      } else {
        await register(authForm.username, authForm.email, authForm.password);
      }
      setShowAuthDialog(false);
      setAuthForm({ username: '', email: '', password: '' });
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const response = await fetch('https://functions.poehali.dev/82422d45-2b46-469d-ae46-81a74614fb6e?action=leaderboard');
      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to load leaderboard', error);
    }
    setLoadingLeaderboard(false);
  };

  if (view === 'leaderboard') {
    if (leaderboardData.length === 0 && !loadingLeaderboard) {
      loadLeaderboard();
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => setView('main')} className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              {t('back')}
            </Button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('leaderboard')}
            </h2>
            <div className="w-24" />
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            {loadingLeaderboard ? (
              <div className="text-center py-8">
                <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboardData.map((player, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                        style={{ 
                          backgroundColor: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#4A5568',
                          color: '#000'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold">{player.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('levelsCompleted')}: {player.levels_completed}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Star" size={20} className="text-yellow-400" />
                      <span className="text-xl font-bold">{player.total_stars}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => setView('main')} className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              {t('back')}
            </Button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('settings')}
            </h2>
            <div className="w-24" />
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <Label className="text-lg mb-4 block">{t('language')}</Label>
                <div className="grid grid-cols-1 gap-3">
                  {LANGUAGES.map(lang => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? 'default' : 'outline'}
                      onClick={() => setLanguage(lang.code as Language)}
                      className="justify-start gap-3 h-auto py-4"
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-lg">{lang.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => setView('main')} className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              {t('back')}
            </Button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('profile')}
            </h2>
            <div className="w-24" />
          </div>

          {isAuthenticated && user ? (
            <Card className="p-8 bg-card/50 backdrop-blur-sm text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center">
                <Icon name="User" size={48} className="text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{user.username}</h3>
              <p className="text-muted-foreground mb-6">{user.email}</p>
              <div className="flex items-center justify-center gap-2 mb-8">
                <Icon name="Star" size={24} className="text-yellow-400" />
                <span className="text-3xl font-bold">{user.total_stars}</span>
                <span className="text-muted-foreground">{t('totalStars')}</span>
              </div>
              <Button onClick={logout} variant="outline" className="gap-2">
                <Icon name="LogOut" size={20} />
                {t('logout')}
              </Button>
            </Card>
          ) : (
            <Card className="p-8 bg-card/50 backdrop-blur-sm text-center">
              <Icon name="User" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-6">{t('login')} {t('register').toLowerCase()}</p>
              <Button onClick={() => { setShowAuthDialog(true); setAuthMode('login'); }}>
                {t('login')}
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => setView('settings')} className="gap-2">
              <Icon name="Settings" size={20} />
              {t('settings')}
            </Button>
            <Button variant="outline" onClick={() => setView('profile')} className="gap-2">
              <Icon name="User" size={20} />
              {t('profile')}
              {isAuthenticated && user && (
                <div className="flex items-center gap-1 ml-2">
                  <Icon name="Star" size={16} className="text-yellow-400" />
                  <span className="text-sm font-bold">{user.total_stars}</span>
                </div>
              )}
            </Button>
            <Button variant="outline" onClick={() => setView('leaderboard')} className="gap-2">
              <Icon name="Trophy" size={20} />
              {t('records')}
            </Button>
          </div>

          <div className="text-center mb-12 animate-slide-up">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse-glow shadow-lg shadow-primary/50">
                <Icon name="Zap" size={32} className="text-primary-foreground" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t('title')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {t('subtitle')}
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
                onClick={() => onSelectLevel(level.id)}
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
                        {t(`difficulty.${level.difficulty}`)}
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
                      {t('play')}
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
                <h4 className="font-bold mb-2 text-lg">{t('howToPlay')}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Icon name="Mouse" size={16} className="text-primary" />
                    {t('clickToJump')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Zap" size={16} className="text-secondary" />
                    {t('avoidSpikes')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Box" size={16} className="text-accent" />
                    {t('jumpOnPlatforms')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Trophy" size={16} className="text-yellow-400" />
                    {t('completeLevel')}
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? t('login') : t('register')}</DialogTitle>
          </DialogHeader>
          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="register">{t('register')}</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div>
                <Label>{t('username')}</Label>
                <Input 
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                />
              </div>
              <div>
                <Label>{t('password')}</Label>
                <Input 
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>
              {authError && <p className="text-destructive text-sm">{authError}</p>}
              <Button onClick={handleAuth} className="w-full">{t('login')}</Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <div>
                <Label>{t('username')}</Label>
                <Input 
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                />
              </div>
              <div>
                <Label>{t('email')}</Label>
                <Input 
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label>{t('password')}</Label>
                <Input 
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>
              {authError && <p className="text-destructive text-sm">{authError}</p>}
              <Button onClick={handleAuth} className="w-full">{t('register')}</Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

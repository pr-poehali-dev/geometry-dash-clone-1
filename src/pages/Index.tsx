import { useState } from 'react';
import Game from '@/components/Game';
import MainMenu from '@/components/MainMenu';

export default function Index() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  if (selectedLevel !== null) {
    return <Game levelId={selectedLevel} onBack={() => setSelectedLevel(null)} />;
  }

  return <MainMenu onSelectLevel={setSelectedLevel} />;
}
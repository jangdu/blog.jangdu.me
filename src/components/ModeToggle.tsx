import { MoonIcon, SunIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<'light' | 'dark' | null>(null);

  React.useEffect(() => {
    const savedTheme =
      (localStorage.getItem('theme') as 'light' | 'dark' | null) || null;
    setThemeState(savedTheme);
  }, []);

  const setTheme = (newTheme: 'light' | 'dark' | null) => {
    setThemeState(newTheme);
  };

  React.useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      if (!theme) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      }
      localStorage.setItem('theme', theme || '');
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? (
          <SunIcon className="size-4" />
        ) : (
          <MoonIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

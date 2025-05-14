import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { cn } from '../../utils/cn';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
        "transition-colors duration-200"
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
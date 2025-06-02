
import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCustomTheme } from '../context/CustomThemeContext';

const themes = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Corporate Theme',
    colors: {
      primary: '#0D47A1',
      secondary: '#1976D2',
      accent: '#42A5F5',
      background: '#F5F7FA',
      text: '#212121'
    }
  },
  {
    id: 'emerald-fresh',
    name: 'Emerald Fresh',
    description: 'Modern & Clean',
    colors: {
      primary: '#2E7D32',
      secondary: '#66BB6A',
      accent: '#A5D6A7',
      background: '#F9F9F9',
      text: '#333333'
    }
  },
  {
    id: 'sunset-gold',
    name: 'Sunset Gold',
    description: 'Elegant & Premium',
    colors: {
      primary: '#B26500',
      secondary: '#FF9800',
      accent: '#FFB74D',
      background: '#FFFFFF',
      text: '#212121'
    }
  },
  {
    id: 'midnight-pro',
    name: 'Midnight Pro',
    description: 'Dark Mode',
    colors: {
      primary: '#121212',
      secondary: '#1E88E5',
      accent: '#64B5F6',
      background: '#1A1A1A',
      text: '#E0E0E0'
    }
  },
  {
    id: 'slate-violet',
    name: 'Slate Violet',
    description: 'Tech Inspired',
    colors: {
      primary: '#6A1B9A',
      secondary: '#AB47BC',
      accent: '#CE93D8',
      background: '#F3F3F3',
      text: '#2C2C2C'
    }
  }
];

export function ThemeCustomizer() {
  const { currentTheme, setTheme } = useCustomTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const getCurrentTheme = () => {
    return themes.find(theme => theme.id === currentTheme) || themes[0];
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full theme-transition border-2 hover:scale-110 transition-all duration-300"
          aria-label="Change theme"
        >
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 p-2 theme-transition"
        sideOffset={5}
      >
        <div className="text-sm font-medium mb-3 px-2">Choose Theme</div>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeSelect(theme.id)}
            className={`p-3 cursor-pointer rounded-lg theme-transition ${
              currentTheme === theme.id ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{theme.name}</div>
                <div className="text-xs text-muted-foreground">{theme.description}</div>
              </div>
              {currentTheme === theme.id && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

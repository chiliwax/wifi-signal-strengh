import { Pressable, Text as NativeText } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../contexts/theme.context';
import { useThemeButtonStyle } from './ThemeButton.design';

export const ThemeButton: React.FC = (): JSX.Element => {
  //contexts
  const { theme, setTheme } = useContext(ThemeContext);
  // states
  const [icon, setIcon] = useState<any>();
  // hooks
  const design = useThemeButtonStyle();
  // constants
  const ICON_SIZE = 32;

  useEffect(() => {
    console.log('theme button', theme)
    switch (theme) {
      case 'auto':
        setIcon('contrast-outline');
        break;
      case 'light':
        setIcon('sunny-outline');
        break;
      case 'dark':
        setIcon('moon-outline');
        break;
      default:
        setIcon('contrast-outline');
        break;
    }
  }, [theme]);

  const toogleTheme = () => {
    switch (theme) {
      case 'auto':
        setTheme('light');
        break;
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('auto');
        break;
      default:
        setTheme('auto');
        break;
    }
  };

  return (
    <Pressable onPress={toogleTheme}>
      <Ionicons name={icon} size={ICON_SIZE} color={design.svg.color} />
    </Pressable>
  );
};

import { StatusBarStyle } from 'expo-status-bar';
import { useContext } from 'react';
import { ViewStyle } from 'react-native/types';
import { ThemeContext } from '../../contexts/theme.context';

export const useScreenStyle = () => {
  const { theme, colors } = useContext(ThemeContext);
  return {
    container: {
      display: 'flex',
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    statusbar: theme === 'dark' ? 'light' : ('dark' as StatusBarStyle),
  };
};

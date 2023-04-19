import { useContext } from 'react';
import { ThemeContext } from '../../contexts/theme.context';

export const useThemeButtonLogic = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return {};
};

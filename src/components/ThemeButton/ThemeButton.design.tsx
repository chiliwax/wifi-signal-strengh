import { useContext } from 'react';
import { ThemeContext } from '../../contexts/theme.context';

export const useThemeButtonStyle = () => {
  const { colors } = useContext(ThemeContext);
  return {
    svg: {
        color: colors.text
    }
  };
};
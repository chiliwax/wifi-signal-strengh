import { useContext } from 'react';
import { TextStyle } from 'react-native/types';
import { ThemeContext } from '../../contexts/theme.context';

export const useTextStyle = () => {
  const { colors } = useContext(ThemeContext);
  return {
    text: {
        color: colors.text,
    } as TextStyle
  };
};
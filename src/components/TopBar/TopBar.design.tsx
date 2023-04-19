import { TextStyle, ViewStyle } from 'react-native/types';

export const useThemeTopBarStyle = () => {
  return {
    container: {
      display: 'flex',
      height: 50,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
    } as ViewStyle,
    text: {
      textTransform: 'capitalize',
      fontSize: 20,
    } as TextStyle,
  };
};

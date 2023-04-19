import { useContext } from 'react';
import { TextStyle, ViewStyle } from 'react-native/types';
import { ThemeContext } from '../../contexts/theme.context';
import { useTool } from '../../hooks/tools';

export const useStrenghSignalStyle = () => {
  const { colors } = useContext(ThemeContext);
  const { hexToRGB } = useTool();
  return {
    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.pageColor,
    } as ViewStyle,
    retext: {
      padding: 0,
      margin: 0,
      fontSize: 8,
      maxHeight: 10,
      color: colors.text
    } as TextStyle,
    button: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      backgroundColor: colors.green,
    } as ViewStyle,
    minibutton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      backgroundColor: colors.green,
      minWidth: 50,
    } as ViewStyle,
    primary: {
      backgroundColor: colors.primary,
    } as ViewStyle,
    secondary: {
      backgroundColor: colors.secondary,
    } as ViewStyle,
    txtcenter: {
      textAlign: 'center',
    } as TextStyle,
    svg: {
      circle: {
        inactiveCircleColor: hexToRGB(colors.blue, 0.1),
        activeCircleColor: colors.yellow,
      },
      text: {
        color: colors.text,
      },
      chart: {
        backgroundColor: colors.pageColor,
        lineColor: hexToRGB(colors.text, 0.3),
        avgColor: hexToRGB(colors.blue, 0.5),
        dashlineColor: hexToRGB(colors.text, 0.1),
        text: colors.text,
        lineInspector: {
          position: 'absolute',
          top: 12,
          height: '77%',
          width: 2,
          left: -1,
          backgroundColor: hexToRGB(colors.background, 0.5),
        } as ViewStyle,
        dataDisplayer: {
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          padding: 5,
          backgroundColor: hexToRGB(colors.background, 0.5),
          height: 25,
          width: 75,
        } as ViewStyle,
      },
    },
    lottieContainer: {
      backgroundColor: hexToRGB(colors.text, 0.1),
      overflow: 'hidden',
      borderRadius: 50,
    } as ViewStyle,
  };
};

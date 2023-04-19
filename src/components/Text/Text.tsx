import { TextProps } from './Text.Props';
import { Text as NativeText } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTextStyle } from './Text.design';

export const Text: React.FC<TextProps> = (props): JSX.Element => {
  //hooks
  const design = useTextStyle();
  //render
  return (
    <NativeText style={[design.text, props.style]}>{props.children}</NativeText>
  );
};

import { useScreenLogic } from './Screen.logic';
import { ScreenProps } from './Screen.Props';
import { View } from 'react-native';
import { useScreenStyle } from './Screen.design';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Screen: React.FC<ScreenProps> = (props) => {
  //hooks
  const logic = useScreenLogic(props);
  const design = useScreenStyle();
  //render
  const useSafe = props.useSafeArea;

  if (!useSafe) {
    return (
      <View style={[design.container, props.style]}>
        <StatusBar style={design.statusbar} />
        {props.children}
      </View>
    );
  } else {
    return (
      <View style={[design.container, props.style]}>
        <StatusBar style={design.statusbar} />
        <SafeAreaView style={[props.safeAreaStyle, {display: 'flex', flex: 1}]}>
          {props.children}
        </SafeAreaView>
      </View>
    );
  }
};

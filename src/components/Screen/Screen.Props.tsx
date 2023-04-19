import { ViewStyle } from "react-native/types";

export interface ScreenProps {
  children?: React.ReactNode;
  useSafeArea?: boolean;
  style?: ViewStyle;
  safeAreaStyle?: ViewStyle;
}

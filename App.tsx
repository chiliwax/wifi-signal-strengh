import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/theme.context';
import Home from './src/pages/home';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogProvider } from './src/contexts/log.context';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LogProvider>
          <ThemeProvider>
            <Home />
          </ThemeProvider>
        </LogProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

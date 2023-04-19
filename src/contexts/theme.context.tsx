import React, { createContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import lightTheme from '../themes/light';
import darkTheme from '../themes/dark';
import { IColors } from '../themes/theme.model';
import { useAsyncStorage } from '../hooks/asyncStorage';

type ThemeContextType = {
  theme: ThemeAsyncStorage;
  setTheme: (theme: ThemeAsyncStorage) => void;
  colors: IColors;
};

type ThemeAsyncStorage = 'light' | 'dark' | 'auto';
const ThemeAsyncStorageKey = '@Async_Theme';

const defaultContext: ThemeContextType = {
  theme: 'auto',
  setTheme: () => {},
  colors: lightTheme,
};

export const ThemeContext = createContext(defaultContext);

export const ThemeProvider: React.FC<any> = (props) => {
  //hooks
  const { getData, storeData } = useAsyncStorage();
  //states
  const [theme, setTheme] = useState<ThemeAsyncStorage>();
  const [currentTheme, setCurrentTheme] = useState<IColors>(lightTheme);
  //life-cycle

  useEffect(() => {
    (async () => {
      const currentTheme = await getData<ThemeAsyncStorage>(ThemeAsyncStorageKey);
      if (currentTheme === 'auto' || currentTheme === null) {
        setTheme('auto')
      }
      setTheme(currentTheme)
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (theme) {
        await storeData<ThemeAsyncStorage>(ThemeAsyncStorageKey, theme);
      }
    })();
  }, [theme]);

  useEffect(() => {
    console.log('change color scheme', theme)
    switch (theme) {
      case 'auto':
        setCurrentTheme(Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme)
        break;
      case 'light':
        setCurrentTheme(lightTheme)
        break;
      case 'dark':
        setCurrentTheme(darkTheme)
        break;
      default:
        break;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, colors: currentTheme }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

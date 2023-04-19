import React from 'react';
import { View } from 'react-native';
import { Text } from '../Text/Text';
import { ThemeButton } from '../ThemeButton/ThemeButton';
import { useThemeTopBarStyle } from './TopBar.design';
import * as packageProps from '../../../package.json'

export const TopBar: React.FC = () => {
  const design = useThemeTopBarStyle();
  const packageName = packageProps.name.replaceAll('-', ' ');
  return (
    <View style={design.container}>
      <Text style={design.text}>{packageName}</Text>
      <ThemeButton />
    </View>
  );
};

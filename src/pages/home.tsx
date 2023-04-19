import React from 'react';
import { Screen } from '../components/Screen/Screen';
import { SignalStrengh } from '../components/SignalStrengh/SignalStrengh';
import { TopBar } from '../components/TopBar/TopBar';

const Home: React.FC = () => {
  return (
    <Screen useSafeArea>
      <TopBar />
      <SignalStrengh />
    </Screen>
  );
};

export default Home;

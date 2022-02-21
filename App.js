import React from 'react';
import {LogBox} from 'react-native';
import AppContainer from './src/navigation/AppContainer';
LogBox.ignoreAllLogs();

const App = () => {
  return <AppContainer />;
};

export default App;

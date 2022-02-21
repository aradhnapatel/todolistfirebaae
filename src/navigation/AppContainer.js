import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginComponent from '../component/LoginComponent';
import SignupComponent from '../component/SignupComponent';
import HomeComponent from '../component/HomeComponent';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Home from '../component/Home';

const Stack = createStackNavigator();

const AppContainer = () => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const unRegister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist);
      } else {
        setUser('');
      }
    });
    return () => {
      unRegister();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginComponent} />
            <Stack.Screen name="Signup" component={SignupComponent} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;

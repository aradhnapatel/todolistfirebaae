import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const userLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Please add all the field');
      return;
    }
    try {
      // store users details in firebase database using with firestore.
      const result = await auth().signInWithEmailAndPassword(email, password);

      if (result) {
        setLoading(false);
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.flex}>
        <TextInput
          value={email}
          placeholder="email"
          style={styles.textInput}
          onChangeText={em => setEmail(em)}
        />
        <TextInput
          value={password}
          placeholder="password"
          style={styles.textInput}
          onChangeText={pw => setPassword(pw)}
        />
        <TouchableOpacity
          style={styles.loginContainer}
          onPress={() => userLogin()}>
          <Text style={styles.btnText}>login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerContainer}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.color}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingHorizontal: 20,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  flex: {
    marginTop: 20,
  },
  textInput: {
    borderWidth: 0.5,
    color: 'black',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
  loginContainer: {
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    backgroundColor: '#91C483',
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  signup: {
    textAlign: 'center',
    margin: 20,
  },
  registerContainer: {
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#91C483',
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
  },
  color: {
    fontWeight: 'bold',
    color: '#91C483',
  },
});

export default LoginComponent;

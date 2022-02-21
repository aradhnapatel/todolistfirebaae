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
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SignupComponent = () => {
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

  const userSigup = async () => {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Please add all the field');
      return;
    }
    try {
      // store users details in firebase database using with firestore.
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      console.log('-----', result);
      firestore().collection('users').doc(result.user.uid).set({
        email: result.user.email,
        uid: result.user.uid,
      });
      if (result) {
        navigation.navigate('Login');
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
          onPress={() => userSigup()}>
          <Text style={styles.btnText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signup}>
            Already have account ? <Text style={styles.color}>Login</Text>
          </Text>
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
  color: {
    color: '#91C483',
    fontWeight: 'bold',
  },
});

export default SignupComponent;

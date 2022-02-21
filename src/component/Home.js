import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Home = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [todo, setTodo] = useState([]);
  const [check] = useState(false);

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, subTitle, complete} = doc.data();
        list.push({
          id: doc.id,
          title,
          subTitle,
          complete,
        });
      });
      setTodo(list);
      if (loading) {
        setLoading(true);
      }
    });
  }, []);

  //  create collection in firebase
  const ref = firestore().collection('TodoList');

  //  logout
  const handelLogin = () => {
    auth().signOut();
    navigation.navigate('Login');
  };

  //   add todoList
  const addTodo = async () => {
    setName('');
    setLastName('');
    await ref.add({
      title: name,
      subTitle: lastName,
      complete: false,
    });
    if (loading) {
      setLoading(false);
    }
  };
  // true false check
  const toggleComplete = async item => {
    await ref.doc(item.id).update({
      complete: !item.complete,
    });
  };
  // delete
  const RemoveList = async item => {
    await ref.doc(item.id).delete();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.todoTitle}>To-Do List</Text>
          <TextInput
            value={name}
            onChangeText={nm => setName(nm)}
            placeholder={'enter firstName'}
            style={styles.textInput}
            autoFocus={true}
          />
          <TextInput
            value={lastName}
            onChangeText={nm => setLastName(nm)}
            placeholder={'enter LastName'}
            style={styles.textInput}
            autoFocus={true}
          />
          <TouchableOpacity style={styles.add} onPress={() => addTodo()}>
            <Text>+ Add</Text>
          </TouchableOpacity>
        </View>

        {todo.length > 0 ? (
          <FlatList
            data={todo}
            renderItem={({item}) => {
              return (
                <View>
                  <View style={styles.row}>
                    <View style={styles.oneRow}>
                      <CheckBox
                        checkBoxColor={'#91C483'}
                        onClick={() => toggleComplete(item)}
                        isChecked={!item.complete ? check : !check}
                      />
                      <Text style={styles.text}>
                        {item.title} {item.subTitle}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => RemoveList(item)}>
                      <Image
                        source={require('../images/delete.png')}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        ) : undefined}
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => handelLogin()}>
          <Text style={styles.logOut}>logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  logOut: {
    fontWeight: 'bold',
    backgroundColor: '#91C483',
    textAlign: 'center',
    padding: 15,
    paddingHorizontal: 80,
    marginHorizontal: 20,
    fontSize: 15,
  },
  wrapper: {
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  oneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 20,
  },
  textInput: {
    borderWidth: 0.2,
    borderColor: '#91C483',
    padding: 12,
    margin: 10,
    borderRadius: 20,
    width: '70%',
  },
  bottom: {
   
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  add: {
    backgroundColor: '#91C483',
    padding: 12,
    borderRadius: 20,
    paddingHorizontal: 30,
    marginTop: 10,
    width: '70%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
    marginLeft: 10,
  },
  icon: {
    tintColor: 'red',
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
});

export default Home;

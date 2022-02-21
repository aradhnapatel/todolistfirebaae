import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import CheckBox from 'react-native-check-box';

const HomeComponent = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [check, setCheck] = useState(false);

  const ref = firestore().collection('todos');

  const handelLogin = () => {
    auth().signOut();
    navigation.navigate('Login');
  };

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
      setTodos(list);
      if (loading) {
        setLoading(true);
      }
    });
  }, []);

  const toggleComplete = async item => {
    await ref.doc(item.id).update({
      complete: !item.complete,
    });
  };

  const addTodo = async () => {
    setTitle('');
    setSubTitle('');
    await ref.add({
      title: title,
      subTitle: subTitle,
      complete: false,
    });
    if (loading) {
      setLoading(false);
    }
  };

  const RemoveDoc = async item => {
    await ref.doc(item.id).delete();
  };

  const Item = ({item}) => {
    return (
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <TouchableOpacity
          style={[styles.row, {width: '45%'}]}
          onPress={() => toggleComplete(item)}>
          <CheckBox
            style={{padding: 10}}
            onClick={() => toggleComplete(item)}
            isChecked={!item.complete ? check : !check}
          />
          <View>
            <Text>{item.title}</Text>
            <Text>{item.subTitle}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => RemoveDoc(item)}>
          {/* <Image source={Images.delete} style={styles.delImg} /> */}
          <Text>delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handelLogin()}>
        <Text style={styles.logOut}>logout</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={{flex: 1, marginTop: 20}}>
          <Text style={{fontSize: 19, textAlign: 'center'}}>
            List of TODOs!
          </Text>
          <FlatList data={todos} renderItem={Item} />
        </View>
        <TextInput
          placeholder={'Title'}
          value={title}
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder={'Sub Title'}
          value={subTitle}
          autoCorrect={false}
          autoCapitalize="none"
          style={[styles.textInput, {marginTop: 20}]}
          onChangeText={setSubTitle}
        />
        <TouchableOpacity onPress={() => addTodo()} style={styles.buttonView}>
          <Text>Add TODO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logOut: {
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#91C483',
    width: '30%',
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },

  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
    height: 45,
    width: '100%',
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 50,
  },
  textInput: {
    backgroundColor: 'gray',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  delImg: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});

export default HomeComponent;

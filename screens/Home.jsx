import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.optionContainer}>
      <ImageBackground
        source={require('./Images/bg1.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate('storeID')}>
          <Text style={styles.buttonTextStyle}>Store ID</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate('verifyID')}>
          <Text style={styles.buttonTextStyle}>Verify ID</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>View ID</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    paddingTop: 30,
  },

  optionContainer: {
    flex: 1,
    width: '100%',
  },
  option: {
    color: 'white',
  },
  buttonStyle: {
    backgroundColor: '#3399FF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#3399FF',
    // height: 40,
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Home;

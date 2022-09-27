import React, {useState, createRef, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';

import Image1 from '../../../../home_img_1.png';
import Image2 from '../../../../home_img_2.png';
import Image3 from '../../../../home_img_3.png';
import {useMoralis} from 'react-moralis';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.mainBody}>
      <View>
        <View style={{backgroundColor: 'rgba(217, 217, 217, 1)', padding: 5}}>
          <Text style={styles.logoText}>DWallet</Text>
          <Text style={styles.logoSubtext}>
            The most secure place for your identity
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#7FB3D5',
            borderRadius: 12,
            height: '18%',
            marginHorizontal: 10,
            marginTop: 8,
          }}>
          <Image source={Image1} style={styles.itemImage} />
          <Text style={styles.itemTitle}>Digital ID Verification</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#76D7C4',
            borderRadius: 12,
            height: '18%',
            marginHorizontal: 10,
            marginTop: 8,
          }}>
          <Image source={Image2} style={styles.itemImage} />
          <Text style={styles.itemTitle}>View Wallet</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F7DC6F',
            borderRadius: 12,
            height: '18%',
            marginHorizontal: 10,
            marginTop: 8,
          }}>
          <Image source={Image1} style={styles.itemImage} />
          <Text style={styles.itemTitle}>Verify Banking Services</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F0B27A',
            borderRadius: 12,
            height: '18%',
            marginHorizontal: 10,
            marginTop: 8,
          }}>
          <Image source={Image3} style={styles.itemImage} />
          <Text style={styles.itemTitle}>View Personal Details</Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#A93226',
            padding: 20,
            alignSelf: 'center',
            borderRadius: 8,
            marginTop: 10,
          }}
          onPress={() => navigation.push('Onboarding')}>
          <Text
            style={{
              alignSelf: 'center',
              color: '#fff',
              fontFamily: 'Kiwi Maru',
              fontSize: 20,
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoText: {
    fontFamily: 'Kiwi Maru',
    fontWeight: '500',
    fontSize: 40,
    color: 'rgb(50, 30, 99)',
    marginLeft: 10,
  },
  logoSubtext: {
    fontFamily: 'Kiwi Maru',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(50,30,99)',
    textAlign: 'center',
  },
  itemImage: {
    alignSelf: 'center',
    marginLeft: 10,
    borderRadius: 12,
  },
  itemTitle: {
    alignSelf: 'center',
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Kiwi Maru',
    color: 'rgb(50, 30, 99)',
  },
});

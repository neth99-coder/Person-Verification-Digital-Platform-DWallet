import React, {useState, createRef, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import CoinbaseLogo from '../../../logo.jpg';
import Button from '../onboarding/components/Button';

import {useMoralis} from 'react-moralis';

const Onboarding = ({navigation}) => {
  const {isAuthenticated} = useMoralis();

  return (
    <SafeAreaView style={styles.mainBody}>
      <View style={{justifyContent: 'center', flex: 1}}>
        <View style={{alignSelf: 'center'}}>
          <Image
            source={CoinbaseLogo}
            style={{width: 330, height: 250, marginRight: 15}}
          />
          <Text
            style={{
              fontFamily: 'Kiwi Maru',
              fontWeight: '500',
              fontSize: 40,
              color: 'rgb(50, 30, 99)',
              marginLeft: 20,
            }}>
            DWALLET
          </Text>
        </View>
        <View style={{width: '70%', alignSelf: 'center'}}>
          <Text
            style={{
              fontFamily: 'Kiwi Maru',
              fontWeight: '400',
              fontSize: 12,
              color: 'rgb(50,30,99)',
              textAlign: 'center',
            }}>
            The most secure place for your identity
          </Text>
        </View>
      </View>

      <View>
        <Button
          buttonName={'Create new Wallet'}
          action={() => navigation.push('CreateUsername')}
        />
        <TouchableOpacity
          style={{marginTop: 13, marginBottom: 15}}
          onPress={() => navigation.push('SignIn')}>
          <Text
            style={{
              fontFamily: 'Kiwi Maru',
              fontWeight: '500',
              color: '#1652F0',
              fontSize: 15,
              textAlign: 'center',
            }}>
            Login to your Existing Wallet
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Onboarding;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

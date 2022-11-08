/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

import {scheme} from './app.json';

import {
  useWalletConnect,
  withWalletConnect,
} from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {ethers} from 'ethers';
import {loadContracts} from './utils/load-contracts';
import Web3 from 'web3';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length,
  )}`;
};

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const isDarkMode = useColorScheme() === 'dark';

  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const _provider = new WalletConnectProvider({
    rpc: {
      1337: 'http://192.168.1.2:7545',
    },
    chainId: 1337,
    connector: connector,
    qrcode: false,
  });

  const provider = async () => {
    let wp = await _provider.enable();
    let provider;
    if (wp) {
      provider = new ethers.providers.Web3Provider(_provider);
      // provider = new Web3.providers.HttpProvider('http://192.168.1.2:7545');
    }
    // console.log('provider: ', provider);
    console.log(_provider.connected);
    // const contract = await loadContracts('AuthVerifier', provider);
    await loadContracts('AuthVerifier', provider);

    // setWeb3Api({web3: new Web3(_provider), _provider, contract});
    // console.log(_provider);
    return _provider;
  };

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{height: '100%'}}>
        {/* <Header /> */}
        <View style={styles.container}>
          <View>
            {!connector.connected && (
              <View style={{flex: 1}}>
                <Text
                  style={{
                    flex: 1,
                    color: '#FFFFFF',
                    fontSize: 26,
                    fontWeight: '600',
                    textAlign: 'center',
                    marginTop: 40,
                  }}>
                  Welcome to DWallet
                </Text>
                <Image
                  source={require('./assets/logo.png')}
                  resizeMode={'center'}
                  style={styles.startImg}
                />
                <TouchableOpacity
                  onPress={connectWallet}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
                </TouchableOpacity>
              </View>
            )}
            {!!connector.connected && (
              <>
                <Text
                  style={{color: '#FFFFFF', fontSize: 16, fontWeight: '600'}}>
                  Your Account :{shortenAddress(connector.accounts[0])}
                </Text>
                <TouchableOpacity
                  onPress={killSession}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Log out</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log(provider());
                  }}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Test</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: isDarkMode ? Colors.black : Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#3399FF',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#3399FF',
    maxHeight: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 50,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  startImg: {
    flex: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

// export default App;
export default withWalletConnect(App, {
  clientMeta: {
    description: 'Connect with WalletConnect',
  },
  redirectUrl: Platform.OS === 'web' ? window.location.origin : `${scheme}://`,
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});

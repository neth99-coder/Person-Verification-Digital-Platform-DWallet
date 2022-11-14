/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from "react";
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
  Alert,
} from "react-native";

import { Colors, Header } from "react-native/Libraries/NewAppScreen";

import { scheme } from "./app.json";

import {
  useWalletConnect,
  withWalletConnect,
} from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { loadContracts } from "./utils/load-contracts";
import Web3 from "web3";
require("dotenv").config();

const OWNER_PRIVATE_KEY = process.env.PRIVATE_KEY;

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

const Section: React.FC<{
  title: string;
}> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    contract: null,
  });
  const [web3Account, setWeb3Account] = useState([]);

  const isDarkMode = useColorScheme() === "dark";

  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const loadProvider = async () => {
    await loadContracts("AuthWallet", setWeb3Api);
  };

  const storeId = async () => {
    const { contract, web3 } = web3Api;
    const account = connector.accounts[0];
    const signer = web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY);
    web3.eth.accounts.wallet.add(signer);

    const tx = contract.methods.createWallet();
    const tx2 = contract.methods.setPersonalDetails("jathu");
    let isCreated = true;
    try {
      const receipt = await tx
        .send({
          from: account,
          gas: 6000000,
        })
        .once("transactionHash", (txhash) => {
          console.log(`Mining transaction ...`);
          console.log(`https://goerli.etherscan.io/tx/${txhash}`);
        });
      // The transaction is now on chain!
      console.log(`Mined in block ${receipt.blockNumber}`);
    } catch (e) {
      isCreated = false;
      console.log(e);
      Alert.alert("Cannot create");
    }
    if (isCreated) {
      const receipt2 = await tx2
        .send({
          from: account,
          gas: 6000000,
        })
        .once("transactionHash", (txhash) => {
          console.log(`Mining transaction ...`);
          console.log(`https://goerli.etherscan.io/tx/${txhash}`);
        });
      // The transaction is now on chain!
      console.log(`Mined in block ${receipt2.blockNumber}`);
    }
  };

  const viewId = async () => {
    const { contract, web3 } = web3Api;
    const account = connector.accounts[0];
    const signer = web3.eth.accounts.privateKeyToAccount(OWNER_PRIVATE_KEY);
    web3.eth.accounts.wallet.add(signer);

    await contract.methods
      .sendCreadentials()
      .call({ from: account }, (err, result) => {
        if (err) {
          console.log("cannot retrieve");
          Alert.alert("cannot retrieve");
        } else {
          console.log("your ID is:", result);
          Alert.alert("your ID is:", result);
        }
      });
  };

  useEffect(() => {
    loadProvider();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={{ height: "100%" }}>
        {/* <Header /> */}
        <View style={styles.container}>
          <View>
            {!connector.connected && (
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    flex: 1,
                    color: "#FFFFFF",
                    fontSize: 26,
                    fontWeight: "600",
                    textAlign: "center",
                    marginTop: 40,
                  }}
                >
                  Welcome to DWallet
                </Text>
                <Image
                  source={require("./assets/logo.png")}
                  resizeMode={"center"}
                  style={styles.startImg}
                />
                <TouchableOpacity
                  onPress={async () => {
                    await connectWallet();
                  }}
                  style={styles.startButtonStyle}
                >
                  <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
                </TouchableOpacity>
              </View>
            )}
            {!!connector.connected && (
              <>
                <Text
                  style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}
                >
                  Your Account :{shortenAddress(connector.accounts[0])}
                </Text>

                <TouchableOpacity onPress={storeId} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>StoreId</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={viewId} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>View ID</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={killSession}
                  style={styles.logoutButtonStyle}
                >
                  <Text style={styles.buttonTextStyle}>Log out</Text>
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
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: isDarkMode ? Colors.black : Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: "#088F8F",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  startButtonStyle: {
    flex: 1,
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 50,
  },
  logoutButtonStyle: {
    flex: 1,
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 200,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  startImg: {
    flex: 3,
    alignSelf: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

// export default App;
export default withWalletConnect(App, {
  clientMeta: {
    description: "Connect with WalletConnect",
  },
  redirectUrl: Platform.OS === "web" ? window.location.origin : `${scheme}://`,
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});

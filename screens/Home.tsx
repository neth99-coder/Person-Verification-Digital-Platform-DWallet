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
  useWindowDimensions,
} from "react-native";

import { Colors, Header } from "react-native/Libraries/NewAppScreen";

import { scheme } from "../app.json";

import {
  useWalletConnect,
  withWalletConnect,
} from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { loadContracts } from "../utils/load-contracts";
import cryptoConverter from "../utils/crypto-converter";
import { ethers } from "ethers";
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

const Section: React.FC<{
  title: string;
}> = ({ children, title }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.white,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: Colors.light,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const Home = ({ navigation }) => {
  const [contract, setContract] = useState(null);
  const [verifierContract, setVerifierContract] = useState(null);

  const [signer, setSigner] = useState(null);

  // const isDarkMode = useColorScheme() === "dark";

  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    setContract(null);
    setSigner(null);
    return connector.killSession();
  }, [connector]);

  const setUpSigner = async () => {
    const provider = new WalletConnectProvider({
      rpc: {
        5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      },
      chainId: 5,
      connector: connector,
      qrcode: false,
    });
    await provider.enable();
    const ethers_provider = new ethers.providers.Web3Provider(provider);
    const signer = await ethers_provider.getSigner();
    setSigner(signer);

    await loadProvider();
  };

  const loadProvider = async () => {
    await loadContracts("AuthWallet", setContract, signer);
    await loadContracts("AuthVerifier", setVerifierContract, signer);
  };

  const createAccount = async () => {
    let success = true;
    try {
      await contract.createWallet();
    } catch (error) {
      success = false;
      console.log(error);
      Alert.alert("Cannot Create Wallet\n(May be already created)");
    }
    if (success) {
      Alert.alert("Wallet Created");
    }
  };

  const viewId = async () => {
    try {
      const res = await contract.sendCreadentials();
      const originalText = cryptoConverter.decrypt(res);
      const arr = originalText.split("|");
      Alert.alert(
        arr[0] +
          "\n" +
          arr[1] +
          "\n" +
          arr[2] +
          "\n" +
          arr[3] +
          "\n" +
          arr[4] +
          "\n" +
          arr[5] +
          "\n" +
          arr[6] +
          "\n"
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Cannot View ID");
    }
  };

  // useEffect(() => {
  //   setUpSigner();
  // }, [connector]);

  return (
    <SafeAreaView>
      <StatusBar barStyle={"dark-content"} />
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
                  source={require("../assets/logo.png")}
                  resizeMode={"center"}
                  style={styles.startImg}
                />
                <TouchableOpacity
                  onPress={async () => {
                    await connectWallet();
                    // await setUpSigner();
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
                {!contract?.signer && (
                  <TouchableOpacity
                    onPress={async () => {
                      await setUpSigner();
                    }}
                    style={styles.buttonStyle}
                  >
                    <Text style={styles.buttonTextStyle}>Setup & Go</Text>
                  </TouchableOpacity>
                )}

                {!!contract?.signer && (
                  <>
                    <TouchableOpacity
                      onPress={async () => {
                        await createAccount();
                      }}
                      style={styles.buttonStyle}
                    >
                      <Text style={styles.buttonTextStyle}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={async () => {
                        navigation.navigate("StoreId", { contract: contract });
                      }}
                      style={styles.buttonStyle}
                    >
                      <Text style={styles.buttonTextStyle}>StoreId</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          await viewId();
                        } catch (error) {
                          console.log("error", error);
                        }
                      }}
                      style={styles.buttonStyle}
                    >
                      <Text style={styles.buttonTextStyle}>View ID</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={async () => {
                        // await setUpSigner();
                        navigation.navigate("VerifyId", {
                          user_contract: contract,
                          signer: signer,
                          verifier_contract: verifierContract,
                        });
                      }}
                      style={styles.buttonStyle}
                    >
                      <Text style={styles.buttonTextStyle}>Verify ID</Text>
                    </TouchableOpacity>
                  </>
                )}

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
    backgroundColor: Colors.black,
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
export default withWalletConnect(Home, {
  clientMeta: {
    description: "Connect with WalletConnect",
  },
  redirectUrl: Platform.OS === "web" ? window.location.origin : `${scheme}://`,
  storageOptions: {
    asyncStorage: AsyncStorage,
  },
});

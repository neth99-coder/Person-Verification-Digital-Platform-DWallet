import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import Home from "./Home";

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!connector.connected && (
        <View>
          <View style={styles.startContainer}>
            <Image
              source={require("./Images/logo.png")}
              resizeMode={"center"}
              style={styles.startImg}
            />

            <View style={styles.startBtn}>
              <TouchableOpacity
                onPress={connectWallet}
                style={styles.buttonStyle}
              >
                <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {!!connector.connected && (
        <>
          <Home />
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startContainer: {
    flex: 1,
  },
  startBtn: {
    flex: 1,
    alignItems: "center",
  },
  startImg: {
    flex: 3,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});

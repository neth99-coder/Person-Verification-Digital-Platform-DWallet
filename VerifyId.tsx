import * as React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";
import {
  DBRConfig,
  decode,
  TextResult,
} from "vision-camera-dynamsoft-barcode-reader";
import * as REA from "react-native-reanimated";
import cryptoConverter from "./utils/crypto-converter";
import { REACT_APP_SECRET } from "@env";
import { loadContracts } from "./utils/load-contracts";

export default function StoreId({ navigation }) {
  const { user_contract, signer } = navigation.state.params;

  const [verifier_contract, setVerifierContract] = useState(null);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [barcodeResults, setBarcodeResults] = React.useState(
    [] as TextResult[]
  );
  const devices = useCameraDevices();
  const device = devices.back;
  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const config: DBRConfig = {};
    config.template =
      '{"ImageParameter":{"BarcodeFormatIds":["BF_QR_CODE"],"Description":"","Name":"Settings"},"Version":"3.0"}'; //scan qrcode only

    const results: TextResult[] = decode(frame, config);
    REA.runOnJS(setBarcodeResults)(results);
  }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);

  const verifyId = async (data) => {
    await loadContracts("AuthVerifier", setVerifierContract, signer);
    console.log("verifier contract", verifier_contract);
    const array = data.split("|");
    const api_url = array[0];
    const service = array[1];
    const address = array[2];
    console.log(service)

    if (service == "create-bank-account") {
      let res;
      try {
        res = await verifier_contract.isAccountCreationVerifiable(address);
      } catch (error) {
        console.log(error);
        Alert.alert("Verifier cannot be verified");
      }
      if (res) {
        Alert.alert("Account creation verifiable");
      }
    } else if (service == "loan-request") {
      let res;
      try {
        res = await verifier_contract.isBankLaonVerifiable(address);
      } catch (error) {
        console.log(error);
        Alert.alert("Verifier cannot be verified");
      }
      if (res) {
        Alert.alert("Loan request verifiable");
      }
    } else if (service == "card-request") {
      let res;
      try {
        res = await verifier_contract.isCardRequestVerifiable(address);
      } catch (error) {
        console.log(error);
        Alert.alert("Verifier cannot be verified");
      }
      if (res) {
        Alert.alert("Card request verifiable");
      }
    }else{
        console.log("service not found")
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {device != null && hasPermission && (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
          <TouchableOpacity
            onPress={() => {
              if (barcodeResults[0]) {
                console.log(barcodeResults[0].barcodeText)
                verifyId(barcodeResults[0].barcodeText);
              } else {
                Alert.alert("No QR Code Detected");
              }
            }}
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>Verify</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barcodeText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  buttonStyle: {
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
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

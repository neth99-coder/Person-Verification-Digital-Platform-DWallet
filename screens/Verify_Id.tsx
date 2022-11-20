import * as React from "react";
import { useState } from "react";

import { StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { useCameraDevices } from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner";
import { loadContracts } from "../utils/load-contracts";
import cryptoConverter from "../utils/crypto-converter";
import axios from "axios";

export default function App({ navigation }) {
  const { user_contract, signer, verifier_contract } = navigation.state.params;
  // const [verifier_contract, setVerifierContract] = useState(null);
  const [id, setId] = useState("");

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const retrieveId = async () => {
    try {
      const res = await user_contract.sendCreadentials();
      const originalText = cryptoConverter.decrypt(res);
      const arr = originalText.split("|");
      const id =
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
        "\n";
      setId(id);
      console.log(id);
    } catch (error) {
      console.log(error);
      Alert.alert("Cannot retrieve ID");
    }
  };

  const verifyId = async (data) => {
    // await loadContracts("AuthVerifier", setVerifierContract, signer);
    console.log("verifier contract", verifier_contract);
    const array = data.split("|");
    const api_url = array[0];
    const service = array[1];
    const address = array[2];
    console.log(service);

    if (service == "create-bank-account") {
      let res;
      try {
        res = await verifier_contract.isAccountCreationVerifiable(address);
        if (res) {
          await retrieveId();
          console.log("here");

          console.log("here");

          axios
            .post(api_url, {
              id: id,
            })
            .then(function (response) {
              console.log(response.data);
              if (response.data == "failed") {
                Alert.alert("Try Again");
              } else {
                Alert.alert(`done`);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          Alert.alert("Verifier not registered for account creation");
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Verifier cannot be verified");
      }
    } else if (service == "loan-request") {
      let res;
      try {
        res = await verifier_contract.isBankLaonVerifiable(address);
        if (res) {
          await retrieveId();
          //todo call bank api

          axios
            .post(api_url, {
              id: id,
            })
            .then(function (response) {
              console.log(response.data);
              if (response.data == "failed") {
                Alert.alert("Try Again");
              } else {
                Alert.alert(`done`);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          Alert.alert("Verifier not registered for loan");
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Verifier cannot be verified");
      }
    } else if (service == "card-request") {
      let res;
      try {
        res = await verifier_contract.isCardRequestVerifiable(address);
        if (res) {
          await retrieveId();

          axios
            .post(api_url, {
              id: id,
            })
            .then(function (response) {
              console.log(response.data);
              if (response.data == "failed") {
                Alert.alert("Try Again");
              } else {
                Alert.alert(`done`);
              }
            })
            .catch(function (error) {
              console.log(error);
            });

          //todo call bank api
        } else {
          Alert.alert("Verifier not registered for cards");
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Verifier cannot be verified");
      }
    } else {
      console.log("service not found");
      Alert.alert("Wrong QR Code");
    }
  };

  // Alternatively you can use the underlying function:
  //
  //   const frameProcessor = useFrameProcessor((frame) => {
  //     'worklet';
  //     const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
  //     runOnJS(setBarcodes)(detectedBarcodes);
  //   }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
      // await loadContracts("AuthVerifier", setVerifierContract, signer);
    })();
  }, []);

  return (
    device != null &&
    hasPermission && (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        {/* {barcodes.map((barcode, idx) => (
          <Text key={idx} style={styles.barcodeTextURL}>
            {barcode.displayValue}
          </Text>
        ))} */}
        <TouchableOpacity
          onPress={() => {
            if (barcodes[0]) {
              verifyId(barcodes[0].displayValue);
            } else {
              Alert.alert("No QR code detected");
            }
          }}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonTextStyle}>Verify</Text>
        </TouchableOpacity>
      </>
    )
  );
}

const styles = StyleSheet.create({
  barcodeTextURL: {
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

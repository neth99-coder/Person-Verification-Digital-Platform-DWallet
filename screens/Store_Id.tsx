import * as React from "react";
import { useState } from "react";

import { StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { useCameraDevices } from "react-native-vision-camera";
import { Camera } from "react-native-vision-camera";
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner";
import cryptoConverter from "../utils/crypto-converter";
import { REACT_APP_SECRET } from "@env";

export default function App({ navigation }) {
  const { contract } = navigation.state.params;

  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const storeId = async (data) => {
    let success = true;
    try {
      await contract.setPersonalDetails(data);
    } catch (error) {
      success = false;
      console.log(error);
      Alert.alert("cannot store Id");
    }
    if (success) {
      Alert.alert("Id stored");
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
              try {
                const originalText = cryptoConverter.decrypt(
                  barcodes[0].displayValue
                );
                if (originalText.split("|").pop() == REACT_APP_SECRET) {
                  storeId(barcodes[0].displayValue);
                } else {
                  Alert.alert("Invalid ID");
                }
              } catch (error) {
                Alert.alert("Invalid ID");
              }
            } else {
              Alert.alert("No QR Code Detected");
            }
          }}
          style={styles.buttonStyle}
        >
          <Text style={styles.buttonTextStyle}>Store Id</Text>
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

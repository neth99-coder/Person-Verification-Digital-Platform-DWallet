import * as React from "react";
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

export default function StoreId({ navigation }) {
  const { contract } = navigation.state.params;

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
                const originalText = cryptoConverter.decrypt(
                  barcodeResults[0].barcodeText
                );
                if (originalText.split("|").pop() == REACT_APP_SECRET) {
                  storeId(barcodeResults[0].barcodeText);
                } else {
                  Alert.alert("Invalid ID");
                }
              } else {
                Alert.alert("No QR Code Detected");
              }
            }}
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>StoreId</Text>
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

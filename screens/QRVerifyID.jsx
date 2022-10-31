import * as React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

import {BarCodeScanner} from 'expo-barcode-scanner';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  render() {
    const {hasCameraPermission, scanned} = this.state;

    if (hasCameraPermission === null) {
      return <Text> Requestingfor camera permission </Text>;
    }
    if (hasCameraPermission === false) {
      return <Text> No access to camera </Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
          <Button
            title={'Tap to Scan Again'}
            onPress={() =>
              this.setState({
                scanned: false,
              })
            }
          />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({type, data}) => {
    this.setState({
      scanned: true,
    });

    //todo call bank api
    axios
      .post(data, {
        id: 'test_001',
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
}

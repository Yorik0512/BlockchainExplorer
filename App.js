/**
 * @file
 * Contains implementation of App main component.
 */

// Core imports.
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native';
// Expo imports.
import { BarCodeScanner, Permissions } from 'expo';
// Global js import.
import './global';
// BlockChainService imports.
import BlockChainService from "./services/blockchain.service";

/**
 * Main Class of App component.
 */
export default class App extends React.Component {
  /**
   * Local state.
   */
  state = {
    hasCameraPermission: null,
    lastScannedData: null,
  };

  /**
   * Lifecycle hook.
   */
  componentDidMount() {
    this._requestCameraPermission();
  }

  /**
   * Get access to camera.
   */
  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  /**
   * Bar cod reader handler.
   */
  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedData) {
      LayoutAnimation.spring();
      BlockChainService.getTransactionById(result.data).then(data => {
        this.setState({
          lastScannedData: data
        });
      });
    }
  };

  /**
   * Get Back link handler.
   */
  _getBack = () => {
    this.setState({
      lastScannedData: null,
    });
  };

  /**
   * Render popup.
   */
  _popUp () {
    if (!this.state.lastScannedData) {
      return;
    }

    return (
      <View style={styles.popup}>
        <Text style={styles.scannedData}>{this.state.lastScannedData}</Text>
        <TouchableOpacity style={styles.getBackLink} onPress={this._getBack}>
          <Text style={styles.getBackLinkText}>
            Tap to scan another item
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Render component DOM.
   */
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
            ? <Text style={{ color: '#fff' }}>
              Camera permission is not granted
            </Text>
            :<BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
              }}
        />}
        <Text style={styles.cameraHelpMessage}>Locating Qr Code</Text>
        {this._popUp()}
      </View>
    );
  }
}

/**
 * Component styles.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  cameraHelpMessage: {
    position: 'absolute',
    top: 40,
    left: "50%",
    marginLeft: -110,
    right: 0,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#98d920',
    padding: 10,
    width: 220,
    textAlign: 'center',
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 15,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  getBackLink: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    width: "60%",
    position: 'absolute',
    bottom: 100,
    left: "20%"
  },
  getBackLinkText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  scannedData: {
    color: '#fff',
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#98d920',
    textAlign: 'center',
    width: '90%',
    marginLeft: '5%',
    padding: 10,
  }
});

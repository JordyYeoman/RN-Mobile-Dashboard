/**
 * @format
 */
import {Platform, UIManager, AppRegistry} from 'react-native';
import {name as appName} from './app.json';

/** Enables RN's LayoutAnimation on Android */
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

AppRegistry.registerComponent(
  appName,
  () => require('./AppWrapper').AppWrapper,
);

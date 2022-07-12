/**
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import io from 'socket.io-client';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {signIn, signUp, signOut} from './components/auth/AuthMethods';
import {themeColors} from './styles/theme';
import Box from './components/racing/box';
import Navbar from './components/layout/Navbar';
import {useDispatch} from 'react-redux';
import {setUserData} from './redux/features/counterSlice';
import SpriteSheet from './components/utility/SpriteSheet';
import RacingView from './components/racing/RacingView';

const socket = io('http://localhost:3000');

function App() {
  const [user, setUser] = useState<any>(null);
  const [usernameInput, setUsernameInput] = useState<any>(null);
  const [passwordInput, setPasswordInput] = useState<any>(null);
  const [signInLoading, setIsSignInLoading] = useState<boolean>(false);
  const [signUpLoading, setIsSignUpLoading] = useState<boolean>(false);
  // Socketio tests
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState<string | null>(null);
  const [lastRacePositions, setLastRacePositions] = useState<any | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('User', user);
  }, [user]);

  // handle socket shizz
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', (msg: any) => {
      setLastRacePositions(msg);
      console.log('Messages recieved: ', msg);
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const startRace = () => {
    socket.emit('start');
  };

  type User = {
    id: string;
    name: string;
    accountValue: number;
  };

  // handle sign in
  const handleSignInPress = useCallback(async () => {
    // Moved inside useCallback so it's not unnecessarily recreated
    const demoData: User = {
      id: '507idhabe1V312',
      name: 'Jordy',
      accountValue: 83124,
    };

    setIsSignInLoading(true);
    let res = await signIn(usernameInput, passwordInput);
    if (res?.user) {
      setUser(res);
      dispatch(setUserData(demoData));
      return;
    }
    setIsSignInLoading(false);
  }, [usernameInput, passwordInput, dispatch]);
  // handle sign out
  const handleSignOutPress = useCallback(async () => {
    await signOut();
    setUser(null);
    setIsSignUpLoading(false);
    setIsSignInLoading(false);
    dispatch(setUserData(null));
  }, [dispatch]);
  // handle sign up
  const handleSignUpPress = useCallback(async () => {
    setIsSignUpLoading(true);
    await signUp(usernameInput, passwordInput);
    setIsSignUpLoading(false);
  }, [usernameInput, passwordInput]);

  return (
    <SafeAreaView
      style={{backgroundColor: themeColors.primary.secondaryBackgroundColor}}>
      <Navbar />
      {/* <StatusBar backgroundColor="#61dafb" barStyle={'dark-content'} /> */}
      <View style={styles.loginViewContainer}>
        {/* <View>
          <Text>Connected: {'' + isConnected}</Text>
          <Text>Last pong: {lastPong || '-'}</Text>
          <Button title="Start Race" onPress={startRace} />
        </View> */}
        <View>
          <RacingView />
          {!user ? (
            <View>
              <View>
                <TextInput
                  style={styles.input}
                  onChangeText={setUsernameInput}
                  value={usernameInput}
                  placeholder="username"
                  keyboardType="default"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setPasswordInput}
                  value={passwordInput}
                  placeholder="password"
                  keyboardType="default"
                />
              </View>
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => {
                  handleSignInPress();
                }}>
                {signInLoading ? (
                  <ActivityIndicator
                    color={themeColors.primary.primaryTextColor}
                  />
                ) : (
                  <Text style={styles.homeButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => {
                  handleSignUpPress();
                }}>
                {signUpLoading ? (
                  <ActivityIndicator
                    color={themeColors.primary.primaryTextColor}
                  />
                ) : (
                  <Text style={styles.homeButtonText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text>Welcome {user?.email}</Text>
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => {
                  handleSignOutPress();
                }}>
                <Text style={styles.homeButtonText}>Sign Out</Text>
              </TouchableOpacity>
              {lastRacePositions &&
                lastRacePositions?.racers?.map((racer: any) => (
                  <Box
                    offsetValue={racer?.currentXPos / 1000}
                    key={Math.random() * 999}
                  />
                ))}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  loginViewContainer: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: themeColors.primary.backgroundColor,
  },
  input: {
    height: 55,
    margin: 12,
    borderWidth: 0.2,
    width: 300,
    color: '#000000',
    fontSize: 16,
    borderColor: themeColors.primary.border,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  homeButton: {
    height: 55,
    width: 300,
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: themeColors.primary.secondaryBackgroundColor,
  },
  homeButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 20,
  },
});

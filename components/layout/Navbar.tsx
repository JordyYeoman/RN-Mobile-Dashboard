import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {themeColors} from '../../styles/theme';

function Navbar() {
  const {userData} = useSelector((state: RootState) => state.counter);

  // TODO: Add money formatter - commas etc

  return (
    <View style={styles.container}>
      <Text style={styles.menuItem}>Online</Text>
      <View style={styles.accountValue}>
        <Image
          style={styles.credits}
          source={require('../../src/assets/gcredits.png')}
        />
        <Text style={styles.menuItem}>{userData?.accountValue ?? 0}</Text>
      </View>
      <Text style={styles.menuItem}>Menu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: themeColors.primary.secondaryBackgroundColor,
  },
  menuItem: {
    color: themeColors.primary.secondaryTextColor,
    fontWeight: 'bold',
  },
  accountValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  credits: {
    height: 11,
    marginTop: -2,
    width: 11,
    marginRight: 2,
    resizeMode: 'contain',
  },
});

export default Navbar;

import auth from '@react-native-firebase/auth';

// TODO - create user return type interface

export const signUp = async (
  email: string,
  password: string,
): Promise<any | Error> => {
  try {
    const res = await auth().createUserWithEmailAndPassword(email, password);
    console.log('User account created & signed in!');
    return res;
  } catch (error: any) {
    if (error?.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }
    if (error?.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    console.error(error);
    return new Error('Unable to create user');
  }
};

// Return boolean based on user sign out result
export const signOut = async (): Promise<any | Error> => {
  try {
    let res = await auth().signOut();
    return res;
  } catch (e: any) {
    console.error(e);
    return new Error('Unable to sign user out: ' + e);
  }
};

export const signIn = async (
  email: string,
  password: string,
): Promise<any | Error> => {
  let res;
  try {
    res = await auth().signInWithEmailAndPassword(email, password);
  } catch (e: any) {
    console.error(e);
    return new Error('Unable to sign in' + e);
  }
  return res;
};

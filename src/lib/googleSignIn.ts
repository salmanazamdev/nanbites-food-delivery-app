import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { 
  GOOGLE_WEB_CLIENT_ID, 
  GOOGLE_ANDROID_CLIENT_ID, 
//   GOOGLE_IOS_CLIENT_ID 
} from '@env';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: Platform.OS === 'ios' ? GOOGLE_IOS_CLIENT_ID : undefined,
    androidClientId: Platform.OS === 'android' ? GOOGLE_ANDROID_CLIENT_ID : undefined,
    offlineAccess: true,
  });
};
import { auth } from '../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export const initializeRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible'
  });
};

export const sendOTP = async (phoneNumber) => {
  try {
    const formattedPhone = '+972' + phoneNumber.substring(1);
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhone,
      window.recaptchaVerifier
    );
    window.confirmationResult = confirmationResult;
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

export const verifyOTP = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    return result.user;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};
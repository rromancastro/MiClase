import axios from 'axios';
const API_KEY = 'AIzaSyD-VPVmYIt-M4efFHWIyKsMbahvMdceGBk';

const URL_SINGUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const URL_SIGNIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

export async function signUp(email, password) {
  const res = await axios.post(URL_SINGUP, {
    email,
    password,
    returnSecureToken: true,
  });
  return res.data; // contiene idToken, localId, refreshToken, etc.
}

export async function signIn(email, password) {
  const res = await axios.post(URL_SIGNIN, {
    email,
    password,
    returnSecureToken: true,
  });
  return res.data; // mismo formato que arriba
}

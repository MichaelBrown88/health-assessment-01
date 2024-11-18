import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { getApp } from 'firebase/app';
// ... your existing firebase initialization code ...

if (process.env.NODE_ENV === 'development') {
  const functions = getFunctions(getApp());
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

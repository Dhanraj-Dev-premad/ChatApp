import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import {
  getCrashlytics,
  log,
  setUserId,
  setAttribute,
  setAttributes,
  crash,
} from '@react-native-firebase/crashlytics';

async function onSignIn(user) {
  const crashlytics = getCrashlytics();
  log(crashlytics, 'User signed in.');
  await Promise.all([
    setUserId(crashlytics, user.uid),
    setAttribute(crashlytics, 'credits', String(user.credits)),
    setAttributes(crashlytics, {
      role: 'admin',
      followers: '13',
      email: user.email,
      username: user.username,
    }),
  ]);
}

export default function CrashDemo() {
  useEffect(() => {
    log(getCrashlytics(), 'App mounted.');
  }, []);

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white',gap:50}}>
      <Button
        title="Sign In"
        onPress={() =>
          onSignIn({
            uid: 'Aa0Bb1Cc2Dd3Ee4Ff5Gg6Hh7Ii8Jj9',
            username: 'Joaquin Phoenix',
            email: 'phoenix@example.com',
            credits: 42,
          })
        }
      />
      <Button title="Test Crash" onPress={() => crash(getCrashlytics())} />
    </View>
  );
}
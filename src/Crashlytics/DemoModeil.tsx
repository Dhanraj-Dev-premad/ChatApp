
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {
  getCrashlytics,
  didCrashOnPreviousExecution,
  log,
  setUserId,
  setAttribute,
  setAttributes,
  crash,
} from '@react-native-firebase/crashlytics';

const DemoModeil = () => {
  const [crashStatus, setCrashStatus] = useState(
    'Checking previous crash...',
  );

  const [isChecking, setIsChecking] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const crashlytics = getCrashlytics();

  // Check whether the previous app session crashed
  useEffect(() => {
    const checkPreviousCrash = async () => {
      try {
        const didCrash = await didCrashOnPreviousExecution(
          crashlytics,
        );
        console.log("checking what is comming in didCrash:-",didCrash);
        
        

        if (didCrash) {
          log(crashlytics, 'Previous session crash detected.');

          setCrashStatus('Previous session crashed!');

          // Open the information modal automatically
          setModalVisible(true);
        } else {
          setCrashStatus('No previous crash detected.');
        }
      } catch (error) {
        console.error('Crash check failed:', error);
        setCrashStatus('Unable to check previous crash.');
      } finally {
        setIsChecking(false);
      }
    };

    log(crashlytics, 'Crashlytics screen mounted.');

    checkPreviousCrash();
  }, [crashlytics]);

  // Set user information in Crashlytics
  const handleSignIn = async () => {
    try {
      const user = {
        uid: 'test-user-123',
        username: 'Test User',
        email: 'test@example.com',
        credits: 42,
      };

      await Promise.all([
        setUserId(crashlytics, user.uid),

        setAttribute(
          crashlytics,
          'credits',
          String(user.credits),
        ),

        setAttributes(crashlytics, {
          role: 'admin',
          username: user.username,
          email: user.email,
        }),
      ]);

      log(crashlytics, 'Test user information added.');

      Alert.alert(
        'Success',
        'User information added to Crashlytics.',
      );
    } catch (error) {
      console.error('Failed to set user information:', error);

      Alert.alert(
        'Error',
        'Unable to save Crashlytics user information.',
      );
    }
  };

  // Save information entered in the modal
  const saveInfo = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !description.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields.',
      );
      return;
    }


    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Description:', description);

    setModalVisible(false);

    Alert.alert(
      'Success',
      'Information submitted successfully.',
    );

    setName('');
    setEmail('');
    setDescription('');
  };

  // Force a crash for testing
  const handleTestCrash = () => {
    log(crashlytics, 'User pressed Test Crash button.');
    crash(crashlytics);
  };

  // Wait until the previous crash check finishes
  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0857A0" />
        <Text style={styles.loadingText}>
          Checking previous app crash...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NextIn Chat App</Text>

      <Text style={styles.heading}>
        Previous Crash Status
      </Text>

      <Text
        style={[
          styles.status,
          crashStatus === 'Previous session crashed!'
            ? styles.crashStatus
            : styles.normalStatus,
        ]}>
        {crashStatus}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Set Test User"
          onPress={handleSignIn}
        />

        <Button
          title="Open User Info"
          onPress={() => setModalVisible(true)}
        />

        <Button
          title="Test Crash"
          color="red"
          onPress={handleTestCrash}
        />
      </View>

      

      {/* User Information Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>

        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>

              <Text style={styles.modalTitle}>
                {crashStatus === 'Previous session crashed!'
                  ? 'Crash Recovery Information'
                  : 'User Information'}
              </Text>

              {crashStatus === 'Previous session crashed!' && (
                <Text style={styles.modalNote}>
                  Your previous session crashed. Please
                  enter the information below.
                </Text> 
              )}

              <TextInput
                placeholder="Enter your Name"
                placeholderTextColor="gray"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Enter your Email"
                placeholderTextColor="gray"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Enter your Description"
                placeholderTextColor="gray"
                style={[
                  styles.input,
                  styles.descriptionInput,
                ]}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />

              <View style={styles.buttonContainer}>
                <Button
                  title="Save Info"
                  onPress={saveInfo}
                />

                <Button
                  title="Cancel"
                  color="gray"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DemoModeil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333333',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0857A0',
    marginBottom: 24,
  },

  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
  },

  status: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },

  crashStatus: {
    color: 'red',
  },

  normalStatus: {
    color: 'green',
  },

  buttonContainer: {
    width: '100%',
    gap: 15,
  },

  note: {
    marginTop: 25,
    fontSize: 14,
    textAlign: 'center',
    color: '#555555',
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 16,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0857A0',
    textAlign: 'center',
    marginBottom: 16,
  },

  modalNote: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 18,
  },

  input: {
    backgroundColor: '#F0F0F0',
    minHeight: 55,
    width: '100%',
    color: 'black',
    borderRadius: 11,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  descriptionInput: {
    height: 100,
    paddingTop: 14,
  },
});

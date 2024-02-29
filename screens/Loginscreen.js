import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    try {
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password);
        // After successful login, you can navigate to the dashboard or any other screen
        // For example:
        // navigation.navigate('Dashboard');
      } else {
        setErrorMessage('Please enter both email and password.');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
      <View style={{ flex: 1, backgroundColor: themeColors.bg }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ backgroundColor: 'skyblue', padding: 10, borderRadius: 20, marginLeft: 20 }}
            >
              <ArrowLeftIcon size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image
                source={require('../assets/images/login.png')}
                style={{ width: 200, height: 200 }}
            />
          </View>
        </SafeAreaView>
        <View style={{ flex: 1, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: 'gray', marginLeft: 20 }}>Email Address</Text>
            <TextInput
                style={{ backgroundColor: 'lightgray', color: 'gray', padding: 10, borderRadius: 20, marginBottom: 10 }}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={{ color: 'gray', marginLeft: 20 }}>Password</Text>
            <TextInput
                style={{ backgroundColor: 'lightgray', color: 'gray', padding: 10, borderRadius: 20, marginBottom: 10 }}
                placeholder="Enter your password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: 'skyblue', padding: 15, borderRadius: 20 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
            </TouchableOpacity>
            {errorMessage ? <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text> : null}
          </View>
          <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 18, textAlign: 'center', paddingVertical: 20 }}>Or</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            {/* Add social login buttons here */}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: 'gray', fontWeight: 'bold' }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ color: 'skyblue', fontWeight: 'bold' }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
}

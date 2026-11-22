import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { loginAdmin } from '@/services/api';

export default function AdminLoginScreen() {
  const { darkMode: dark, isAdmin, setIsAdmin } = useTheme();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const result = await loginAdmin(username, password);
    if (result?.token) {
      setIsAdmin(true);
      router.replace('/explore' as any);
    } else if (result === null) {
      setError("Can't reach the server. Make sure the API is running and your VPN is off.");
    } else {
      setError('Wrong username or password.');
    }
  };

  if (isAdmin) {
    return (
      <View style={[styles.container, dark && styles.darkContainer]}>
        <Text style={[styles.heading, dark && styles.darkText]}>You're logged in as admin</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/explore' as any)}>
          <Text style={styles.buttonText}>Go to Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ff3b30' }]}
          onPress={() => setIsAdmin(false)}>
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <Text style={[styles.heading, dark && styles.darkText]}>Admin Login</Text>
      <TextInput
        style={[styles.input, dark && styles.darkInput]}
        placeholder="Username"
        placeholderTextColor={dark ? '#888' : '#aaa'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, dark && styles.darkInput]}
        placeholder="Password"
        placeholderTextColor={dark ? '#888' : '#aaa'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        onSubmitEditing={handleLogin}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    justifyContent: 'center',
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  darkContainer: { backgroundColor: '#121212' },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 24 },
  darkText: { color: '#fff' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#111',
  },
  darkInput: { backgroundColor: '#1e1e1e', borderColor: '#444', color: '#fff' },
  error: { color: '#ff3b30', marginBottom: 12 },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
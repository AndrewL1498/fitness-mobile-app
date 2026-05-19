import { View, Text, Switch, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  return (
    <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.heading, darkMode && styles.darkText]}>Settings</Text>

      {/* Preferences */}
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Preferences</Text>
      <View style={[styles.card, darkMode && styles.darkCard]}>
        <View style={styles.row}>
          <Text style={[styles.label, darkMode && styles.darkText]}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={[styles.label, darkMode && styles.darkText]}>Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </View>

      {/* Profile */}
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Profile</Text>
      <View style={[styles.card, darkMode && styles.darkCard]}>
        <Text style={[styles.label, darkMode && styles.darkText]}>Name</Text>
        <TextInput
          style={[styles.input, darkMode && styles.darkInput]}
          placeholder="Enter your name"
          placeholderTextColor={darkMode ? '#888' : '#aaa'}
          value={name}
          onChangeText={setName}
        />
        <Text style={[styles.label, darkMode && styles.darkText]}>Age</Text>
        <TextInput
          style={[styles.input, darkMode && styles.darkInput]}
          placeholder="Enter your age"
          placeholderTextColor={darkMode ? '#888' : '#aaa'}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <Text style={[styles.label, darkMode && styles.darkText]}>Weight (lbs)</Text>
        <TextInput
          style={[styles.input, darkMode && styles.darkInput]}
          placeholder="Enter your weight"
          placeholderTextColor={darkMode ? '#888' : '#aaa'}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <Text style={[styles.label, darkMode && styles.darkText]}>Height (ft/in)</Text>
        <TextInput
          style={[styles.input, darkMode && styles.darkInput]}
          placeholder="Enter your height"
          placeholderTextColor={darkMode ? '#888' : '#aaa'}
          value={height}
          onChangeText={setHeight}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  darkText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  darkInput: {
    borderColor: '#444',
    color: '#fff',
  },
});
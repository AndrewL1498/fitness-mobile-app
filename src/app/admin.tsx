import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { loginAdmin, createProgram, createWorkout } from '@/services/api';

export default function AdminScreen() {
  const { darkMode: dark } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState<'programs' | 'workouts'>('programs');

  // Program form state
  const [programId, setProgramId] = useState('');
  const [programTitle, setProgramTitle] = useState('');
  const [programCategory, setProgramCategory] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programDuration, setProgramDuration] = useState('');
  const [programFrequency, setProgramFrequency] = useState('');
  const [programTime, setProgramTime] = useState('');
  const [programWeeks, setProgramWeeks] = useState('8');

  // Workout form state
  const [workoutId, setWorkoutId] = useState('');
  const [workoutProgramId, setWorkoutProgramId] = useState('');
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutSubtitle, setWorkoutSubtitle] = useState('');

  const handleLogin = async () => {
    const result = await loginAdmin(username, password);
    if (result?.token) {
      setToken(result.token);
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleCreateProgram = async () => {
    const numWeeks = parseInt(programWeeks);
    const weeks = Array.from({ length: numWeeks }, (_, i) => ({
      week: i + 1,
      days: [
        { day: 1, title: `Workout ${i * 3 + 1}`, isRest: false },
        { day: 2, title: 'Rest Day', isRest: true },
        { day: 3, title: `Workout ${i * 3 + 2}`, isRest: false },
        { day: 4, title: 'Rest Day', isRest: true },
        { day: 5, title: `Workout ${i * 3 + 3}`, isRest: false },
        { day: 6, title: 'Rest Day', isRest: true },
        { day: 7, title: 'Rest Day', isRest: true },
      ],
    }));

    const program = {
      _id: programId,
      title: programTitle,
      category: programCategory,
      description: programDescription,
      duration: programDuration,
      frequency: programFrequency,
      time: programTime,
      weeks,
    };

    const result = await createProgram(program);
    if (result?._id) {
      Alert.alert('Success', `Program "${programTitle}" created!`);
      setProgramId('');
      setProgramTitle('');
      setProgramCategory('');
      setProgramDescription('');
      setProgramDuration('');
      setProgramFrequency('');
      setProgramTime('');
      setProgramWeeks('8');
    } else {
      Alert.alert('Error', 'Failed to create program');
    }
  };

  const handleCreateWorkout = async () => {
    const workout = {
      _id: workoutId,
      programId: workoutProgramId,
      title: workoutTitle,
      subtitle: workoutSubtitle,
      sections: [],
    };

    const result = await createWorkout(workout);
    if (result?._id) {
      Alert.alert('Success', `Workout "${workoutTitle}" created!`);
      setWorkoutId('');
      setWorkoutProgramId('');
      setWorkoutTitle('');
      setWorkoutSubtitle('');
    } else {
      Alert.alert('Error', 'Failed to create workout');
    }
  };

  if (!token) {
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
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, dark && styles.darkContainer]}>
      <Text style={[styles.heading, dark && styles.darkText]}>Admin Panel</Text>

      {/* Section Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'programs' && styles.activeTab]}
          onPress={() => setActiveSection('programs')}>
          <Text style={[styles.tabText, activeSection === 'programs' && styles.activeTabText]}>
            Programs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'workouts' && styles.activeTab]}
          onPress={() => setActiveSection('workouts')}>
          <Text style={[styles.tabText, activeSection === 'workouts' && styles.activeTabText]}>
            Workouts
          </Text>
        </TouchableOpacity>
      </View>

      {activeSection === 'programs' ? (
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, dark && styles.darkText]}>Create Program</Text>
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="ID (e.g. muscle-up-beginner)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programId} onChangeText={setProgramId} autoCapitalize="none" />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Title" placeholderTextColor={dark ? '#888' : '#aaa'} value={programTitle} onChangeText={setProgramTitle} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Category (Skills, Strength, Mobility)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programCategory} onChangeText={setProgramCategory} />
          <TextInput style={[styles.input, dark && styles.darkInput, styles.textArea]} placeholder="Description" placeholderTextColor={dark ? '#888' : '#aaa'} value={programDescription} onChangeText={setProgramDescription} multiline numberOfLines={4} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Duration (e.g. 8 weeks)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programDuration} onChangeText={setProgramDuration} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Frequency (e.g. 3x per week)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programFrequency} onChangeText={setProgramFrequency} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Time (e.g. 45-60 minutes)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programTime} onChangeText={setProgramTime} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Number of weeks" placeholderTextColor={dark ? '#888' : '#aaa'} value={programWeeks} onChangeText={setProgramWeeks} keyboardType="numeric" />
          <TouchableOpacity style={styles.button} onPress={handleCreateProgram}>
            <Text style={styles.buttonText}>Create Program</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, dark && styles.darkText]}>Create Workout</Text>
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="ID (e.g. muscle-up-beginner-workout-1)" placeholderTextColor={dark ? '#888' : '#aaa'} value={workoutId} onChangeText={setWorkoutId} autoCapitalize="none" />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Program ID (e.g. muscle-up-beginner)" placeholderTextColor={dark ? '#888' : '#aaa'} value={workoutProgramId} onChangeText={setWorkoutProgramId} autoCapitalize="none" />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Title (e.g. Workout 1)" placeholderTextColor={dark ? '#888' : '#aaa'} value={workoutTitle} onChangeText={setWorkoutTitle} />
          <TextInput style={[styles.input, dark && styles.darkInput, styles.textArea]} placeholder="Subtitle/description" placeholderTextColor={dark ? '#888' : '#aaa'} value={workoutSubtitle} onChangeText={setWorkoutSubtitle} multiline numberOfLines={3} />
          <TouchableOpacity style={styles.button} onPress={handleCreateWorkout}>
            <Text style={styles.buttonText}>Create Workout</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    paddingTop: 60,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 24,
  },
  darkText: {
    color: '#fff',
  },
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
  darkInput: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
  },
  form: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 16,
  },
});
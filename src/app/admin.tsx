import { useState, useEffect } from 'react';
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
import { loginAdmin, createProgram, createWorkout, fetchAllPrograms, fetchWorkout } from '@/services/api';

export default function AdminScreen() {
  const { darkMode: dark, setIsAdmin } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState<'programs' | 'workouts' | 'exercises'>('programs');

  // Programs list
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

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

  // Sections/exercises form state
  const [targetWorkoutId, setTargetWorkoutId] = useState('');
  const [sections, setSections] = useState([
    {
      title: 'WARM UP',
      sets: '1 set',
      exercises: [{ name: '', reps: '', videoUrl: '' }],
    },
  ]);

  useEffect(() => {
    if (token) loadPrograms();
  }, [token]);

  const loadPrograms = async () => {
    const data = await fetchAllPrograms();
    setPrograms(data);
  };

const handleLogin = async () => {
  const result = await loginAdmin(username, password);
  if (result?.token) {
    setToken(result.token);
    setIsAdmin(true);
    Alert.alert('Success', 'Logged in as admin!');
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
      loadPrograms();
    } else {
      Alert.alert('Error', 'Failed to create program. ID may already exist.');
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
      Alert.alert('Error', 'Failed to create workout. ID may already exist.');
    }
  };

  const addExerciseToSection = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].exercises.push({ name: '', reps: '', videoUrl: '' });
    setSections(updated);
  };

  const removeExerciseFromSection = (sectionIndex: number, exerciseIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].exercises.splice(exerciseIndex, 1);
    setSections(updated);
  };

  const addSection = () => {
    setSections([...sections, {
      title: 'MAIN WORK',
      sets: '3 sets',
      exercises: [{ name: '', reps: '', videoUrl: '' }],
    }]);
  };

  const removeSection = (index: number) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const updateSection = (index: number, field: string, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const updateExercise = (sectionIndex: number, exerciseIndex: number, field: string, value: string) => {
    const updated = [...sections];
    updated[sectionIndex].exercises[exerciseIndex] = {
      ...updated[sectionIndex].exercises[exerciseIndex],
      [field]: value,
    };
    setSections(updated);
  };

  const handleSaveSections = async () => {
    if (!targetWorkoutId) {
      Alert.alert('Error', 'Please enter a workout ID');
      return;
    }

    const response = await fetch(`http://localhost:5000/api/workouts/${targetWorkoutId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections }),
    });

    const result = await response.json();
    if (result?._id) {
      Alert.alert('Success', 'Exercises saved to workout!');
      setTargetWorkoutId('');
      setSections([{
        title: 'WARM UP',
        sets: '1 set',
        exercises: [{ name: '', reps: '', videoUrl: '' }],
      }]);
    } else {
      Alert.alert('Error', 'Failed to save exercises. Check the workout ID.');
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
      
      {/* Header with logout */}
      <View style={styles.adminHeader}>
        <Text style={[styles.heading, dark && styles.darkText]}>Admin Panel</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => { setIsAdmin(false); setToken(null); }}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Section Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'programs' && styles.activeTab]}
          onPress={() => setActiveSection('programs')}>
          <Text style={[styles.tabText, activeSection === 'programs' && styles.activeTabText]}>Programs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'workouts' && styles.activeTab]}
          onPress={() => setActiveSection('workouts')}>
          <Text style={[styles.tabText, activeSection === 'workouts' && styles.activeTabText]}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'exercises' && styles.activeTab]}
          onPress={() => setActiveSection('exercises')}>
          <Text style={[styles.tabText, activeSection === 'exercises' && styles.activeTabText]}>Exercises</Text>
        </TouchableOpacity>
      </View>

      {/* Programs Tab */}
      {activeSection === 'programs' && (
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, dark && styles.darkText]}>Create Program</Text>
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="ID (e.g. muscle-up-beginner)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programId} onChangeText={setProgramId} autoCapitalize="none" />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Title" placeholderTextColor={dark ? '#888' : '#aaa'} value={programTitle} onChangeText={setProgramTitle} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Category (Skills, Strength, Mobility, Cardio, Muscle Growth)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programCategory} onChangeText={setProgramCategory} />
          <TextInput style={[styles.input, dark && styles.darkInput, styles.textArea]} placeholder="Description" placeholderTextColor={dark ? '#888' : '#aaa'} value={programDescription} onChangeText={setProgramDescription} multiline numberOfLines={4} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Duration (e.g. 8 weeks)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programDuration} onChangeText={setProgramDuration} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Frequency (e.g. 3x per week)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programFrequency} onChangeText={setProgramFrequency} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Time (e.g. 45-60 minutes)" placeholderTextColor={dark ? '#888' : '#aaa'} value={programTime} onChangeText={setProgramTime} />
          <TextInput style={[styles.input, dark && styles.darkInput]} placeholder="Number of weeks" placeholderTextColor={dark ? '#888' : '#aaa'} value={programWeeks} onChangeText={setProgramWeeks} keyboardType="numeric" />
          <TouchableOpacity style={styles.button} onPress={handleCreateProgram}>
            <Text style={styles.buttonText}>Create Program</Text>
          </TouchableOpacity>

          {/* Existing Programs */}
          <Text style={[styles.sectionTitle, dark && styles.darkText, { marginTop: 24 }]}>Existing Programs</Text>
          {programs.map((p) => (
            <View key={p._id} style={[styles.programCard, dark && styles.darkCard]}>
              <Text style={[styles.programCardTitle, dark && styles.darkText]}>{p.title}</Text>
              <Text style={[styles.programCardSub, dark && styles.darkSubText]}>{p.category} · {p.duration}</Text>
              <Text style={[styles.programCardId, dark && styles.darkSubText]}>ID: {p._id}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Workouts Tab */}
      {activeSection === 'workouts' && (
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

      {/* Exercises Tab */}
      {activeSection === 'exercises' && (
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, dark && styles.darkText]}>Add Exercises to Workout</Text>
          <TextInput
            style={[styles.input, dark && styles.darkInput]}
            placeholder="Workout ID (e.g. muscle-up-beginner-workout-1)"
            placeholderTextColor={dark ? '#888' : '#aaa'}
            value={targetWorkoutId}
            onChangeText={setTargetWorkoutId}
            autoCapitalize="none"
          />

          {sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={[styles.sectionCard, dark && styles.darkCard]}>
              <View style={styles.sectionCardHeader}>
                <Text style={[styles.sectionCardTitle, dark && styles.darkText]}>Section {sectionIndex + 1}</Text>
                <TouchableOpacity onPress={() => removeSection(sectionIndex)}>
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, dark && styles.darkInput]}
                placeholder="Section title (e.g. WARM UP)"
                placeholderTextColor={dark ? '#888' : '#aaa'}
                value={section.title}
                onChangeText={(val) => updateSection(sectionIndex, 'title', val)}
              />
              <TextInput
                style={[styles.input, dark && styles.darkInput]}
                placeholder="Sets (e.g. 3 sets)"
                placeholderTextColor={dark ? '#888' : '#aaa'}
                value={section.sets}
                onChangeText={(val) => updateSection(sectionIndex, 'sets', val)}
              />

              {section.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={[styles.exerciseForm, dark && styles.darkExerciseForm]}>
                  <View style={styles.exerciseFormHeader}>
                    <Text style={[styles.exerciseFormTitle, dark && styles.darkText]}>Exercise {exerciseIndex + 1}</Text>
                    <TouchableOpacity onPress={() => removeExerciseFromSection(sectionIndex, exerciseIndex)}>
                      <Text style={styles.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.input, dark && styles.darkInput]}
                    placeholder="Exercise name"
                    placeholderTextColor={dark ? '#888' : '#aaa'}
                    value={exercise.name}
                    onChangeText={(val) => updateExercise(sectionIndex, exerciseIndex, 'name', val)}
                  />
                  <TextInput
                    style={[styles.input, dark && styles.darkInput]}
                    placeholder="Reps (e.g. 10 reps)"
                    placeholderTextColor={dark ? '#888' : '#aaa'}
                    value={exercise.reps}
                    onChangeText={(val) => updateExercise(sectionIndex, exerciseIndex, 'reps', val)}
                  />
                  <TextInput
                    style={[styles.input, dark && styles.darkInput]}
                    placeholder="YouTube URL (optional)"
                    placeholderTextColor={dark ? '#888' : '#aaa'}
                    value={exercise.videoUrl}
                    onChangeText={(val) => updateExercise(sectionIndex, exerciseIndex, 'videoUrl', val)}
                  />
                </View>
              ))}

              <TouchableOpacity style={styles.addExerciseBtn} onPress={() => addExerciseToSection(sectionIndex)}>
                <Text style={styles.addExerciseBtnText}>+ Add Exercise</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addSectionBtn} onPress={addSection}>
            <Text style={styles.addSectionBtnText}>+ Add Section</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSaveSections}>
            <Text style={styles.buttonText}>Save Exercises to Workout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 60 }} />
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
  darkSubText: {
    color: '#aaa',
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
    gap: 8,
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
    fontSize: 13,
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
  programCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  programCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  programCardSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  programCardId: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  removeBtn: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseForm: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  darkExerciseForm: {
    backgroundColor: '#2a2a2a',
  },
  exerciseFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseFormTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  addExerciseBtn: {
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginTop: 8,
  },
  addExerciseBtnText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  addSectionBtn: {
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34c759',
    borderRadius: 8,
    marginBottom: 16,
  },
  addSectionBtnText: {
    color: '#34c759',
    fontWeight: '600',
    fontSize: 15,
  },

adminHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
},
logoutButton: {
  backgroundColor: '#ff3b30',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 16,
},
logoutButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
},



});
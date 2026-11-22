import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { createWorkout, fetchWorkout, updateWorkout } from '@/services/api';



function ExerciseCard({ exercise, dark }: { exercise: any; dark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  
  const getVideoId = (url: string) => {
    if (!url) return null;
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('v=')) {
      return url.split('v=')[1].split('&')[0];
    }
    return null;
  };

  const videoId = getVideoId(exercise.videoUrl);

  return (
    <TouchableOpacity
      style={[styles.exerciseCard, dark && styles.darkCard]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}>
      <View style={styles.exerciseRow}>
        <View style={styles.exerciseImage}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={[styles.exerciseName, dark && styles.darkText]}>
            {exercise.name}
          </Text>
          <Text style={[styles.exerciseReps, dark && styles.darkSubText]}>
            {exercise.reps}
          </Text>
        </View>
        <Text style={[styles.expandIcon, dark && styles.darkSubText]}>
          {expanded ? '▲' : '▼'}
        </Text>
      </View>
      {expanded && videoId && Platform.OS === 'web' && (
        <View style={{ width: '100%', height: 200, marginTop: 12 }}>
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none', borderRadius: 8 }}
          />
        </View>
      )}
      {expanded && videoId && Platform.OS !== 'web' && (
        <WebView
          style={styles.video}
          source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
          allowsFullscreenVideo
          javaScriptEnabled
        />
      )}
    </TouchableOpacity>
  );
}

type ExerciseDraft = { name: string; reps: string; videoUrl: string };
type SectionDraft = { title: string; sets: string; exercises: ExerciseDraft[] };

const emptyExercise = (): ExerciseDraft => ({ name: '', reps: '', videoUrl: '' });

function WorkoutBuilder({
  id,
  programId,
  dark,
  initial,
  onSaved,
  onCancel,
}: {
  id: string;
  programId: string;
  dark: boolean;
  initial?: any;
  onSaved: (workout: any) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const isEditing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? '');
  const [sections, setSections] = useState<SectionDraft[]>(() =>
    initial?.sections?.length
      ? initial.sections.map((section: any) => ({
          title: section.title ?? '',
          sets: section.sets ?? '',
          exercises: section.exercises?.length
            ? section.exercises.map((exercise: any) => ({
                name: exercise.name ?? '',
                reps: exercise.reps ?? '',
                videoUrl: exercise.videoUrl ?? '',
              }))
            : [emptyExercise()],
        }))
      : [{ title: 'WARM UP', sets: '1 set', exercises: [emptyExercise()] }]
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateSection = (sectionIndex: number, field: 'title' | 'sets', value: string) =>
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    );

  const updateExercise = (sectionIndex: number, exerciseIndex: number, field: string, value: string) =>
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              exercises: section.exercises.map((exercise, exercisePosition) =>
                exercisePosition === exerciseIndex ? { ...exercise, [field]: value } : exercise
              ),
            }
          : section
      )
    );

  const addExercise = (sectionIndex: number) =>
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? { ...section, exercises: [...section.exercises, emptyExercise()] }
          : section
      )
    );

  const removeExercise = (sectionIndex: number, exerciseIndex: number) =>
    setSections((current) =>
      current.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              exercises: section.exercises.filter((_, position) => position !== exerciseIndex),
            }
          : section
      )
    );

  const removeSection = (sectionIndex: number) =>
    setSections((current) => current.filter((_, index) => index !== sectionIndex));

  const handleSave = async () => {
    const cleanedSections = sections
      .map((section) => ({
        ...section,
        exercises: section.exercises.filter((exercise) => exercise.name.trim()),
      }))
      .filter((section) => section.exercises.length > 0);

    if (!title.trim() || cleanedSections.length === 0) {
      setError('Enter a workout title and at least one exercise name.');
      return;
    }

    setSaving(true);
    setError('');
    const body = { title: title.trim(), subtitle: subtitle.trim(), sections: cleanedSections };
    const result = isEditing
      ? await updateWorkout(id, body)
      : await createWorkout({ _id: id, programId, ...body });
    setSaving(false);

    if (result?._id) {
      onSaved(result);
    } else if (result === null) {
      setError("Can't reach the server. Make sure the API is running.");
    } else {
      setError(result?.message ?? 'Could not save the workout.');
    }
  };

  return (
    <ScrollView style={[styles.container, dark && styles.darkContainer]} contentContainerStyle={builderStyles.container}>
      <TouchableOpacity style={builderStyles.backButton} onPress={onCancel ?? (() => router.back())}>
        <Text style={builderStyles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={[builderStyles.heading, dark && styles.darkText]}>{isEditing ? 'Edit Workout' : 'Build Workout'}</Text>
      <TextInput style={[builderStyles.input, dark && builderStyles.darkInput]} placeholder="Workout title" placeholderTextColor={dark ? '#888' : '#aaa'} value={title} onChangeText={setTitle} />
      <TextInput style={[builderStyles.input, dark && builderStyles.darkInput]} placeholder="Short description (optional)" placeholderTextColor={dark ? '#888' : '#aaa'} value={subtitle} onChangeText={setSubtitle} />

      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={[builderStyles.section, dark && builderStyles.darkSection]}>
          <View style={builderStyles.rowBetween}>
            <Text style={[builderStyles.sectionHeading, dark && styles.darkText]}>Section {sectionIndex + 1}</Text>
            <TouchableOpacity onPress={() => removeSection(sectionIndex)}>
              <Text style={builderStyles.deleteText}>Delete section</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={[builderStyles.input, dark && builderStyles.darkInput]} placeholder="Section title" placeholderTextColor={dark ? '#888' : '#aaa'} value={section.title} onChangeText={(value) => updateSection(sectionIndex, 'title', value)} />
          <TextInput style={[builderStyles.input, dark && builderStyles.darkInput]} placeholder="Sets (e.g. 3 sets)" placeholderTextColor={dark ? '#888' : '#aaa'} value={section.sets} onChangeText={(value) => updateSection(sectionIndex, 'sets', value)} />
          {section.exercises.map((exercise, exerciseIndex) => (
            <View key={exerciseIndex} style={builderStyles.exercise}>
              <View style={builderStyles.rowBetween}>
                <Text style={[builderStyles.exerciseHeading, dark && styles.darkText]}>Exercise {exerciseIndex + 1}</Text>
                <TouchableOpacity onPress={() => removeExercise(sectionIndex, exerciseIndex)}>
                  <Text style={builderStyles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <TextInput style={[builderStyles.input, dark && builderStyles.darkInput]} placeholder="Exercise name" placeholderTextColor={dark ? '#888' : '#aaa'} value={exercise.name} onChangeText={(value) => updateExercise(sectionIndex, exerciseIndex, 'name', value)} />
              <TextInput style={[builderStyles.input, dark && builderStyles.darkInput]} placeholder="Reps (e.g. 10 reps)" placeholderTextColor={dark ? '#888' : '#aaa'} value={exercise.reps} onChangeText={(value) => updateExercise(sectionIndex, exerciseIndex, 'reps', value)} />
              <TextInput style={[builderStyles.input, dark && builderStyles.darkInput]} placeholder="YouTube link (optional)" placeholderTextColor={dark ? '#888' : '#aaa'} value={exercise.videoUrl} onChangeText={(value) => updateExercise(sectionIndex, exerciseIndex, 'videoUrl', value)} />
            </View>
          ))}
          <TouchableOpacity style={builderStyles.secondaryButton} onPress={() => addExercise(sectionIndex)}>
            <Text style={builderStyles.secondaryButtonText}>+ Add Exercise</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={builderStyles.secondaryButton} onPress={() => setSections((current) => [...current, { title: 'MAIN WORK', sets: '3 sets', exercises: [emptyExercise()] }])}>
        <Text style={builderStyles.secondaryButtonText}>+ Add Section</Text>
      </TouchableOpacity>
      {error ? <Text style={builderStyles.error}>{error}</Text> : null}
      <TouchableOpacity style={[builderStyles.saveButton, saving && builderStyles.disabled]} onPress={handleSave} disabled={saving}>
        <Text style={builderStyles.saveButtonText}>{saving ? 'Saving...' : 'Save Workout'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function WorkoutDetailScreen() {
  const { darkMode: dark, isAdmin } = useTheme();
  const { id, programId } = useLocalSearchParams();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const linkedProgramId =
    (programId as string) ?? (id as string).replace(/-w\d+-d\d+$/, '');
  const returnToRoutine = () =>
    router.push(`/program/${encodeURIComponent(linkedProgramId)}?tab=workouts` as any);

  useEffect(() => {
    const loadWorkout = async () => {
      const data = await fetchWorkout(id as string);
      setWorkout(data);
      setLoading(false);
    };
    loadWorkout();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, dark && styles.darkContainer]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.sectionTitle, dark && styles.darkText]}>Loading...</Text>
        </View>
      </View>
    );
  }

if (!workout) {
  if (isAdmin) {
    const workoutId = id as string;
    const linkedProgramId = (programId as string) ?? workoutId.replace(/-w\d+-d\d+$/, '');
    return <WorkoutBuilder id={workoutId} programId={linkedProgramId} dark={dark} onSaved={setWorkout} />;
  }

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <View style={styles.closeButton}>
        <TouchableOpacity style={styles.closeButtonContent} onPress={returnToRoutine}>
          <Text style={styles.closeText}>←</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 48 }}>🚧</Text>
        <Text style={[styles.heroTitle, { color: dark ? '#fff' : '#111', textAlign: 'center', marginTop: 16 }]}>
          Coming Soon!
        </Text>
      </View>
    </View>
  );
}

  if (editing && isAdmin) {
    return (
      <WorkoutBuilder
        id={id as string}
        programId={programId as string}
        dark={dark}
        initial={workout}
        onSaved={(saved) => {
          setWorkout(saved);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{workout.title.toUpperCase()}</Text>
          <Text style={styles.heroSubtitle}>{workout.subtitle}</Text>
        </View>
      </View>

      {/* Back Button */}
      <View style={styles.closeButton}>
        <TouchableOpacity style={styles.closeButtonContent} onPress={returnToRoutine}>
          <Text style={styles.closeText}>←</Text>
        </TouchableOpacity>
      </View>

      {isAdmin && (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}

      {/* Exercise List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {workout.sections.map((section: any) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, dark && styles.darkText]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionSets, dark && styles.darkSubText]}>
              {section.sets}
            </Text>
            {section.exercises.map((exercise: any, index: number) => (
              <ExerciseCard key={index} exercise={exercise} dark={dark} />
            ))}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push(`/workout-session/${encodeURIComponent(id as string)}?programId=${encodeURIComponent(linkedProgramId)}&session=${Date.now()}` as any)}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  hero: {
    width: '100%',
    height: 160,
    backgroundColor: '#333',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
  },
  editButton: {
    position: 'absolute',
    top: 56,
    right: 16,
    zIndex: 100,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  editButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  heroOverlay: {
    padding: 20,
    paddingLeft: 70,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    letterSpacing: 1,
  },
  sectionSets: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'column',
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  exerciseReps: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  startButton: {
    backgroundColor: '#ff0000',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playIcon: {
    color: '#fff',
    fontSize: 16,
  },
  expandIcon: {
    fontSize: 12,
    color: '#888',
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 8,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const builderStyles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  backButton: { alignSelf: 'flex-start', marginBottom: 12, paddingVertical: 8 },
  backButtonText: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
  heading: { color: '#111', fontSize: 28, fontWeight: 'bold', marginBottom: 18 },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    color: '#111',
    fontSize: 15,
    marginBottom: 10,
    padding: 12,
  },
  darkInput: { backgroundColor: '#1e1e1e', borderColor: '#444', color: '#fff' },
  section: { backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 16, padding: 14 },
  darkSection: { backgroundColor: '#1e1e1e' },
  sectionHeading: { color: '#111', fontSize: 17, fontWeight: '600', marginBottom: 10 },
  exerciseHeading: { color: '#111', fontSize: 14, fontWeight: '600', marginBottom: 10 },
  rowBetween: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  deleteText: { color: '#ff3b30', fontSize: 13, fontWeight: '600' },
  exercise: { borderTopColor: '#ccc', borderTopWidth: 1, marginTop: 6, paddingTop: 12 },
  secondaryButton: { alignItems: 'center', borderColor: '#007AFF', borderRadius: 9, borderWidth: 1, marginBottom: 14, padding: 11 },
  secondaryButtonText: { color: '#007AFF', fontWeight: '600' },
  error: { color: '#ff3b30', marginBottom: 12 },
  saveButton: { alignItems: 'center', backgroundColor: '#007AFF', borderRadius: 12, padding: 17 },
  disabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/context/ThemeContext';
import { fetchWorkout } from '@/services/api';
import { setWorkoutCompleted } from '@/services/workoutProgress';

type SessionExercise = {
  name: string;
  reps: string;
  videoUrl: string;
  sectionTitle: string;
};

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
  if (url.includes('v=')) return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`;
  if (url.includes('/embed/')) return url;
  return null;
};

export default function WorkoutSessionScreen() {
  const { id, programId, session } = useLocalSearchParams();
  const router = useRouter();
  const { darkMode: dark } = useTheme();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      setLoading(true);
      setWorkout(await fetchWorkout(id as string));
      setLoading(false);
    };
    loadWorkout();
  }, [id]);

  useEffect(() => {
    setExerciseIndex(0);
    setFinished(false);
    setShowVideo(false);
  }, [id, session]);

  const exercises = useMemo<SessionExercise[]>(
    () =>
      (workout?.sections ?? []).flatMap((section: any) =>
        (section.exercises ?? []).map((exercise: any) => ({ ...exercise, sectionTitle: section.title }))
      ),
    [workout]
  );
  const exercise = exercises[exerciseIndex];
  const videoEmbedUrl = getYouTubeEmbedUrl(exercise?.videoUrl ?? '');
  const returnToRoutine = () =>
    router.push(
      `/program/${encodeURIComponent(programId as string)}?tab=workouts${finished ? `&completedWorkoutId=${encodeURIComponent(id as string)}` : ''}` as any
    );

  if (loading) {
    return (
      <View style={[styles.container, dark && styles.darkContainer, styles.centered]}>
        <Text style={[styles.title, dark && styles.darkText]}>Starting workout...</Text>
      </View>
    );
  }

  if (!workout || exercises.length === 0) {
    return (
      <View style={[styles.container, dark && styles.darkContainer, styles.centered]}>
        <Text style={[styles.title, dark && styles.darkText]}>This workout has no exercises yet.</Text>
        <TouchableOpacity style={styles.standaloneButton} onPress={returnToRoutine}>
          <Text style={styles.primaryButtonText}>Back to Routine</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={[styles.container, dark && styles.darkContainer, styles.centered]}>
        <Text style={styles.success}>Workout complete!</Text>
        <Text style={[styles.subtitle, dark && styles.darkSubText]}>Nice work finishing {workout.title}.</Text>
        <TouchableOpacity style={styles.standaloneButton} onPress={returnToRoutine}>
          <Text style={styles.primaryButtonText}>Back to Routine</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, dark && styles.darkContainer]}>
      <TouchableOpacity onPress={returnToRoutine}>
        <Text style={styles.back}>Back to Routine</Text>
      </TouchableOpacity>
      <Text style={[styles.overline, dark && styles.darkSubText]}>WORKOUT IN PROGRESS</Text>
      <Text style={[styles.title, dark && styles.darkText]}>{workout.title}</Text>
      <Text style={[styles.progress, dark && styles.darkSubText]}>
        {exercises.length} exercise{exercises.length === 1 ? '' : 's'} in this workout
      </Text>
      <View style={[styles.card, dark && styles.darkCard]}>
        <Text style={styles.sectionName}>{exercise.sectionTitle}</Text>
        <Text style={[styles.exerciseName, dark && styles.darkText]}>{exercise.name}</Text>
        <Text style={[styles.reps, dark && styles.darkSubText]}>{exercise.reps || 'Complete as prescribed'}</Text>
        {videoEmbedUrl ? (
          <>
            <TouchableOpacity style={styles.videoButton} onPress={() => setShowVideo((current) => !current)}>
              <Text style={styles.videoButtonText}>{showVideo ? 'Hide exercise video' : 'Watch exercise video'}</Text>
            </TouchableOpacity>
            {showVideo && Platform.OS === 'web' && (
              <View style={styles.videoFrame}>
                <iframe width="100%" height="220" src={videoEmbedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ border: 'none' }} />
              </View>
            )}
            {showVideo && Platform.OS !== 'web' && <WebView style={styles.videoFrame} source={{ uri: videoEmbedUrl }} allowsFullscreenVideo />}
          </>
        ) : exercise.videoUrl ? (
          <Text style={[styles.videoUnavailable, dark && styles.darkSubText]}>This video link cannot be embedded.</Text>
        ) : null}
      </View>
      <Text style={[styles.allExercisesHeading, dark && styles.darkText]}>All exercises</Text>
      {exercises.map((item, index) => (
        <TouchableOpacity
          key={`${item.sectionTitle}-${item.name}-${index}`}
          style={[styles.exerciseListItem, dark && styles.darkCard, index === exerciseIndex && styles.activeExercise]}
          onPress={() => {
            setExerciseIndex(index);
            setShowVideo(false);
          }}>
          <View>
            <Text style={styles.sectionName}>{item.sectionTitle}</Text>
            <Text style={[styles.exerciseListName, dark && styles.darkText]}>{item.name}</Text>
          </View>
          <Text style={[styles.exerciseListReps, dark && styles.darkSubText]}>{item.reps}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.completeWorkoutButton}
        onPress={async () => {
          await setWorkoutCompleted(id as string, true);
          setFinished(true);
        }}>
        <Text style={styles.primaryButtonText}>Complete Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { backgroundColor: '#f9f9f9', flexGrow: 1, maxWidth: 600, padding: 20, width: '100%', alignSelf: 'center' },
  darkContainer: { backgroundColor: '#121212' },
  centered: { alignItems: 'center', justifyContent: 'center' },
  darkText: { color: '#fff' },
  darkSubText: { color: '#aaa' },
  back: { color: '#007AFF', fontSize: 15, fontWeight: '600', marginBottom: 28 },
  overline: { color: '#777', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  title: { color: '#111', fontSize: 30, fontWeight: 'bold', marginTop: 8 },
  subtitle: { color: '#666', fontSize: 16, marginTop: 12, textAlign: 'center' },
  progress: { color: '#666', fontSize: 15, marginTop: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginTop: 28, padding: 24 },
  darkCard: { backgroundColor: '#1e1e1e' },
  sectionName: { color: '#007AFF', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  exerciseName: { color: '#111', fontSize: 26, fontWeight: 'bold', marginTop: 12 },
  reps: { color: '#666', fontSize: 18, marginTop: 8 },
  videoButton: { alignSelf: 'flex-start', backgroundColor: '#007AFF', borderRadius: 8, marginTop: 20, paddingHorizontal: 12, paddingVertical: 9 },
  videoButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  videoFrame: { height: 220, marginTop: 12, width: '100%' },
  videoUnavailable: { color: '#888', fontSize: 13, marginTop: 16 },
  allExercisesHeading: { color: '#111', fontSize: 20, fontWeight: 'bold', marginTop: 28 },
  exerciseListItem: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, padding: 14 },
  activeExercise: { borderColor: '#007AFF', borderWidth: 2 },
  exerciseListName: { color: '#111', fontSize: 16, fontWeight: '600', marginTop: 3 },
  exerciseListReps: { color: '#666', fontSize: 14, marginLeft: 12 },
  primaryButton: { alignItems: 'center', backgroundColor: '#007AFF', borderRadius: 12, flex: 1, marginTop: 24, padding: 16 },
  standaloneButton: { alignItems: 'center', backgroundColor: '#007AFF', borderRadius: 12, marginTop: 24, padding: 16, width: 220 },
  completeWorkoutButton: { alignItems: 'center', backgroundColor: '#007AFF', borderRadius: 12, marginTop: 28, padding: 16 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { alignItems: 'center', borderColor: '#007AFF', borderRadius: 12, borderWidth: 1, flex: 1, marginTop: 24, padding: 16 },
  secondaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.4 },
  success: { color: '#34c759', fontSize: 30, fontWeight: 'bold' },
});

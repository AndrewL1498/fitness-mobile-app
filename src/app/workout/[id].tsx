import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const WORKOUTS: Record<string, any> = {
  'Workout 1': {
    title: 'Workout 1',
    subtitle: 'Concentrate on your technique and avoid rushing. Take it slow and maintain control.',
    sections: [
      {
        title: 'WARM UP',
        sets: '1 set',
        exercises: [
          { name: 'Arm Circles - Forward', reps: '8 reps' },
          { name: 'Arm Circles - Backwards', reps: '8 reps' },
          { name: 'Standing Alternating Over-Under', reps: '8 reps' },
          { name: 'External - Internal Rotation', reps: '8 reps' },
        ],
      },
      {
        title: 'MAIN WORK',
        sets: '3 sets',
        exercises: [
          { name: 'Push Ups', reps: '10 reps' },
          { name: 'Pull Ups', reps: '5 reps' },
          { name: 'Plank Hold', reps: '30 seconds' },
          { name: 'Hollow Body Hold', reps: '20 seconds' },
        ],
      },
    ],
  },
  'Workout 2': {
    title: 'Workout 2',
    subtitle: 'Focus on full range of motion. Quality over quantity.',
    sections: [
      {
        title: 'WARM UP',
        sets: '1 set',
        exercises: [
          { name: 'Jumping Jacks', reps: '20 reps' },
          { name: 'Hip Circles', reps: '10 reps each side' },
          { name: 'Leg Swings', reps: '10 reps each side' },
        ],
      },
      {
        title: 'MAIN WORK',
        sets: '3 sets',
        exercises: [
          { name: 'Dips', reps: '8 reps' },
          { name: 'Australian Pull Ups', reps: '10 reps' },
          { name: 'L-Sit Hold', reps: '15 seconds' },
          { name: 'Arch Body Hold', reps: '20 seconds' },
        ],
      },
    ],
  },
  'Workout 3': {
    title: 'Workout 3',
    subtitle: 'Push through the last session of the week. Stay consistent.',
    sections: [
      {
        title: 'WARM UP',
        sets: '1 set',
        exercises: [
          { name: 'Shoulder Rolls', reps: '10 reps' },
          { name: 'Wrist Circles', reps: '10 reps' },
          { name: 'Cat-Cow Stretch', reps: '8 reps' },
        ],
      },
      {
        title: 'MAIN WORK',
        sets: '3 sets',
        exercises: [
          { name: 'Pike Push Ups', reps: '8 reps' },
          { name: 'Chin Ups', reps: '5 reps' },
          { name: 'Side Plank', reps: '20 seconds each side' },
          { name: 'Tuck Hold', reps: '15 seconds' },
        ],
      },
    ],
  },
};

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const { darkMode: dark } = useTheme();
  const router = useRouter();

  const workout = WORKOUTS[id as string] ?? WORKOUTS['Workout 1'];

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      {/* Hero */}
      <View style={styles.hero}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{workout.title.toUpperCase()}</Text>
          <Text style={styles.heroSubtitle}>{workout.subtitle}</Text>
        </View>
      </View>

      {/* Exercise List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {workout.sections.map((section: any) => (
          <View key={section.title} style={styles.section}>
            {/* Section Header */}
            <Text style={[styles.sectionTitle, dark && styles.darkText]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionSets, dark && styles.darkSubText]}>
              {section.sets}
            </Text>

            {/* Exercise Cards */}
            {section.exercises.map((exercise: any, index: number) => (
              <View key={index} style={[styles.exerciseCard, dark && styles.darkCard]}>
                <View style={styles.exerciseImage} />
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, dark && styles.darkText]}>
                    {exercise.name}
                  </Text>
                  <Text style={[styles.exerciseReps, dark && styles.darkSubText]}>
                    {exercise.reps}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton}>
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
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  hero: {
    width: '100%',
    height: 280,
    backgroundColor: '#333',
    justifyContent: 'flex-end',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
  },
  heroOverlay: {
    padding: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
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
    backgroundColor: '#111',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
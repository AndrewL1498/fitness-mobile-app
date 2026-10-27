import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { fetchWorkout } from '@/services/api';



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

export default function WorkoutDetailScreen() {
  const { darkMode: dark, isAdmin } = useTheme();
  const { id, programId } = useLocalSearchParams();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
  
  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <Link href={`/program/${programId ?? 'Beginner'}`} asChild>
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeText}>←</Text>
        </TouchableOpacity>
      </Link>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 48 }}>🚧</Text>
        <Text style={[styles.heroTitle, { color: dark ? '#fff' : '#111', textAlign: 'center', marginTop: 16 }]}>
          Coming Soon!
        </Text>
        {isAdmin && (
          <TouchableOpacity
            style={[styles.startButton, { marginTop: 24 }]}
            onPress={() => router.push(`/admin` as any)}>
            <Text style={styles.startButtonText}>Build This Workout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
      <Link href={`/program/${programId ?? 'Beginner'}`} asChild>
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeText}>←</Text>
        </TouchableOpacity>
      </Link>

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
    backgroundColor: '#f9f9f9',
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
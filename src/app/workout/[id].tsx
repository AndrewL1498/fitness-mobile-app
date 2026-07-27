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
import { useState } from 'react';
import { WebView } from 'react-native-webview';

const WORKOUTS: Record<string, any> = {
  'Workout 1': {
    title: 'Workout 1',
    subtitle: 'Concentrate on your technique and avoid rushing. Take it slow and maintain control.',
    sections: [
      {
        title: 'WARM UP',
        sets: '1 set',
        exercises: [
          { name: 'Arm Circles - Forward', reps: '8 reps', videoUrl: 'https://youtu.be/iDL5-tQyFQQ' },
          { name: 'Arm Circles - Backwards', reps: '8 reps', videoUrl: 'https://www.youtube.com/watch?v=wqKLKRAFMO4' },
          { name: 'Standing Alternating Over-Under', reps: '8 reps', videoUrl: 'https://www.youtube.com/watch?v=wqKLKRAFMO4' },
          { name: 'External - Internal Rotation', reps: '8 reps', videoUrl: 'https://www.youtube.com/watch?v=wqKLKRAFMO4' },
        ],
      },
      {
        title: 'MAIN WORK',
        sets: '3 sets',
        exercises: [
          { name: 'Push Ups', reps: '10 reps', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
          { name: 'Pull Ups', reps: '5 reps', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
          { name: 'Plank Hold', reps: '30 seconds', videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
          { name: 'Hollow Body Hold', reps: '20 seconds', videoUrl: 'https://www.youtube.com/watch?v=LlDNef_Ztsc' },
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
          { name: 'Jumping Jacks', reps: '20 reps', videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8' },
          { name: 'Hip Circles', reps: '10 reps each side', videoUrl: 'https://www.youtube.com/watch?v=wqKLKRAFMO4' },
          { name: 'Leg Swings', reps: '10 reps each side', videoUrl: 'https://www.youtube.com/watch?v=wqKLKRAFMO4' },
        ],
      },
      {
        title: 'MAIN WORK',
        sets: '3 sets',
        exercises: [
          { name: 'Dips', reps: '8 reps', videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
          { name: 'Australian Pull Ups', reps: '10 reps', videoUrl: 'https://www.youtube.com/watch?v=PGcTxvw6iAQ' },
          { name: 'L-Sit Hold', reps: '15 seconds', videoUrl: 'https://www.youtube.com/watch?v=IUZJoSP66HI' },
          { name: 'Arch Body Hold', reps: '20 seconds', videoUrl: 'https://www.youtube.com/watch?v=LlDNef_Ztsc' },
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
          { name: 'Shoulder Rolls', reps: '10 reps', videoUrl: 'https://www.youtube.com/watch?v=wqKLKRAFMO4' },
          { name: 'Wrist Circles', reps: '10 reps', videoUrl: 'https://www.youtube.com/watch?v=wqKLKRAFMO4' },
          { name: 'Cat-Cow Stretch', reps: '8 reps', videoUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA' },
        ],
      },
      {
        title: 'MAIN WORK',
        sets: '3 sets',
        exercises: [
          { name: 'Pike Push Ups', reps: '8 reps', videoUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A' },
          { name: 'Chin Ups', reps: '5 reps', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
          { name: 'Side Plank', reps: '20 seconds each side', videoUrl: 'https://www.youtube.com/watch?v=K2EUqoMjmYg' },
          { name: 'Tuck Hold', reps: '15 seconds', videoUrl: 'https://www.youtube.com/watch?v=LlDNef_Ztsc' },
        ],
      },
    ],
  },
};

function ExerciseCard({ exercise, dark }: { exercise: any; dark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  
  // Handle both youtube.com/watch?v= and youtu.be/ formats
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
  const { darkMode: dark } = useTheme();
  const router = useRouter();
  const { id, programId } = useLocalSearchParams();

  const workout = WORKOUTS[id as string] ?? WORKOUTS['Workout 1'];

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
    height: 280,
    backgroundColor: '#333',
    justifyContent: 'flex-end',
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
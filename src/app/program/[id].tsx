import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const PROGRAMS: Record<string, any> = {
  'start-here-intro': {
    title: 'Intro to Training',
    image: null,
    description: 'Welcome! This is your starting point. Learn the fundamentals of calisthenics training and set yourself up for success.',
    duration: '1 week',
    frequency: '3x per week',
    time: '30-45 minutes',
    weeks: Array.from({ length: 1 }, (_, i) => ({
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
    })),
  },
  'start-here-how-to': {
    title: 'How to Use the App',
    image: null,
    description: 'Learn how to navigate the app, track your workouts, and get the most out of your training experience.',
    duration: '1 week',
    frequency: 'As needed',
    time: '15-20 minutes',
    weeks: Array.from({ length: 1 }, (_, i) => ({
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
    })),
  },
  'start-here-goals': {
    title: 'Set Your Goals',
    image: null,
    description: 'Define your fitness goals and create a personalized roadmap to achieve them.',
    duration: '1 week',
    frequency: 'As needed',
    time: '15-20 minutes',
    weeks: Array.from({ length: 1 }, (_, i) => ({
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
    })),
  },
  'build-strength-beginner': {
    title: 'Build Strength - Beginner',
    image: null,
    description: 'Start building your foundation of strength. This program requires 0 pull ups and 0 push ups to begin.',
    duration: '8 weeks',
    frequency: '3x per week',
    time: '45-60 minutes',
    weeks: Array.from({ length: 8 }, (_, i) => ({
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
    })),
  },
  'build-strength-intermediate': {
    title: 'Build Strength - Intermediate',
    image: null,
    description: 'Take your strength to the next level. Requires at least 5 pull ups and 20 push ups.',
    duration: '10 weeks',
    frequency: '3-4x per week',
    time: '60 minutes',
    weeks: Array.from({ length: 10 }, (_, i) => ({
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
    })),
  },
  'build-strength-advanced': {
    title: 'Build Strength - Advanced',
    image: null,
    description: 'Elite strength training for experienced athletes. Requires 15+ pull ups and 40+ push ups.',
    duration: '12 weeks',
    frequency: '4-5x per week',
    time: '60-90 minutes',
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      days: [
        { day: 1, title: `Workout ${i * 4 + 1}`, isRest: false },
        { day: 2, title: `Workout ${i * 4 + 2}`, isRest: false },
        { day: 3, title: 'Rest Day', isRest: true },
        { day: 4, title: `Workout ${i * 4 + 3}`, isRest: false },
        { day: 5, title: `Workout ${i * 4 + 4}`, isRest: false },
        { day: 6, title: 'Rest Day', isRest: true },
        { day: 7, title: 'Rest Day', isRest: true },
      ],
    })),
  },
  'muscle-up-beginner': {
    title: 'Muscle Up - Beginner',
    image: null,
    description: 'Start your muscle up journey. Build the pulling and pushing strength needed for your first muscle up.',
    duration: '8 weeks',
    frequency: '3x per week',
    time: '45-60 minutes',
    weeks: Array.from({ length: 8 }, (_, i) => ({
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
    })),
  },
  'muscle-up-intermediate': {
    title: 'Muscle Up - Intermediate',
    image: null,
    description: 'You can do a muscle up but want to make it cleaner and stronger. This program refines your technique.',
    duration: '10 weeks',
    frequency: '3-4x per week',
    time: '60 minutes',
    weeks: Array.from({ length: 10 }, (_, i) => ({
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
    })),
  },
  'muscle-up-advanced': {
    title: 'Muscle Up - Advanced',
    image: null,
    description: 'Master weighted muscle ups, ring muscle ups, and explosive variations.',
    duration: '12 weeks',
    frequency: '4x per week',
    time: '60-90 minutes',
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      days: [
        { day: 1, title: `Workout ${i * 4 + 1}`, isRest: false },
        { day: 2, title: `Workout ${i * 4 + 2}`, isRest: false },
        { day: 3, title: 'Rest Day', isRest: true },
        { day: 4, title: `Workout ${i * 4 + 3}`, isRest: false },
        { day: 5, title: `Workout ${i * 4 + 4}`, isRest: false },
        { day: 6, title: 'Rest Day', isRest: true },
        { day: 7, title: 'Rest Day', isRest: true },
      ],
    })),
  },
  'handstand-beginner': {
    title: 'Handstand - Beginner',
    image: null,
    description: 'Learn to hold a wall handstand and build the wrist, shoulder, and core strength needed for freestanding balance.',
    duration: '8 weeks',
    frequency: '3x per week',
    time: '30-45 minutes',
    weeks: Array.from({ length: 8 }, (_, i) => ({
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
    })),
  },
  'handstand-intermediate': {
    title: 'Handstand - Intermediate',
    image: null,
    description: 'Work towards a freestanding handstand. You should be comfortable holding a wall handstand for 30+ seconds.',
    duration: '10 weeks',
    frequency: '4x per week',
    time: '45-60 minutes',
    weeks: Array.from({ length: 10 }, (_, i) => ({
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
    })),
  },
  'handstand-advanced': {
    title: 'Handstand - Advanced',
    image: null,
    description: 'Master handstand push ups, one arm handstand progressions, and handstand walking.',
    duration: '12 weeks',
    frequency: '4-5x per week',
    time: '60 minutes',
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      days: [
        { day: 1, title: `Workout ${i * 4 + 1}`, isRest: false },
        { day: 2, title: `Workout ${i * 4 + 2}`, isRest: false },
        { day: 3, title: 'Rest Day', isRest: true },
        { day: 4, title: `Workout ${i * 4 + 3}`, isRest: false },
        { day: 5, title: `Workout ${i * 4 + 4}`, isRest: false },
        { day: 6, title: 'Rest Day', isRest: true },
        { day: 7, title: 'Rest Day', isRest: true },
      ],
    })),
  },
  'front-lever-beginner': {
    title: 'Front Lever - Beginner',
    image: null,
    description: 'Build the foundation for the front lever. Start with tuck progressions and core strength work.',
    duration: '8 weeks',
    frequency: '3x per week',
    time: '45-60 minutes',
    weeks: Array.from({ length: 8 }, (_, i) => ({
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
    })),
  },
  'front-lever-intermediate': {
    title: 'Front Lever - Intermediate',
    image: null,
    description: 'Progress from tuck to advanced tuck front lever. Build the lat and core strength for a full front lever.',
    duration: '10 weeks',
    frequency: '3-4x per week',
    time: '60 minutes',
    weeks: Array.from({ length: 10 }, (_, i) => ({
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
    })),
  },
  'front-lever-advanced': {
    title: 'Front Lever - Advanced',
    image: null,
    description: 'Achieve and hold a full front lever. Master front lever pulls and advanced variations.',
    duration: '12 weeks',
    frequency: '4x per week',
    time: '60-90 minutes',
    weeks: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      days: [
        { day: 1, title: `Workout ${i * 4 + 1}`, isRest: false },
        { day: 2, title: `Workout ${i * 4 + 2}`, isRest: false },
        { day: 3, title: 'Rest Day', isRest: true },
        { day: 4, title: `Workout ${i * 4 + 3}`, isRest: false },
        { day: 5, title: `Workout ${i * 4 + 4}`, isRest: false },
        { day: 6, title: 'Rest Day', isRest: true },
        { day: 7, title: 'Rest Day', isRest: true },
      ],
    })),
  },
  'mobility-hip': {
    title: 'Hip Mobility',
    image: null,
    description: 'Improve your hip flexibility and range of motion. Great for athletes who sit a lot or feel tight in their hips.',
    duration: '4 weeks',
    frequency: '3x per week',
    time: '20-30 minutes',
    weeks: Array.from({ length: 4 }, (_, i) => ({
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
    })),
  },
  'mobility-shoulder': {
    title: 'Shoulder Mobility',
    image: null,
    description: 'Unlock your shoulder flexibility and reduce pain. Essential for handstands, muscle ups, and overhead work.',
    duration: '4 weeks',
    frequency: '3x per week',
    time: '20-30 minutes',
    weeks: Array.from({ length: 4 }, (_, i) => ({
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
    })),
  },
  'mobility-full-body': {
    title: 'Full Body Flow',
    image: null,
    description: 'A complete mobility routine covering all major joints. Perfect as a daily practice or active recovery.',
    duration: '4 weeks',
    frequency: '4x per week',
    time: '30-45 minutes',
    weeks: Array.from({ length: 4 }, (_, i) => ({
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
    })),
  },
};

export default function ProgramScreen() {
  const { id } = useLocalSearchParams();
  const { darkMode: dark } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Workouts'>('Overview');

const program = PROGRAMS[id as string];

if (!program) {
  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      <View style={[styles.header, dark && styles.darkHeader]}>
        <Link href="/explore" asChild>
          <TouchableOpacity>
            <Text style={[styles.backArrow, dark && styles.darkText]}>←</Text>
          </TouchableOpacity>
        </Link>
        <Text style={[styles.headerTitle, dark && styles.darkText]}>Coming Soon</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 48 }}>🚧</Text>
        <Text style={[styles.headerTitle, dark && styles.darkText, { marginTop: 16 }]}>
          This program is coming soon!
        </Text>
      </View>
    </View>
  );
}

  return (
    <View style={[styles.container, dark && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, dark && styles.darkHeader]}>
<Link href="/explore" asChild>
  <TouchableOpacity>
    <Text style={[styles.backArrow, dark && styles.darkText]}>←</Text>
  </TouchableOpacity>
</Link>
        <Text style={[styles.headerTitle, dark && styles.darkText]}>
          {program.title.toUpperCase()}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, dark && styles.darkTabBar]}>
        {(['Overview', 'Workouts'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, dark && styles.darkText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Overview' ? (
          <View style={styles.overviewContent}>
            {/* Hero Image Placeholder */}
            {/* Hero Image Placeholder */}
<View style={styles.heroImage}>
  <Text style={styles.heroImageText}>📸</Text>
  <Text style={styles.heroImageLabel}>{program.title}</Text>
</View>

            {/* Description */}
            <View style={[styles.card, dark && styles.darkCard]}>
              <Text style={[styles.cardLabel, dark && styles.darkText]}>Description</Text>
              <Text style={[styles.cardText, dark && styles.darkSubText]}>{program.description}</Text>
            </View>

            {/* Duration */}
            <View style={[styles.card, dark && styles.darkCard]}>
              <Text style={[styles.cardLabel, dark && styles.darkText]}>
                Duration: <Text style={styles.cardValue}>{program.duration}</Text>
              </Text>
            </View>

            {/* Frequency */}
            <View style={[styles.card, dark && styles.darkCard]}>
              <Text style={[styles.cardLabel, dark && styles.darkText]}>Frequency</Text>
              <Text style={[styles.cardText, dark && styles.darkSubText]}>{program.frequency}</Text>
              <Text style={[styles.cardText, dark && styles.darkSubText]}>{program.time}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.workoutsContent}>
            {program.weeks.map((weekData: any) => (
              <View key={weekData.week}>
                <Text style={[styles.weekTitle, dark && styles.darkText]}>
                  WEEK {weekData.week}
                </Text>
                {weekData.days.map((day: any) => (
                  <TouchableOpacity
                    key={day.day}
                    style={[styles.dayCard, dark && styles.darkCard]}
                    onPress={() =>
                      !day.isRest &&
                      router.push(`/workout/${encodeURIComponent(id + '-' + day.title.toLowerCase().replace(' ', '-'))}?programId=${encodeURIComponent(id as string)}` as any)
                    }>
                    <View>
                      <Text style={[styles.dayLabel, dark && styles.darkSubText]}>
                        Day {day.day}
                      </Text>
                      <Text style={[styles.dayTitle, dark && styles.darkText]}>
                        {day.title.toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>
            {activeTab === 'Overview' ? 'Start Program' : 'Continue Program'}
          </Text>
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
  darkContainer: { backgroundColor: '#121212' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#f2f2f2',
  },
  darkHeader: { backgroundColor: '#121212' },
  backArrow: { fontSize: 24, color: '#111' },
  darkText: { color: '#fff' },
  darkSubText: { color: '#aaa' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f2f2f2',
  },
darkTabBar: { backgroundColor: '#121212', borderBottomColor: '#444' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 15, color: '#999' },
  activeTabText: { color: '#007AFF', fontWeight: '700' },
  content: { flex: 1 },
  overviewContent: { padding: 16, gap: 12 },
 heroImage: {
  width: '100%',
  height: 220,
  backgroundColor: '#ccc',
  borderRadius: 12,
  marginBottom: 4,
  alignItems: 'center',
  justifyContent: 'center',
},
heroImageText: {
  fontSize: 48,
  marginBottom: 8,
},
heroImageLabel: {
  fontSize: 16,
  fontWeight: '600',
  color: '#555',
},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  darkCard: { backgroundColor: '#1e1e1e' },
  cardLabel: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  cardValue: { fontWeight: 'normal' },
  cardText: { fontSize: 15, color: '#555' },
  workoutsContent: { padding: 16 },
  weekTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },
  dayCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
  },
  dayLabel: { fontSize: 13, color: '#aaa', marginBottom: 4 },
  dayTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  footer: { padding: 16, paddingBottom: 32 },
  startButton: {
    backgroundColor: '#111',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
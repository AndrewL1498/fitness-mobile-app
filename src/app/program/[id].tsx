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
  'Beginner': {
    title: 'Beginner I',
    description: 'This is the starting point of your fitness journey. Build your foundation of strength and mobility before progressing to more advanced skills.',
    duration: '8 weeks',
    frequency: '3x per week',
    time: '45-60 minutes',
    weeks: [
      {
        week: 1,
        days: [
          { day: 1, title: 'Workout 1', isRest: false },
          { day: 2, title: 'Rest Day', isRest: true },
          { day: 3, title: 'Workout 2', isRest: false },
          { day: 4, title: 'Rest Day', isRest: true },
          { day: 5, title: 'Workout 3', isRest: false },
          { day: 6, title: 'Rest Day', isRest: true },
          { day: 7, title: 'Rest Day', isRest: true },
        ],
      },
      {
        week: 2,
        days: [
          { day: 1, title: 'Workout 4', isRest: false },
          { day: 2, title: 'Rest Day', isRest: true },
          { day: 3, title: 'Workout 5', isRest: false },
          { day: 4, title: 'Rest Day', isRest: true },
          { day: 5, title: 'Workout 6', isRest: false },
          { day: 6, title: 'Rest Day', isRest: true },
          { day: 7, title: 'Rest Day', isRest: true },
        ],
      },
    ],
  },
  'Intermediate': {
    title: 'Intermediate I',
    description: 'Take your training to the next level. This program builds on your foundation and introduces more challenging movements.',
    duration: '10 weeks',
    frequency: '3-4x per week',
    time: '60 minutes',
    weeks: [
      {
        week: 1,
        days: [
          { day: 1, title: 'Workout 1', isRest: false },
          { day: 2, title: 'Rest Day', isRest: true },
          { day: 3, title: 'Workout 2', isRest: false },
          { day: 4, title: 'Rest Day', isRest: true },
          { day: 5, title: 'Workout 3', isRest: false },
          { day: 6, title: 'Rest Day', isRest: true },
          { day: 7, title: 'Rest Day', isRest: true },
        ],
      },
    ],
  },
  'Advanced': {
    title: 'Advanced I',
    description: 'For experienced athletes ready to push their limits with high intensity training and complex skill work.',
    duration: '12 weeks',
    frequency: '4-5x per week',
    time: '60-90 minutes',
    weeks: [
      {
        week: 1,
        days: [
          { day: 1, title: 'Workout 1', isRest: false },
          { day: 2, title: 'Workout 2', isRest: false },
          { day: 3, title: 'Rest Day', isRest: true },
          { day: 4, title: 'Workout 3', isRest: false },
          { day: 5, title: 'Workout 4', isRest: false },
          { day: 6, title: 'Rest Day', isRest: true },
          { day: 7, title: 'Rest Day', isRest: true },
        ],
      },
    ],
  },
};

export default function ProgramScreen() {
  const { id } = useLocalSearchParams();
  const { darkMode: dark } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Workouts'>('Overview');

  const program = PROGRAMS[id as string] ?? PROGRAMS['Beginner'];

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
            <View style={styles.heroImage} />

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
                      router.push(`/workout/${encodeURIComponent(day.title)}?programId=${encodeURIComponent(id as string)}` as any)
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
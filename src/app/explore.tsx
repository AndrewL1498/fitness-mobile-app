import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width * 0.6, 280);

const FILTERS = ['Skills', 'Mobility', 'Cardio', 'Strength', 'Muscle Growth'];

const SECTIONS = [
  { title: 'Start Here', category: 'Skills', data: [
    { label: 'Intro to Training', id: 'start-here-intro' },
    { label: 'How to Use the App', id: 'start-here-how-to' },
    { label: 'Set Your Goals', id: 'start-here-goals' },
  ]},
  { title: 'Build Strength', category: 'Strength', data: [
    { label: 'Beginner', id: 'build-strength-beginner' },
    { label: 'Intermediate', id: 'build-strength-intermediate' },
    { label: 'Advanced', id: 'build-strength-advanced' },
  ]},
  { title: 'Muscle Up', category: 'Skills', data: [
    { label: 'Beginner', id: 'muscle-up-beginner' },
    { label: 'Intermediate', id: 'muscle-up-intermediate' },
    { label: 'Advanced', id: 'muscle-up-advanced' },
  ]},
  { title: 'Handstand', category: 'Skills', data: [
    { label: 'Beginner', id: 'handstand-beginner' },
    { label: 'Intermediate', id: 'handstand-intermediate' },
    { label: 'Advanced', id: 'handstand-advanced' },
  ]},
  { title: 'Front Lever', category: 'Skills', data: [
    { label: 'Beginner', id: 'front-lever-beginner' },
    { label: 'Intermediate', id: 'front-lever-intermediate' },
    { label: 'Advanced', id: 'front-lever-advanced' },
  ]},
  { title: 'Mobility', category: 'Mobility', data: [
    { label: 'Hip Mobility', id: 'mobility-hip' },
    { label: 'Shoulder Mobility', id: 'mobility-shoulder' },
    { label: 'Full Body Flow', id: 'mobility-full-body' },
  ]},
];

function WorkoutCard({ label, id, dark }: { label: string; id: string; dark: boolean }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, dark && styles.darkCard]}
      onPress={() => router.push(`/program/${encodeURIComponent(id)}` as any)}>
      <View style={[styles.cardImagePlaceholder, dark && styles.darkCardImagePlaceholder]} />
      <Text style={[styles.cardTitle, dark && styles.darkText]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Section({ title, data, dark }: { title: string; data: { label: string; id: string }[]; dark: boolean }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, dark && styles.darkText]}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
renderItem={({ item }) => <WorkoutCard label={item.label} id={item.id} dark={dark} />}
      />
    </View>
  );
}

function SearchResultCard({ label, id, sectionTitle, dark }: { label: string; id: string; sectionTitle: string; dark: boolean }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.searchResultCard, dark && styles.darkCard]}
      onPress={() => router.push(`/program/${encodeURIComponent(id)}` as any)}>
      <View style={[styles.searchResultImage, dark && styles.darkCardImagePlaceholder]} />
      <View style={styles.searchResultInfo}>
        <Text style={[styles.searchResultTitle, dark && styles.darkText]}>{label}</Text>
        <Text style={[styles.searchResultSubtitle, dark && styles.darkSubText]}>{sectionTitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState('Skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { darkMode: dark } = useTheme();

  const filteredSections = SECTIONS.filter(
    (section) => section.category === activeFilter
  );

  const searchResults = SECTIONS.flatMap((section) =>
    section.data
      .filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
.map((item) => ({ label: item.label, id: item.id, sectionTitle: section.title }))
  );

  const isSearching = searchOpen && searchQuery.length > 0;

  return (
    <ScrollView
      style={[styles.container, dark && styles.darkContainer]}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        {searchOpen ? (
          <>
            <TextInput
              style={[styles.searchInput, dark && styles.darkSearchInput]}
              placeholder="Search workouts, categories..."
              placeholderTextColor={dark ? '#888' : '#aaa'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}>
              <Text style={[styles.searchIcon, dark && styles.darkText]}>✕</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={{ width: 30 }} />
            <Text style={[styles.heading, dark && styles.darkText]}>EXPLORE</Text>
            <TouchableOpacity onPress={() => setSearchOpen(true)}>
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Search Results */}
      {isSearching ? (
        <View style={styles.searchResults}>
          {searchResults.length === 0 ? (
            <Text style={[styles.noResults, dark && styles.darkText]}>No results found</Text>
          ) : (
searchResults.map((result, index) => (
  <SearchResultCard
    key={index}
    label={result.label}
    id={result.id}
    sectionTitle={result.sectionTitle}
    dark={dark}
  />
))
          )}
        </View>
      ) : (
        <>
          {/* Filter Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBar}>
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  dark && styles.darkFilterChip,
                  activeFilter === filter && styles.activeChip,
                ]}
                onPress={() => setActiveFilter(filter)}>
                <Text
                  style={[
                    styles.filterText,
                    dark && styles.darkFilterText,
                    activeFilter === filter && styles.activeFilterText,
                  ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sections */}
          {filteredSections.map((section) => (
            <Section key={section.title} title={section.title} data={section.data} dark={dark} />
          ))}
        </>
      )}
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#111',
    flex: 1,
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
  searchIcon: {
    fontSize: 22,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  darkSearchBar: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginRight: 10,
  },
  darkSearchInput: {
    color: '#fff',
    backgroundColor: '#2a2a2a',
  },
  searchResults: {
    padding: 20,
    gap: 12,
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 10,
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#d0d0d0',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  searchResultSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  filterBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  darkFilterChip: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
  },
  activeChip: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  darkFilterText: {
    color: '#aaa',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  viewAll: {
    fontSize: 14,
    color: '#888',
  },
  cardList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#d0d0d0',
  },
  darkCardImagePlaceholder: {
    backgroundColor: '#333',
  },
  cardTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
});
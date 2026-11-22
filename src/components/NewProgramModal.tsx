import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { createProgram } from '@/services/api';

type NewProgramModalProps = {
  visible: boolean;
  dark: boolean;
  onClose: () => void;
  onCreated: (program: { category: string }) => void;
};

const CATEGORIES = ['Skills', 'Mobility', 'Cardio', 'Strength', 'Muscle Growth'];

const createWeeks = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    week: index + 1,
    days: [
      { day: 1, title: `Workout ${index * 3 + 1}`, isRest: false },
      { day: 2, title: 'Rest Day', isRest: true },
      { day: 3, title: `Workout ${index * 3 + 2}`, isRest: false },
      { day: 4, title: 'Rest Day', isRest: true },
      { day: 5, title: `Workout ${index * 3 + 3}`, isRest: false },
      { day: 6, title: 'Rest Day', isRest: true },
      { day: 7, title: 'Rest Day', isRest: true },
    ],
  }));

export default function NewProgramModal({
  visible,
  dark,
  onClose,
  onCreated,
}: NewProgramModalProps) {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [frequency, setFrequency] = useState('');
  const [time, setTime] = useState('');
  const [weeks, setWeeks] = useState('8');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    const weekCount = Number.parseInt(weeks, 10);
    const normalizedCategory = CATEGORIES.find(
      (option) => option.toLowerCase() === category.trim().toLowerCase()
    );
    if (!id.trim() || !title.trim() || !Number.isInteger(weekCount) || weekCount < 1) {
      setError('Enter an ID, title, category, and at least one week.');
      return;
    }
    if (!normalizedCategory) {
      setError(`Category must be one of: ${CATEGORIES.join(', ')}.`);
      return;
    }

    setSaving(true);
    setError('');
    const result = await createProgram({
      _id: id.trim(),
      title: title.trim(),
      category: normalizedCategory,
      description: description.trim(),
      duration: duration.trim(),
      frequency: frequency.trim(),
      time: time.trim(),
      weeks: createWeeks(weekCount),
    });
    setSaving(false);

    if (result?._id) {
      onCreated(result);
      onClose();
    } else if (result === null) {
      setError("Can't reach the server. Make sure the API is running and your VPN is off.");
    } else {
      setError(result?.message ?? 'Could not create the program.');
    }
  };

  const inputStyle = [styles.input, dark && styles.darkInput];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, dark && styles.darkSheet]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={[styles.heading, dark && styles.darkText]}>New Program</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.close, dark && styles.darkText]}>Close</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={inputStyle} placeholder="Program ID (e.g. strength-beginner)" placeholderTextColor={dark ? '#888' : '#aaa'} value={id} onChangeText={setId} autoCapitalize="none" />
            <TextInput style={inputStyle} placeholder="Program title" placeholderTextColor={dark ? '#888' : '#aaa'} value={title} onChangeText={setTitle} />
            <TextInput style={inputStyle} placeholder="Category: Skills, Mobility, Cardio, Strength, or Muscle Growth" placeholderTextColor={dark ? '#888' : '#aaa'} value={category} onChangeText={setCategory} />
            <TextInput style={[...inputStyle, styles.textArea]} placeholder="Description" placeholderTextColor={dark ? '#888' : '#aaa'} value={description} onChangeText={setDescription} multiline />
            <TextInput style={inputStyle} placeholder="Duration (e.g. 8 weeks)" placeholderTextColor={dark ? '#888' : '#aaa'} value={duration} onChangeText={setDuration} />
            <TextInput style={inputStyle} placeholder="Frequency (e.g. 3x per week)" placeholderTextColor={dark ? '#888' : '#aaa'} value={frequency} onChangeText={setFrequency} />
            <TextInput style={inputStyle} placeholder="Time (e.g. 45-60 minutes)" placeholderTextColor={dark ? '#888' : '#aaa'} value={time} onChangeText={setTime} />
            <TextInput style={inputStyle} placeholder="Number of weeks" placeholderTextColor={dark ? '#888' : '#aaa'} value={weeks} onChangeText={setWeeks} keyboardType="numeric" />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={[styles.createButton, saving && styles.disabled]} onPress={handleCreate} disabled={saving}>
              <Text style={styles.createButtonText}>{saving ? 'Creating...' : 'Create Program'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  sheet: { maxHeight: '90%', backgroundColor: '#f9f9f9', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  darkSheet: { backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  heading: { color: '#111', fontSize: 24, fontWeight: 'bold' },
  darkText: { color: '#fff' },
  close: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
  input: { backgroundColor: '#fff', borderColor: '#ddd', borderRadius: 10, borderWidth: 1, color: '#111', fontSize: 15, marginBottom: 12, padding: 12 },
  darkInput: { backgroundColor: '#1e1e1e', borderColor: '#444', color: '#fff' },
  textArea: { height: 90, textAlignVertical: 'top' },
  error: { color: '#ff3b30', marginBottom: 12 },
  createButton: { alignItems: 'center', backgroundColor: '#007AFF', borderRadius: 12, marginBottom: 12, padding: 16 },
  disabled: { opacity: 0.6 },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

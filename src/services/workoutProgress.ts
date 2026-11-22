import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_WORKOUTS_KEY = 'completedWorkoutIds';

export const getCompletedWorkoutIds = async (): Promise<string[]> => {
  try {
    const saved = await AsyncStorage.getItem(COMPLETED_WORKOUTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading workout progress:', error);
    return [];
  }
};

export const setWorkoutCompleted = async (workoutId: string, completed: boolean) => {
  const completedIds = await getCompletedWorkoutIds();
  const nextIds = completed
    ? [...new Set([...completedIds, workoutId])]
    : completedIds.filter((id) => id !== workoutId);

  try {
    await AsyncStorage.setItem(COMPLETED_WORKOUTS_KEY, JSON.stringify(nextIds));
  } catch (error) {
    console.error('Error saving workout progress:', error);
  }
};

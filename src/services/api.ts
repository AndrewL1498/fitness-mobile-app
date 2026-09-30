const API_URL = 'http://localhost:5000/api';

export const fetchProgram = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/programs/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching program:', err);
    return null;
  }
};

export const fetchAllPrograms = async () => {
  try {
    const response = await fetch(`${API_URL}/programs`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching programs:', err);
    return [];
  }
};

export const fetchProgramsByCategory = async (category: string) => {
  try {
    const response = await fetch(`${API_URL}/programs?category=${category}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching programs by category:', err);
    return [];
  }
};

export const fetchWorkout = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/workouts/${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching workout:', err);
    return null;
  }
};

export const createProgram = async (program: any) => {
  try {
    const response = await fetch(`${API_URL}/programs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating program:', err);
    return null;
  }
};

export const createWorkout = async (workout: any) => {
  try {
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating workout:', err);
    return null;
  }
};

export const loginAdmin = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error logging in:', err);
    return null;
  }
};

export const registerAdmin = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error registering:', err);
    return null;
  }
};
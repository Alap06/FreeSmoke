const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.134:3000';

// Register
export const registerUser = async (email, password, displayName) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });
    return await response.json();
  } catch (error) {
    return { message: 'Erreur réseau' };
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    return { message: 'Erreur réseau' };
  }
};

// Save Profile
export const saveProfileToServer = async (token, profile, quitPlan) => {
  try {
    const response = await fetch(`${BASE_URL}/api/profile/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ profile, quitPlan }),
    });
    return await response.json();
  } catch (error) {
    return { message: 'Erreur réseau' };
  }
};

// Get Profile
export const getProfileFromServer = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/profile/get`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return { message: 'Erreur réseau' };
  }
};
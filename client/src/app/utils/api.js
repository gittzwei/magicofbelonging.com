import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getStories = async () => {
  try {
    const res = await axios.get(`${API_URL}/stories`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getStory = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/stories/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
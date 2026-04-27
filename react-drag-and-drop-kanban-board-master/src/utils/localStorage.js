const STORAGE_KEY = "kanban_board_data";

export const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return null;
};

export const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

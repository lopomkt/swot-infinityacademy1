
export function saveState(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadState<T = any>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading state for key ${key}:`, error);
    return null;
  }
}

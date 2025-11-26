import { useState, useEffect, useRef } from 'react';

export default function useLocalStorage(key, initialValue) {
  // Helper untuk membaca safely dari localStorage
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State untuk menyimpan value saat ini
  const [storedValue, setStoredValue] = useState(readValue);

  // Ref untuk melacak key terakhir agar kita bisa mendeteksi perubahan key
  // tanpa memicu write operation yang salah
  const keyRef = useRef(key);

  useEffect(() => {
    // Jika key berubah (misal ganti user), BACA ULANG dari storage
    // Jangan biarkan state lama tersimpan ke key baru!
    if (keyRef.current !== key) {
      const newValue = readValue();
      setStoredValue(newValue);
      keyRef.current = key;
    }
  }, [key]);

  useEffect(() => {
    // Simpan ke localStorage hanya jika key tidak berubah di tengah jalan
    // dan pastikan kita menyimpan value yang benar untuk key saat ini
    if (keyRef.current === key) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error writing localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
//Mengambil user dan tutorial dari URL (versi Dicoding)
import { useMemo } from 'react';

export function useUrlParams() {
  return useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // Sesuai iFrame Dicoding:
    const userId = searchParams.get('user');          // BUKAN user_id
    const tutorialId = searchParams.get('tutorial');  // BUKAN tutorial_id

    if (!userId || !tutorialId) {
      console.warn("Missing ?user= & ?tutorial= from URL iframe.");
      return null;
    }

    return { userId, tutorialId };
  }, []);
}
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getFirebaseServices } from '../firebase/client';

const LOCAL_FAVORITES_KEY = 'skinscores_favorites';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites (from Firestore if logged in, localStorage otherwise)
  useEffect(() => {
    if (user) {
      // Subscribe to user's favorites in Firestore
      const { firestore } = getFirebaseServices();
      const userRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFavorites(data.favoriteTools || []);
        }
      });

      return unsubscribe;
    } else {
      // Use localStorage for anonymous users
      const saved = localStorage.getItem(LOCAL_FAVORITES_KEY);
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse favorites:', e);
        }
      }
    }
  }, [user]);

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (toolId: string) => {
      setIsLoading(true);

      try {
        const newFavorites = favorites.includes(toolId)
          ? favorites.filter((id) => id !== toolId)
          : [...favorites, toolId];

        setFavorites(newFavorites);

        if (user) {
          // Update in Firestore
          const { firestore } = getFirebaseServices();
          const userRef = doc(firestore, 'users', user.uid);
          await updateDoc(userRef, {
            favoriteTools: newFavorites,
            lastUpdated: new Date().toISOString(),
          });
        } else {
          // Update in localStorage
          localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(newFavorites));
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        // Revert on error
        setFavorites(favorites);
      } finally {
        setIsLoading(false);
      }
    },
    [favorites, user],
  );

  // Check if a tool is favorited
  const isFavorite = useCallback(
    (toolId: string) => {
      return favorites.includes(toolId);
    },
    [favorites],
  );

  // Clear all favorites
  const clearFavorites = useCallback(async () => {
    setIsLoading(true);

    try {
      setFavorites([]);

      if (user) {
        const { firestore } = getFirebaseServices();
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
          favoriteTools: [],
          lastUpdated: new Date().toISOString(),
        });
      } else {
        localStorage.removeItem(LOCAL_FAVORITES_KEY);
      }
    } catch (error) {
      console.error('Error clearing favorites:', error);
      setFavorites(favorites);
    } finally {
      setIsLoading(false);
    }
  }, [favorites, user]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoading,
  };
};

import { useState, useEffect, useCallback } from 'react';
import type { Feature } from '../types/feature.types';
import {
  getAllFeatures,
  saveFeature,
  deleteFeature,
} from '../utils/db';

export function useFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeatures = useCallback(async () => {
    try {
      setLoading(true);
      const allFeatures = await getAllFeatures();
      setFeatures(allFeatures);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const addFeature = useCallback(async (feature: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newFeature: Feature = {
      ...feature,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await saveFeature(newFeature);
    await loadFeatures();
  }, [loadFeatures]);

  const updateFeature = useCallback(async (id: string, updates: Partial<Omit<Feature, 'id' | 'createdAt'>>) => {
    const existingFeatures = await getAllFeatures();
    const existing = existingFeatures.find(f => f.id === id);
    if (existing) {
      const updated: Feature = {
        ...existing,
        ...updates,
        updatedAt: Date.now(),
      };
      await saveFeature(updated);
      await loadFeatures();
    }
  }, [loadFeatures]);

  const removeFeature = useCallback(async (id: string) => {
    await deleteFeature(id);
    await loadFeatures();
  }, [loadFeatures]);

  return {
    features,
    loading,
    addFeature,
    updateFeature,
    removeFeature,
    refreshFeatures: loadFeatures,
  };
}

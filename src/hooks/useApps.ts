import { useState, useEffect, useCallback } from 'react';
import type { Application } from '../types/feature.types';
import {
  getAllApps,
  getApp,
  saveApp,
  deleteApp,
} from '../utils/db';

export function useApps() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApps = useCallback(async () => {
    try {
      setLoading(true);
      const allApps = await getAllApps();
      setApps(allApps);
    } catch (error) {
      console.error('Error loading apps:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const addApp = useCallback(async (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newApp: Application = {
      ...app,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await saveApp(newApp);
    await loadApps();
  }, [loadApps]);

  const updateApp = useCallback(async (id: string, updates: Partial<Omit<Application, 'id' | 'createdAt'>>) => {
    const existing = await getApp(id);
    if (existing) {
      const updated: Application = {
        ...existing,
        ...updates,
        updatedAt: Date.now(),
      };
      await saveApp(updated);
      await loadApps();
    }
  }, [loadApps]);

  const removeApp = useCallback(async (id: string) => {
    await deleteApp(id);
    await loadApps();
  }, [loadApps]);

  return {
    apps,
    loading,
    addApp,
    updateApp,
    removeApp,
    refreshApps: loadApps,
  };
}

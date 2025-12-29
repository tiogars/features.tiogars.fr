import { useState, useEffect, useCallback } from 'react';
import type { Repository } from '../types/feature.types';
import {
  getAllRepositories,
  saveRepository,
  deleteRepository,
} from '../utils/db';

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRepositories = useCallback(async () => {
    try {
      setLoading(true);
      const allRepositories = await getAllRepositories();
      setRepositories(allRepositories);
    } catch (error) {
      console.error('Error loading repositories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepositories();
  }, [loadRepositories]);

  const addRepository = useCallback(async (repository: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newRepository: Repository = {
      ...repository,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await saveRepository(newRepository);
    await loadRepositories();
  }, [loadRepositories]);

  const updateRepository = useCallback(async (id: string, updates: Partial<Omit<Repository, 'id' | 'createdAt'>>) => {
    const existingRepositories = await getAllRepositories();
    const existing = existingRepositories.find(r => r.id === id);
    if (existing) {
      const updated: Repository = {
        ...existing,
        ...updates,
        updatedAt: Date.now(),
      };
      await saveRepository(updated);
      await loadRepositories();
    }
  }, [loadRepositories]);

  const removeRepository = useCallback(async (id: string) => {
    await deleteRepository(id);
    await loadRepositories();
  }, [loadRepositories]);

  return {
    repositories,
    loading,
    addRepository,
    updateRepository,
    removeRepository,
    refreshRepositories: loadRepositories,
  };
}

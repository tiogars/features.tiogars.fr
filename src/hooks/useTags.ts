import { useState, useEffect, useCallback } from 'react';
import type { Tag } from '../types/feature.types';
import {
  getAllTags,
  saveTag,
  deleteTag,
} from '../utils/db';

const DEFAULT_TAG_COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
  '#009688', '#4caf50', '#8bc34a', '#cddc39',
  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
];

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      const allTags = await getAllTags();
      setTags(allTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const addTag = useCallback(async (name: string) => {
    const existingTag = tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existingTag) {
      return existingTag;
    }

    // Use tag name hash to consistently assign colors
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const colorIndex = Math.abs(hash) % DEFAULT_TAG_COLORS.length;
    const color = DEFAULT_TAG_COLORS[colorIndex];

    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    await saveTag(newTag);
    await loadTags();
    return newTag;
  }, [tags, loadTags]);

  const removeTag = useCallback(async (id: string) => {
    await deleteTag(id);
    await loadTags();
  }, [loadTags]);

  const getTagByName = useCallback((name: string): Tag | undefined => {
    return tags.find(t => t.name.toLowerCase() === name.toLowerCase());
  }, [tags]);

  return {
    tags,
    loading,
    addTag,
    removeTag,
    getTagByName,
    refreshTags: loadTags,
  };
}

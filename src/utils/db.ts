import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Feature, Tag } from '../types/feature.types';

interface FeaturesDB extends DBSchema {
  features: {
    key: string;
    value: Feature;
    indexes: { 'by-updated': number };
  };
  tags: {
    key: string;
    value: Tag;
  };
}

const DB_NAME = 'features-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<FeaturesDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<FeaturesDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<FeaturesDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create features store
      if (!db.objectStoreNames.contains('features')) {
        const featuresStore = db.createObjectStore('features', { keyPath: 'id' });
        featuresStore.createIndex('by-updated', 'updatedAt');
      }

      // Create tags store
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// Features operations
export async function getAllFeatures(): Promise<Feature[]> {
  const db = await getDB();
  const features = await db.getAllFromIndex('features', 'by-updated');
  return features.reverse(); // Most recent first
}

export async function getFeature(id: string): Promise<Feature | undefined> {
  const db = await getDB();
  return db.get('features', id);
}

export async function saveFeature(feature: Feature): Promise<void> {
  const db = await getDB();
  await db.put('features', feature);
}

export async function deleteFeature(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('features', id);
}

// Tags operations
export async function getAllTags(): Promise<Tag[]> {
  const db = await getDB();
  return db.getAll('tags');
}

export async function getTag(id: string): Promise<Tag | undefined> {
  const db = await getDB();
  return db.get('tags', id);
}

export async function saveTag(tag: Tag): Promise<void> {
  const db = await getDB();
  await db.put('tags', tag);
}

export async function deleteTag(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('tags', id);
}

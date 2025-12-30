import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Feature, Tag, Repository, Application } from '../types/feature.types';

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
  repositories: {
    key: string;
    value: Repository;
    indexes: { 'by-name': string };
  };
  apps: {
    key: string;
    value: Application;
    indexes: { 'by-name': string };
  };
}

const DB_NAME = 'features-db';
const DB_VERSION = 4;

let dbInstance: IDBPDatabase<FeaturesDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<FeaturesDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<FeaturesDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, _newVersion, transaction) {
      // Create features store
      if (!db.objectStoreNames.contains('features')) {
        const featuresStore = db.createObjectStore('features', { keyPath: 'id' });
        featuresStore.createIndex('by-updated', 'updatedAt');
      }

      // Create tags store
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id' });
      }

      // Create repositories store (added in version 2)
      if (oldVersion < 2 && !db.objectStoreNames.contains('repositories')) {
        const repositoriesStore = db.createObjectStore('repositories', { keyPath: 'id' });
        repositoriesStore.createIndex('by-name', 'name');
      }

      // Create apps store (added in version 3)
      if (oldVersion < 3 && !db.objectStoreNames.contains('apps')) {
        const appsStore = db.createObjectStore('apps', { keyPath: 'id' });
        appsStore.createIndex('by-name', 'name');
      }

      // Migrate apps to include links array (added in version 4)
      if (oldVersion < 4 && db.objectStoreNames.contains('apps')) {
        const appsStore = transaction.objectStore('apps');
        appsStore.openCursor().then(function updateApp(cursor): Promise<void> | undefined {
          if (!cursor) return;
          const app = cursor.value;
          if (!app.links) {
            app.links = [];
            cursor.update(app);
          }
          return cursor.continue().then(updateApp);
        });
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

// Repositories operations
export async function getAllRepositories(): Promise<Repository[]> {
  const db = await getDB();
  const repositories = await db.getAllFromIndex('repositories', 'by-name');
  return repositories;
}

export async function getRepository(id: string): Promise<Repository | undefined> {
  const db = await getDB();
  return db.get('repositories', id);
}

export async function saveRepository(repository: Repository): Promise<void> {
  const db = await getDB();
  await db.put('repositories', repository);
}

export async function deleteRepository(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('repositories', id);
}

// Apps operations
export async function getAllApps(): Promise<Application[]> {
  const db = await getDB();
  const apps = await db.getAllFromIndex('apps', 'by-name');
  return apps;
}

export async function getApp(id: string): Promise<Application | undefined> {
  const db = await getDB();
  return db.get('apps', id);
}

export async function saveApp(app: Application): Promise<void> {
  const db = await getDB();
  await db.put('apps', app);
}

export async function deleteApp(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('apps', id);
}

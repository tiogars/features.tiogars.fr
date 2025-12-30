export interface Feature {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  url: string;
  createdAt: number;
  updatedAt: number;
}

export interface Application {
  id: string;
  name: string;
  repositoryIds: string[];
  createdAt: number;
  updatedAt: number;
}

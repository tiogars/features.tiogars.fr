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

export interface Link {
  id: string;
  displayName: string;
  description: string;
  icon: string;
  href: string;
  target: '_blank' | '_self' | '_parent' | '_top';
  environment: 'Production' | 'Test' | 'Development';
}

export interface Application {
  id: string;
  name: string;
  repositoryIds: string[];
  links: Link[];
  createdAt: number;
  updatedAt: number;
}

import type { Feature, Tag, Repository } from '../types/feature.types';
import { getAllFeatures, getAllTags, getAllRepositories, saveFeature, saveTag, saveRepository } from './db';

const LAST_BACKUP_KEY = 'lastBackupTimestamp';

export interface BackupData {
  features: Feature[];
  tags: Tag[];
  repositories: Repository[];
  timestamp: number;
  version: string;
}

// Get the last backup timestamp from localStorage
export function getLastBackupTimestamp(): number | null {
  const timestamp = localStorage.getItem(LAST_BACKUP_KEY);
  return timestamp ? parseInt(timestamp, 10) : null;
}

// Save the backup timestamp to localStorage
function saveBackupTimestamp(): void {
  localStorage.setItem(LAST_BACKUP_KEY, Date.now().toString());
}

// Check if last backup is older than 1 week
export function isBackupOlderThanWeek(): boolean {
  const lastBackup = getLastBackupTimestamp();
  if (!lastBackup) return true;
  
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - lastBackup) > oneWeekInMs;
}

// Export all data to a backup object
export async function exportData(): Promise<BackupData> {
  const [features, tags, repositories] = await Promise.all([
    getAllFeatures(),
    getAllTags(),
    getAllRepositories(),
  ]);

  return {
    features,
    tags,
    repositories,
    timestamp: Date.now(),
    version: '1.0',
  };
}

// Convert backup data to JSON string
export function toJSON(data: BackupData): string {
  return JSON.stringify(data, null, 2);
}

// Convert backup data to CSV format
export function toCSV(data: BackupData): string {
  let csv = '';

  // Features CSV
  csv += 'FEATURES\n';
  csv += 'ID,Title,Description,Tags,Created At,Updated At\n';
  data.features.forEach(feature => {
    const tags = feature.tags.join(';');
    const title = `"${feature.title.replace(/"/g, '""')}"`;
    const description = `"${feature.description.replace(/"/g, '""')}"`;
    csv += `${feature.id},${title},${description},"${tags}",${feature.createdAt},${feature.updatedAt}\n`;
  });

  csv += '\n';

  // Tags CSV
  csv += 'TAGS\n';
  csv += 'ID,Name,Color\n';
  data.tags.forEach(tag => {
    csv += `${tag.id},"${tag.name.replace(/"/g, '""')}",${tag.color}\n`;
  });

  csv += '\n';

  // Repositories CSV
  csv += 'REPOSITORIES\n';
  csv += 'ID,Name,Owner,URL,Created At,Updated At\n';
  data.repositories.forEach(repo => {
    const name = `"${repo.name.replace(/"/g, '""')}"`;
    const owner = `"${repo.owner.replace(/"/g, '""')}"`;
    csv += `${repo.id},${name},${owner},${repo.url},${repo.createdAt},${repo.updatedAt}\n`;
  });

  return csv;
}

// Convert backup data to XML format
export function toXML(data: BackupData): string {
  const escapeXML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<backup version="${data.version}" timestamp="${data.timestamp}">\n`;

  // Features
  xml += '  <features>\n';
  data.features.forEach(feature => {
    xml += '    <feature>\n';
    xml += `      <id>${escapeXML(feature.id)}</id>\n`;
    xml += `      <title>${escapeXML(feature.title)}</title>\n`;
    xml += `      <description>${escapeXML(feature.description)}</description>\n`;
    xml += '      <tags>\n';
    feature.tags.forEach(tag => {
      xml += `        <tag>${escapeXML(tag)}</tag>\n`;
    });
    xml += '      </tags>\n';
    xml += `      <createdAt>${feature.createdAt}</createdAt>\n`;
    xml += `      <updatedAt>${feature.updatedAt}</updatedAt>\n`;
    xml += '    </feature>\n';
  });
  xml += '  </features>\n';

  // Tags
  xml += '  <tags>\n';
  data.tags.forEach(tag => {
    xml += '    <tag>\n';
    xml += `      <id>${escapeXML(tag.id)}</id>\n`;
    xml += `      <name>${escapeXML(tag.name)}</name>\n`;
    xml += `      <color>${escapeXML(tag.color)}</color>\n`;
    xml += '    </tag>\n';
  });
  xml += '  </tags>\n';

  // Repositories
  xml += '  <repositories>\n';
  data.repositories.forEach(repo => {
    xml += '    <repository>\n';
    xml += `      <id>${escapeXML(repo.id)}</id>\n`;
    xml += `      <name>${escapeXML(repo.name)}</name>\n`;
    xml += `      <owner>${escapeXML(repo.owner)}</owner>\n`;
    xml += `      <url>${escapeXML(repo.url)}</url>\n`;
    xml += `      <createdAt>${repo.createdAt}</createdAt>\n`;
    xml += `      <updatedAt>${repo.updatedAt}</updatedAt>\n`;
    xml += '    </repository>\n';
  });
  xml += '  </repositories>\n';

  xml += '</backup>';
  return xml;
}

// Download backup file
export function downloadBackup(content: string, format: 'json' | 'xml' | 'csv'): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `features-backup-${timestamp}.${format}`;
  
  const mimeTypes = {
    json: 'application/json',
    xml: 'application/xml',
    csv: 'text/csv',
  };

  const blob = new Blob([content], { type: mimeTypes[format] });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Save backup timestamp
  saveBackupTimestamp();
}

// Parse JSON backup file
function parseJSONBackup(content: string): BackupData {
  return JSON.parse(content);
}

// Parse CSV backup file (simplified - expects exact format)
function parseCSVBackup(content: string): BackupData {
  const lines = content.split('\n');
  const features: Feature[] = [];
  const tags: Tag[] = [];
  const repositories: Repository[] = [];
  
  let currentSection = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (line === 'FEATURES') {
      currentSection = 'features';
      i += 2; // Skip header
      continue;
    } else if (line === 'TAGS') {
      currentSection = 'tags';
      i += 2; // Skip header
      continue;
    } else if (line === 'REPOSITORIES') {
      currentSection = 'repositories';
      i += 2; // Skip header
      continue;
    }

    if (!line || line === '') {
      i++;
      continue;
    }

    // Parse CSV line (basic implementation)
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          if (inQuotes && line[j + 1] === '"') {
            current += '"';
            j++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    };

    const parts = parseCSVLine(line);

    if (currentSection === 'features' && parts.length >= 6) {
      features.push({
        id: parts[0],
        title: parts[1],
        description: parts[2],
        tags: parts[3].split(';').filter(t => t),
        createdAt: parseInt(parts[4], 10),
        updatedAt: parseInt(parts[5], 10),
      });
    } else if (currentSection === 'tags' && parts.length >= 3) {
      tags.push({
        id: parts[0],
        name: parts[1],
        color: parts[2],
      });
    } else if (currentSection === 'repositories' && parts.length >= 6) {
      repositories.push({
        id: parts[0],
        name: parts[1],
        owner: parts[2],
        url: parts[3],
        createdAt: parseInt(parts[4], 10),
        updatedAt: parseInt(parts[5], 10),
      });
    }

    i++;
  }

  return {
    features,
    tags,
    repositories,
    timestamp: Date.now(),
    version: '1.0',
  };
}

// Parse XML backup file (simplified)
function parseXMLBackup(content: string): BackupData {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');
  
  const features: Feature[] = [];
  const tags: Tag[] = [];
  const repositories: Repository[] = [];

  // Parse features
  const featureNodes = xmlDoc.querySelectorAll('features > feature');
  featureNodes.forEach(node => {
    const tagNodes = node.querySelectorAll('tags > tag');
    const tagArray: string[] = [];
    tagNodes.forEach(tagNode => {
      tagArray.push(tagNode.textContent || '');
    });

    features.push({
      id: node.querySelector('id')?.textContent || '',
      title: node.querySelector('title')?.textContent || '',
      description: node.querySelector('description')?.textContent || '',
      tags: tagArray,
      createdAt: parseInt(node.querySelector('createdAt')?.textContent || '0', 10),
      updatedAt: parseInt(node.querySelector('updatedAt')?.textContent || '0', 10),
    });
  });

  // Parse tags
  const tagNodes = xmlDoc.querySelectorAll('tags > tag');
  tagNodes.forEach(node => {
    tags.push({
      id: node.querySelector('id')?.textContent || '',
      name: node.querySelector('name')?.textContent || '',
      color: node.querySelector('color')?.textContent || '',
    });
  });

  // Parse repositories
  const repoNodes = xmlDoc.querySelectorAll('repositories > repository');
  repoNodes.forEach(node => {
    repositories.push({
      id: node.querySelector('id')?.textContent || '',
      name: node.querySelector('name')?.textContent || '',
      owner: node.querySelector('owner')?.textContent || '',
      url: node.querySelector('url')?.textContent || '',
      createdAt: parseInt(node.querySelector('createdAt')?.textContent || '0', 10),
      updatedAt: parseInt(node.querySelector('updatedAt')?.textContent || '0', 10),
    });
  });

  const timestamp = xmlDoc.querySelector('backup')?.getAttribute('timestamp');
  const version = xmlDoc.querySelector('backup')?.getAttribute('version');

  return {
    features,
    tags,
    repositories,
    timestamp: timestamp ? parseInt(timestamp, 10) : Date.now(),
    version: version || '1.0',
  };
}

// Import backup from file content
export async function importBackup(content: string, format: 'json' | 'xml' | 'csv'): Promise<void> {
  let backupData: BackupData;

  try {
    if (format === 'json') {
      backupData = parseJSONBackup(content);
    } else if (format === 'xml') {
      backupData = parseXMLBackup(content);
    } else {
      backupData = parseCSVBackup(content);
    }

    // Import data to database
    await Promise.all([
      ...backupData.features.map(feature => saveFeature(feature)),
      ...backupData.tags.map(tag => saveTag(tag)),
      ...backupData.repositories.map(repo => saveRepository(repo)),
    ]);

  } catch (error) {
    throw new Error(`Failed to import backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

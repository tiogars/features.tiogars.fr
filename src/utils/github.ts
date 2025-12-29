export interface GitHubRepoInfo {
  owner: string;
  name: string;
  url: string;
}

/**
 * Parse a GitHub repository URL and extract owner and repo name
 * Supports various GitHub URL formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - https://github.com/owner/repo/issues
 * - github.com/owner/repo
 */
export function parseGitHubUrl(url: string): GitHubRepoInfo | null {
  try {
    // Remove trailing slashes and whitespace
    const cleanUrl = url.trim().replace(/\/+$/, '');
    
    // Try to parse as URL, or add https:// if missing
    let urlObj: URL;
    try {
      urlObj = new URL(cleanUrl);
    } catch {
      // If parsing fails, try adding https://
      try {
        urlObj = new URL(`https://${cleanUrl}`);
      } catch {
        return null;
      }
    }
    
    // Check if it's a GitHub URL
    if (urlObj.hostname !== 'github.com' && urlObj.hostname !== 'www.github.com') {
      return null;
    }
    
    // Extract path parts
    const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
    
    // Need at least owner and repo
    if (pathParts.length < 2) {
      return null;
    }
    
    const owner = pathParts[0];
    let name = pathParts[1];
    
    // Remove .git extension if present
    if (name.endsWith('.git')) {
      name = name.slice(0, -4);
    }
    
    // Construct clean URL
    const cleanRepoUrl = `https://github.com/${owner}/${name}`;
    
    return {
      owner,
      name,
      url: cleanRepoUrl
    };
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
}

/**
 * Check if a repository already exists in the list by comparing owner and name
 */
export function findExistingRepository(
  repositories: Array<{ owner: string; name: string }>,
  owner: string,
  name: string
): boolean {
  return repositories.some(
    repo => repo.owner.toLowerCase() === owner.toLowerCase() && 
            repo.name.toLowerCase() === name.toLowerCase()
  );
}

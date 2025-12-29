export interface GitHubRepoInfo {
  owner: string;
  name: string;
  url: string;
}

const ALLOWED_GITHUB_HOSTNAMES = ['github.com', 'www.github.com'] as const;

// Valid GitHub username/repository name pattern
// Alphanumeric, hyphens, underscores, and periods are allowed
// Cannot start with a hyphen
const GITHUB_NAME_PATTERN = /^[a-zA-Z0-9][\w.-]*$/;

/**
 * Validate GitHub username or repository name
 */
function isValidGitHubName(name: string): boolean {
  if (!name || name.length === 0 || name.length > 100) {
    return false;
  }
  return GITHUB_NAME_PATTERN.test(name);
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
    if (!ALLOWED_GITHUB_HOSTNAMES.includes(urlObj.hostname as typeof ALLOWED_GITHUB_HOSTNAMES[number])) {
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
    
    // Validate owner and repository names
    if (!isValidGitHubName(owner) || !isValidGitHubName(name)) {
      return null;
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

// Centralized links factory for repositories
export const GITHUB_API_BASE = "https://api.github.com";

/**
 * Create a set of links for a specific GitHub repository.
 * Use this when each page has its own owner/repo rather than hardcoding
 * a single repo in this file.
 */
export function repoLinks(owner: string, name: string) {
  const repoBase = `https://github.com/${owner}/${name}`;
  const apiBase = GITHUB_API_BASE;
  const issuesApi = `${apiBase}/repos/${owner}/${name}/issues`;
  const releasesApi = `${apiBase}/repos/${owner}/${name}/releases`;
  const newIssueUrl = `${repoBase}/issues/new`;
  return {
    apiBase,
    owner,
    name,
    repoUrl: repoBase,
    issuesApi,
    releasesApi,
    newIssueUrl,
  };
}

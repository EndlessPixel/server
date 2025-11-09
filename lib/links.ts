export const GITHUB_API_BASE = "https://api.github.com";
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

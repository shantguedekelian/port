import { fetchJSON, renderProjects, fetchGitHubData} from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');
console.log('hi');

renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('giorgianicolaou');

const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
  profileStats.innerHTML = `
        <h2>My Github Stats</h2>
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}


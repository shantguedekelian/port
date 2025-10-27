console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// if (currentLink) {
//   // or if (currentLink !== undefined)
//   currentLink.classList.add('current');
// }

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact'},
  { url: 'resume.html', title: "Resume"},
  { url: 'https://github.com/shantguedekelian', title: 'Github'},
];

let nav = document.createElement('nav');
//let ul = document.createElement('ul.navigation');
document.body.prepend(nav);
//document.nav.prepend(ul);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/website/";

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // next step: create link and add it to nav
    let a = document.createElement('a');
    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host !== location.host) {
        a.target = "_blank";
    }
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Automatic</option>
            <option value="dark">dark</option>
            <option value="light">light</option>
		</select>
	</label>`,
);

let select = document.querySelector('select');

select.addEventListener('input', function (event) {
  localStorage.colorScheme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  console.log('color scheme changed to', event.target.value);

});

if("colorScheme" in localStorage){
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
} 

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  const numProjects = projects.length;
  const title = document.querySelector('.projects-title');
  if (title) {
      title.textContent = `${numProjects} Projects`;
  } else {
      console.warn('Element with class ".projects-title" not found.');
  }

  // 1. Validate the container element
  if (!containerElement) {
    console.error('Container element not found!');
    return;
  }

  // 2. Clear any existing content
  containerElement.innerHTML = '';

  // 3. Loop through all projects
  projects.forEach(project => {
    // 4. Create an article for each project
    const article = document.createElement('article');

    // Handle missing data gracefully
    const title = project.title || 'Untitled Project';
    const image = project.image || '';
    const description = project.description || 'No description available.';
    const year = project.year || 'No year available.';

    // 5. Add dynamic content (including dynamic heading level)
    article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      <img src="${image}" alt="${title}">
      <p>${description}</p>
      <p>c. ${year}</p>
    `;

    // 6. Append the article to the container
    containerElement.appendChild(article);
  });

}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}



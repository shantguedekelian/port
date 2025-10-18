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

import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let query = '';
let searchInput = document.querySelector('.searchBar');

function renderPieChart(projectsGiven) {
  // roll up data by year
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let newData = newRolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(newData);
  let arcs = arcData.map((d) => arcGenerator(d));

  // clear existing elements
  let svg = d3.select('svg');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // draw new legend items
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'ind-legend')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });

  // selected wedge index
let selectedIndex = -1;


  // draw pie slices
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        // toggle selection
        selectedIndex = selectedIndex === i ? -1 : i;

        // update wedges
        svg
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : null));

        // update legend
        legend
          .selectAll('li')
          .attr('class', (_, idx) =>
            idx === selectedIndex ? 'selected ind-legend' : 'ind-legend'
          );

        if (selectedIndex === -1) {
        renderProjects(projects, projectsContainer, 'h2');
        } else {
            const selectedYear = newData[selectedIndex].label;
            const filteredProjects = projects.filter(
                (p) => p.year === selectedYear
            );
            renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });

  // make legend clickable too
  legend.selectAll('li').on('click', (_, idx) => {
    selectedIndex = selectedIndex === idx ? -1 : idx;

    svg
      .selectAll('path')
      .attr('class', (_, i) => (i === selectedIndex ? 'selected' : null));

    legend
      .selectAll('li')
      .attr('class', (_, i) =>
        i === selectedIndex ? 'selected ind-legend' : 'ind-legend'
      );
    
  });

}

// initial render
renderPieChart(projects);

// filter + re-render on search
searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

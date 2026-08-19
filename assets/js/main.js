const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = 'Menu';
}));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const filters = document.querySelectorAll('.filter-button');
const projects = document.querySelectorAll('.project-card[data-category]');
const filterStatus = document.querySelector('.filter-status');

filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });

  const selected = button.dataset.filter;
  let visibleCount = 0;
  projects.forEach((project) => {
    const categories = project.dataset.category.split(/\s+/);
    const visible = selected === 'all' || categories.includes(selected);
    project.hidden = !visible;
    if (visible) {
      visibleCount += 1;
      project.classList.add('is-visible');
    }
  });

  if (filterStatus) {
    filterStatus.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}`;
  }
}));

document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });

document.querySelectorAll('.video-player').forEach((player) => {
  const button = player.querySelector('.video-load');
  button?.addEventListener('click', () => {
    if (window.location.protocol === 'file:') {
      player.classList.add('needs-server');
      return;
    }

    const provider = player.dataset.videoProvider;
    const id = player.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.title = button.getAttribute('aria-label') || 'Embedded video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.src = provider === 'vimeo'
      ? `https://player.vimeo.com/video/${id}?autoplay=1`
      : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    player.appendChild(iframe);
  });
});

const equalHeightGrids = document.querySelectorAll('.project-media-grid, .people-grid, .logo-grid, .gallery, .character-grid, .sexilio-grid');

function equalizeGridImages(grid) {
  const images = [...grid.querySelectorAll('img')].filter((img) => img.complete && img.naturalWidth > 0);
  if (!images.length) return;

  grid.style.removeProperty('--equal-grid-height');
  requestAnimationFrame(() => {
    const naturalRenderedHeights = images.map((img) => {
      const availableWidth = img.getBoundingClientRect().width;
      return availableWidth * (img.naturalHeight / img.naturalWidth);
    }).filter((height) => Number.isFinite(height) && height > 0);

    if (naturalRenderedHeights.length) {
      const smallestHeight = Math.floor(Math.min(...naturalRenderedHeights));
      grid.style.setProperty('--equal-grid-height', `${smallestHeight}px`);
    }
  });
}

function equalizeAllGridImages() {
  equalHeightGrids.forEach(equalizeGridImages);
}

equalHeightGrids.forEach((grid) => {
  grid.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', () => equalizeGridImages(grid), { once: true });
  });
});

equalizeAllGridImages();
let gridResizeFrame;
window.addEventListener('resize', () => {
  cancelAnimationFrame(gridResizeFrame);
  gridResizeFrame = requestAnimationFrame(equalizeAllGridImages);
});

const projectFooter = document.querySelector('.project-page .site-footer');

if (projectFooter) {
  const projects = [
    { page: 'project-qdlo.html', title: '¿Quién dio la orden?', image: 'assets/images/projects/index/quien-dio-la-orden-generated.png' },
    { page: 'project-sexilio.html', title: 'SEXILIO', image: 'assets/images/projects/index/sexilio.jpeg' },
    { page: 'project-paramoverso.html', title: 'Paramoverso', image: 'assets/images/projects/index/paramoverso.jpeg' },
    { page: 'project-camino-cimarron.html', title: 'El Camino Cimarrón', image: 'assets/images/projects/index/camino-cimarron.png' },
    { page: 'project-colombia-resiste.html', title: 'Colombia Resiste 360', image: 'assets/images/projects/index/colombia-resiste-360.png' },
    { page: 'project-continuum-vr.html', title: 'Continuum VR', image: 'assets/images/projects/index/continuum-vr.png' },
    { page: 'project-les-danses-extatiques.html', title: 'Les Danses Extatiques', image: 'assets/images/projects/index/les-danses-extatiques.jpg' },
    { page: 'project-mountain-museum.html', title: 'Mountain Museum', image: 'assets/images/projects/index/mountain-museum.png' }
  ];
  const currentPage = decodeURIComponent(window.location.pathname).split('/').pop().toLowerCase();
  const currentIndex = projects.findIndex((project) => project.page === currentPage);
  const orderedProjects = currentIndex >= 0
    ? [...projects.slice(currentIndex + 1), ...projects.slice(0, currentIndex)]
    : projects;
  const recommendations = orderedProjects.slice(0, 5);

  projectFooter.classList.add('project-footer');
  projectFooter.replaceChildren();

  const heading = document.createElement('h2');
  heading.className = 'project-recommendations-title';
  heading.textContent = 'You may also like';

  const grid = document.createElement('div');
  grid.className = 'project-recommendations-grid';
  recommendations.forEach((project) => {
    const link = document.createElement('a');
    link.className = 'project-recommendation';
    link.href = project.page;
    link.setAttribute('aria-label', `View ${project.title}`);

    const media = document.createElement('span');
    media.className = 'project-recommendation-media';
    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.title;
    image.loading = 'lazy';
    media.appendChild(image);
    link.appendChild(media);
    grid.appendChild(link);
  });

  const home = document.createElement('a');
  home.className = 'footer-mark project-footer-mark';
  home.href = 'index.html';
  home.textContent = 'CANVAR';
  home.setAttribute('aria-label', 'CANVAR home');

  const footerRow = document.createElement('div');
  footerRow.className = 'footer-row';
  const allProjects = document.createElement('a');
  allProjects.href = 'projects.html';
  allProjects.textContent = '← All projects';
  const copyright = document.createElement('span');
  copyright.textContent = `© ${new Date().getFullYear()}`;
  footerRow.append(allProjects, copyright);

  projectFooter.append(heading, grid, home, footerRow);
}

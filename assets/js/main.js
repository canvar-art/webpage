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

const equalHeightGrids = document.querySelectorAll('.project-list, .project-media-grid, .people-grid, .logo-grid, .gallery, .character-grid, .sexilio-grid');

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

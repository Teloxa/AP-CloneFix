# code version 02

HTML CODE: 
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloneFix</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <link rel="stylesheet" href="app.css">
</head>

<body>
  <nav class="navbar navbar-expand-lg border-bottom bg-black">
    <div class="container">
      <a href="#" class="navbar-brand"><b>Clone</b>Fix</a>
      <form id="searchForm" class="d-flex ms-auto">
        <input id="searchInput" type="text" class="form-control me-2" placeholder="Search a movie">
        <button type="submit" class="btn btn-danger">Search</button>
      </form>
    </div>
  </nav>
  <header id="hero" class="hero bg-black">
    <div class="container">
      <h1 id="heroTitle" class="display-5 fw-bold"></h1>
      <p id="heroDesc" class="lead col-lg-6"></p>
      <button class="btn btn-danger btn-lg">watch now</button>
    </div>    
  </header>

<main id="rowsContainer" class="container my-4" >

</main>

<footer class="footer py-4 mt-5">
  <div class="container small">
    By: Teloxa  | TVMaze
  </div>
</footer>

<!-- Modal for detail of movie -->

<div id="detailModal" class="modal fade" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content bg-black text-light">
      <div class="modal-header border-secondary">
        <h5 id="detailTitle" class="modal-title">Detail</h5>
        <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div id="detailBody" class="modal-body">
        Loading...
      </div>
    </div>
  </div>


</div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  <script src="app.js"></script>
</body>
</html>
```

CSS CODE: 

```
body {
  background-color: #0b0d10;
}

.navbar-brand b {
  color: #e50914;
}

.hero {
  min-height: 55vh;
  background-size: cover;
  display: flex;
  align-items: end;
  padding: 3rem 1rem;
  position: relative;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.7));
}

.hero > .container {
  position: relative;
  z-index: 2;
}

.row-title {
  font-weight: 700;
  margin: 1rem 0 .5 rem;
}

.rail {
  display: flex;
  gap: 1rem;
  overflow: auto;
  padding-bottom: .5rem;
  scroll-snap-type: x mandatory;
}

.card-poster {
  min-width: 160px;
  scroll-snap-align: start;
  background: #111;
  border: none;
}

.card-poster-img {
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 5rem;
}

.badge-genre {
  background-color: #E50914;
}

.footer {
  border-top: 1px solid #222;
  color: #9AA4AD;
}

::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #333;
  border-radius: 4px;
}
```


JS code: 
```
// api to tvmaze
const API = "https://api.tvmaze.com"

// DOM elements
const rowsContainer = document.getElementById('rowsContainer')
const hero = document.getElementById('hero') || document.querySelector('.hero')
const heroTitle = document.getElementById('heroTitle')
const heroDesc = document.getElementById('heroDesc')
const heroPlay = document.getElementById('heroPlay')

const init = async () => {
  if (!rowsContainer) return console.error('rowsContainer element not found')
  try {
    const trending = await fetchJSON(`${API}/shows?page=1`)
    renderHero(trending[Math.floor(Math.random() * trending.length)])
    renderRow("Trending", trending.slice(0, 20))
    console.log('@@@ trending => ', trending)
  } catch (err) {
    console.error('Init failed:', err)
  }
  // wire search handler after init
  wireSearch()
}

const wireSearch = () => {
  const form = document.getElementById('searchForm')
  const input = document.getElementById('searchInput')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const movie = input.value.trim()
    if(!movie){
      return
    }
    const results = await fetchJSON(`${API}/search/shows?q=${encodeURIComponent(movie)}`)
    const shows = results.map(r => r.show)
    rowsContainer.innerHTML = ''
    renderRow(`Results for ${movie}`, shows)

  })
}

const renderRow = (title, shows) => {
  const section = document.createElement('section')
  section.className = 'mb-3'
  section.innerHTML = `
    <h3 class="rowTitle">${title}</h3>
    <div class="rail" data-rail></div>
  `
  const rail = section.querySelector('[data-rail]')
  if (!Array.isArray(shows)) shows = []
  shows.forEach((show) => {
    rail.appendChild(posterCard(show))
  })
  rowsContainer.appendChild(section)
}

const posterCard = show => {
  const card = document.createElement('div')
  card.className = 'card card-poster'
  const img = (show && show.image && show.image.medium) ? show.image.medium : 'https://placehold.co/600x400?text=Sin+Imagen'

  card.innerHTML = `
    <img class="card-img-top card-poster-img" src="${img}" alt="${escapeHTML(show?.name || 'Poster')}">
    <div class="card-body p-2">
      <div class="small text-secondary">
        ${(show?.genres || []).slice(0,2).join(' . ')}
      </div>
      <div class="fw-semibold">
        ${escapeHTML(show?.name || '')}
      </div>
    </div>
  `
  card.addEventListener('click', () => openDetail(show?.id))
  return card
}

const escapeHTML = str => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const fetchJSON = async (url) => {
  const res = await fetch(url)
  if(!res.ok){
    throw new Error(`Error to load data: ${url}`)
  }
  return await res.json()
}

// open detail modal and load show details
const openDialog = async (showId) => {
  if (!showId) return
  const modalEl = document.getElementById('detailModal')
  const titleEl = document.getElementById('detailTitle')
  const bodyEl = document.getElementById('detailBody')
  if (!modalEl) return
  try {
    titleEl.textContent = 'Loading...'
    bodyEl.innerHTML = 'Loading...'
    const data = await fetchJSON(`${API}/shows/${showId}`)
    titleEl.textContent = data.name || 'Detail'
    bodyEl.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img src="${data.image?.medium || 'https://placehold.co/300x200?text=No+Image'}" class="img-fluid" alt="${escapeHTML(data.name)}">
        </div>
        <div class="col-md-8">
          <p>${escapeHTML(data.summary || '')}</p>
        </div>
      </div>
    `
  } catch (err) {
    titleEl.textContent = 'Error'
    bodyEl.textContent = String(err)
  }
  // show bootstrap modal
  try {
    const bsModal = new bootstrap.Modal(modalEl)
    bsModal.show()
  } catch (e) {
    console.warn('Bootstrap modal not available:', e)
  }
}

const renderHero = show => {
  if(!show){
    return
  }
  const bg = show?.image?.original || show?.image?.medium || 'https://placehold.co/600x400?text=Sin+Imagen'
  hero.style.backgroundImage = bg ? `url(${bg})` : 'none'
  heroTitle.textContent = show.name || ''
  heroDesc.textContent = stripHTML(show?.summary || '').slice(0,200) + '...'
  if (heroPlay) {
    heroPlay.onclick = () => openDialog(show.id)
  }
}

const stripHTML = html => {
  return (html||"").replace(/<[^>]*>/g,"");
}

const openDetail = async (id) => {
  const modalEl = document.getElementById('detailModal')
  const modalbody = document.getElementById('detailBody')
  const modalTitle = document.getElementById('detailTitle')
  if (!modalEl || !modalTitle || !modalbody) return
  modalTitle.textContent = 'Loading....'
  modalbody.innerHTML = 'Loading'

  const modal = bootstrap.Modal.getOrCreateInstance(modalEl)

  try {
    const show = await fetchJSON(`${API}/shows/${id}`)
    modalTitle.textContent = show.name || 'Detail'
    modalbody.innerHTML = `
      <div class="row g-4">
        <div class="col-md-4">
          <img class="img-fluid rounded" src="${show?.image?.original || show?.image?.medium || 'https://placehold.co/600x400?text=No+Image'}" alt="${escapeHTML(show?.name || '')}">
        </div>
        <div class="col-md-8">
          <div class="mb-2">
            ${(show?.genres || []).map(g => `
              <span class="badge badge-genre me-1">${escapeHTML(g)}</span>
            `).join("")}
          </div>
          <p class="text-secondary small">
            ${escapeHTML(stripHTML(show?.summary || 'Sin sinpsis'))}
          </p>
          <p class="text-secondary small">
            ⭐${show?.rating?.average ?? 'N/A'} - Language: ${escapeHTML(show?.language || 'N/A')} - Status: ${escapeHTML(show?.status || 'N/A')}
          </p>
          <a class="btn btn-outline-light me-2" href="${show?.officialSite || show?.url || '#'}" target="_blank" rel="noopener">Web site</a>
        </div>
      </div>
    `
    modal.show()
  } catch (err) {
    modalTitle.textContent = 'Error'
    modalbody.textContent = String(err)
    modal.show()
  }
}

init()
```
// api to tvmaze
const API = "https://api.tvmaze.com"

// DOM elements
const rowsContainer = document.getElementById('rowsContainer')
const hero = document.getElementById('hero')
const heroTitle = document.getElementById('heroTitle')
const heroDesc = document.getElementById('heroDesc')
const heroPlay = document.getElementById('heroPlay')


const init = async () => {
  const trending = await fetchJSON(`${API}/shows?page=1`)
  renderRow("Trending", trending.slice(0, 20))
  console.log('@@@ trending => ', trending)
}

const renderRow = (title, shows) => {
  const section = document.createElement('section')
    section.classList = 'mb-3'
    section.innerHTML = 
    `
      <h3 class="rowTitle">${title}</h3>
      <div class="rail" data-rail></div>

    `
  
      // function to create 
      rowsContainer.appendChild(section)  
}

const fetchJSON = async (url) => {.2
  const res = await fetch(url)
  if(!res.ok){
    throw new Error('Error to load data: ', url)
  }
  return await res.json()
}

init()

```
## Navegation

- ✔️ [Home] (./readme.md)
- ❌ [Version 01] (./version01.md)
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

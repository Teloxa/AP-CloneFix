# code version 01

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
  <header class="hero bg-black">
    <div class="container">
      <h1 id="heroTitle" class="display-5 fw-bold"></h1>
      <p id="heroDesc" class="lead col-lg-6"></p>
      <button class="btn btn-danger btn-lg">watch now</button>
    </div>    
  </header>

<main id="rowsContainer" class="container my-4" >

</main>

<footer class="footer-pyp-4 mt-5">
  <div class="container small">
    By: Teloxa  | TVMaze
  </div>
</footer>

<!-- Modal for detail of movie -->

<div id="detailModal" class="modal fade" tabindex="1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content bg-black text-light">
      <div class="modal-header border-secondary">
        <h5 id="detailTitle" class="modal-title">Detail</h5>
        <button class="btn-close btn-close-white" data-bs-dismiss="modals"></button>
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

- ✔️ [Home] (readme.md)
- ❌ [Version 02] (null)
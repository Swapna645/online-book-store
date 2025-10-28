
// Shared book data
const books = [
  { id:1, title:"Harry Potter and the Philosopher's Stone", author:"J.K. Rowling", genre:"Fantasy", price:25.00, rating:5, img:"images/harry.jfif" },
  { id:2, title:"The Alchemist", author:"Paulo Coelho", genre:"Fiction", price:9.50, rating:4, img:"images/alchemist.jfif" },
  { id:3, title:"Atomic Habits", author:"James Clear", genre:"Self Help", price:15.00, rating:5, img:"images/atomic.jfif" },
  { id:4, title:"The Pragmatic Programmer", author:"Andrew Hunt", genre:"Programming", price:38.00, rating:5, img:"images/pragmatic.jfif" },
  { id:5, title:"Clean Code", author:"Robert C. Martin", genre:"Programming", price:28.00, rating:5, img:"images/cleancode.jfif" },
  { id:6, title:"Becoming", author:"Michelle Obama", genre:"Memoir", price:12.00, rating:4, img:"images/becoming.jpg" },
  { id:7, title:"The Hobbit", author:"J.R.R. Tolkien", genre:"Fantasy", price:11.00, rating:4, img:"images/hobbit.jfif" },
  { id:8, title:"Deep Work", author:"Cal Newport", genre:"Self Help", price:14.50, rating:4, img:"images/deepwork.webp" }
];

const STORAGE_CART = 'obs_cart';
const STORAGE_ORDERS = 'obs_orders';
const STORAGE_USERS = 'obs_users';
const STORAGE_AUTH = 'obs_auth';

function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

function updateNavCartCount(){
  const raw = localStorage.getItem(STORAGE_CART);
  let cart = raw ? JSON.parse(raw) : [];
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('navCartCount');
  if(el) el.textContent = count;
}

if(document.getElementById('bookList')){
  const bookListEl = document.getElementById('bookList');
  const searchInput = document.getElementById('searchInput');
  const genreFilter = document.getElementById('genreFilter');
  const ratingFilter = document.getElementById('ratingFilter');
  const priceFilter = document.getElementById('priceFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');

  function populateGenreOptions(){
    const genres = Array.from(new Set(books.map(b=>b.genre))).sort();
    genres.forEach(g=>{ const opt=document.createElement('option'); opt.value=g; opt.textContent=g; genreFilter.appendChild(opt); });
  }

  function renderBooks(arr){
    if(!arr.length){ bookListEl.innerHTML='<p style="grid-column:1/-1;color:#6b7280">No books found.</p>'; return; }
    bookListEl.innerHTML = arr.map(b=>`
      <article class="book" data-id="${b.id}">
        <img class="thumb" src="${b.img}" alt="${b.title}">
        <h3>${b.title}</h3>
        <div class="meta">${b.author} • <span>${b.genre}</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div class="price">$${b.price.toFixed(2)}</div>
          <div class="meta">⭐ ${b.rating}</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn addToCart" data-id="${b.id}">Add to Cart</button>
          <a class="btn" href="book.html?id=${b.id}">Details</a>
        </div>
      </article>
    `).join('');
    $all('.addToCart').forEach(btn=>btn.addEventListener('click', e=>{
      const id = Number(e.currentTarget.dataset.id);
      addToCart(id);
      alert('Added to cart');
      updateNavCartCount();
    }));
  }

  function applyFilters(){
    const q = (searchInput.value||'').trim().toLowerCase();
    const genre = genreFilter.value; const rating = ratingFilter.value; const price = priceFilter.value;
    const filtered = books.filter(b=>{
      const matchesQuery = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesGenre = (genre==='all') || b.genre===genre;
      const matchesRating = (rating==='all') || b.rating >= Number(rating);
      const matchesPrice = (price==='all') || (price==='low'&&b.price<10)||(price==='mid'&&b.price>=10&&b.price<=20)||(price==='high'&&b.price>20);
      return matchesQuery && matchesGenre && matchesRating && matchesPrice;
    });
    renderBooks(filtered);
  }

  populateGenreOptions();
  renderBooks(books);
  updateNavCartCount();

  searchInput.addEventListener('input', applyFilters);
  genreFilter.addEventListener('change', applyFilters);
  ratingFilter.addEventListener('change', applyFilters);
  priceFilter.addEventListener('change', applyFilters);
  clearFiltersBtn.addEventListener('click', ()=>{ searchInput.value=''; genreFilter.value='all'; ratingFilter.value='all'; priceFilter.value='all'; applyFilters(); });
}

if(document.getElementById('bookDetailsWrap')){
  const wrap = document.getElementById('bookDetailsWrap');
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));
  const b = books.find(x=>x.id===id);
  if(!b){ wrap.innerHTML='<p>Book not found.</p>'; }
  else{
    wrap.innerHTML = `
      <div class="details">
        <div><img class="thumb" src="${b.img}" alt="${b.title}"></div>
        <div>
          <h2>${b.title}</h2>
          <div class="meta">by ${b.author} • ${b.genre}</div>
          <p style="margin-top:12px">Rating: ⭐ ${b.rating}</p>
          <h3 style="margin-top:8px">$${b.price.toFixed(2)}</h3>
          <div style="margin-top:12px">
            <button class="btn addToCart" data-id="${b.id}">Add to Cart</button>
            <a class="btn" href="index.html">Back to shop</a>
          </div>
          <div style="margin-top:14px"><strong>Description (demo):</strong><p>This is a demo description for the book.</p></div>
        </div>
      </div>
    `;
    $all('.addToCart').forEach(btn=>btn.addEventListener('click', e=>{ addToCart(Number(e.currentTarget.dataset.id)); alert('Added to cart'); updateNavCartCount(); }));
  }
}

// Cart helpers and exposure
function getCart(){ try{ return JSON.parse(localStorage.getItem(STORAGE_CART)||'[]') }catch(e){ return [] } }
function saveCart(c){ localStorage.setItem(STORAGE_CART, JSON.stringify(c)); updateNavCartCount(); }

function addToCart(id, qty=1){
  const book = books.find(b=>b.id===id);
  if(!book) return;
  const cart = getCart();
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty += qty; } else { cart.push({ id:book.id, title:book.title, price:book.price, qty:qty }); }
  saveCart(cart);
}

window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.updateNavCartCount = updateNavCartCount;

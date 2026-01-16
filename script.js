const products = [
    { id: 1, title: 'Classic T-Shirt', price: 19.99, cat: 'clothing', img: '' },
    { id: 2, title: 'Sneakers', price: 69.99, cat: 'shoes', img: '' },
    { id: 3, title: 'Designer Hat', price: 29.5, cat: 'accessories', img: '' },
    { id: 4, title: 'Jeans', price: 49.99, cat: 'clothing', img: '' },
    { id: 5, title: 'Backpack', price: 39.0, cat: 'accessories', img: '' },
    { id: 6, title: 'Running Socks (3pk)', price: 12.0, cat: 'accessories', img: '' }
];

// assign random images from picsum.photos (unique per load)
products.forEach(p => {
    const seed = `${p.id}-${Math.floor(Math.random()*10000)}`;
    p.img = `https://picsum.photos/seed/${encodeURIComponent(seed)}/320/200`;
});

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

let cart = JSON.parse(localStorage.getItem('cart') || '{}');

function save() { localStorage.setItem('cart', JSON.stringify(cart)); }

function renderProducts(list = products) {
    const wrap = $('#products'); wrap.innerHTML = '';
    list.forEach(p => {
        const el = document.createElement('article'); el.className = 'card';
        el.innerHTML = `
      <div class="media"><img src="${p.img}" alt="${p.title}"></div>
      <div class="title">${p.title}</div>
      <div class="muted">Category: ${p.cat}</div>
      <div class="meta"><div class="price">$${p.price.toFixed(2)}</div><button data-id="${p.id}" class="add">Add</button></div>
    `;
        wrap.appendChild(el);
    });
}

function updateCartUI() {
    const list = $('#cart-items'); list.innerHTML = '';
    const ids = Object.keys(cart);
    let total = 0, count = 0;
    ids.forEach(id => {
        const item = cart[id];
        const prod = products.find(p => p.id == id);
        if (!prod) return;
        total += prod.price * item.qty; count += item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
      <div style="flex:1"><strong>${prod.title}</strong><div class="muted">$${prod.price.toFixed(2)}</div></div>
      <div class="qty">
        <button class="dec" data-id="${id}">-</button>
        <div>${item.qty}</div>
        <button class="inc" data-id="${id}">+</button>
        <button class="remove" data-id="${id}">✕</button>
      </div>
    `;
        list.appendChild(li);
    });
    $('#cart-total').textContent = total.toFixed(2);
    $('#cart-count').textContent = count;
    // attach handlers
    $$('.inc').forEach(b => b.onclick = e => { const id = e.target.dataset.id; cart[id].qty++; save(); updateCartUI(); });
    $$('.dec').forEach(b => b.onclick = e => { const id = e.target.dataset.id; if (cart[id].qty > 1) { cart[id].qty--; } else { delete cart[id]; } save(); updateCartUI(); });
    $$('.remove').forEach(b => b.onclick = e => { const id = e.target.dataset.id; delete cart[id]; save(); updateCartUI(); });
}

function addToCart(id) {
    if (!cart[id]) cart[id] = { qty: 0 }; cart[id].qty++;
    save(); updateCartUI();
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    document.body.addEventListener('click', e => {
        if (e.target.matches('.add')) addToCart(e.target.dataset.id);
    });

    $('#cart-toggle').onclick = () => $('#cart').classList.add('open');
    $('#cart-close').onclick = () => $('#cart').classList.remove('open');
    $('#checkout').onclick = () => { alert('Checkout demo — total: $' + $('#cart-total').textContent); cart = {}; save(); updateCartUI(); };

    $('#search').addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        const filtered = products.filter(p => p.title.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
        renderProducts(filtered);
    });

    // populate categories
    const cats = Array.from(new Set(products.map(p => p.cat)));
    const sel = $('#category-filter');
    cats.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c[0].toUpperCase() + c.slice(1); sel.appendChild(o); });
    sel.addEventListener('change', e => {
        const v = e.target.value; renderProducts(v === 'all' ? products : products.filter(p => p.cat === v));
    });
});


document.addEventListener('DOMContentLoaded', ()=>{
  const auth = JSON.parse(localStorage.getItem('obs_auth')||'null');
  const nameEl = document.getElementById('dashName');
  const ordersEl = document.getElementById('ordersList');
  const totalOrdersEl = document.getElementById('totalOrders');
  const totalItemsEl = document.getElementById('totalItems');
  const totalSpentEl = document.getElementById('totalSpent');
  const totalWishlistEl = document.getElementById('totalWishlist');

  if(!auth){ alert('Please login to view dashboard'); location.href='login.html'; return; }
  nameEl.textContent = auth.name || auth.email;

  const orders = JSON.parse(localStorage.getItem('obs_orders')||'[]').filter(o=>o.user===auth.email);
  totalOrdersEl.textContent = orders.length;
  const items = orders.reduce((s,o)=>s + o.items.reduce((ss,i)=>ss+i.qty,0),0);
  totalItemsEl.textContent = items;
  const spent = orders.reduce((s,o)=>s + o.total,0);
  totalSpentEl.textContent = '$' + spent.toFixed(2);
  totalWishlistEl.textContent = 0;

  if(!orders.length){ ordersEl.innerHTML = '<p>No orders yet. Start shopping <a href="index.html">here</a>.</p>'; }
  else{
    ordersEl.innerHTML = orders.map(o=>`
      <div class="card" style="margin-bottom:10px">
        <div><strong>Order #${o.id}</strong> — ${new Date(o.date).toLocaleString()}</div>
        <div style="margin-top:8px">Items: ${o.items.map(it=>it.title + ' x' + it.qty).join(', ')}</div>
        <div style="margin-top:8px"><strong>Total: $${o.total.toFixed(2)}</strong></div>
      </div>
    `).join('');
  }
});

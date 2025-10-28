
// Cart page script
document.addEventListener('DOMContentLoaded', ()=>{
  const container = document.getElementById('cartContainer');
  if(!container) return;
  renderCart();
});

function renderCart(){
  const cart = window.getCart();
  const container = document.getElementById('cartContainer');
  if(!cart.length){ container.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>'; return; }
  let html = '<table class="cart-table"><thead><tr><th>Book</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  cart.forEach(it=>{ html += `<tr data-id="${it.id}"><td>${it.title}</td><td>$${it.price.toFixed(2)}</td><td><div class="cart-actions"><button class="btn" onclick="changeQty(${it.id},-1)">-</button><span style="padding:0 8px">${it.qty}</span><button class="btn" onclick="changeQty(${it.id},1)">+</button></div></td><td>$${(it.price*it.qty).toFixed(2)}</td><td><button class="btn" onclick="removeFromCart(${it.id})">Remove</button></td></tr>` })
  html += '</tbody></table>';
  const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
  html += `<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center"><div><button class="btn" onclick="clearCart()">Clear Cart</button></div><div><strong>Total: $${total.toFixed(2)}</strong> <button class="btn primary" onclick="proceedCheckout()">Checkout</button></div></div>`;
  container.innerHTML = html;
}

function changeQty(id, delta){
  const cart = window.getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty < 1) { removeFromCart(id); return; }
  window.saveCart(cart);
  renderCart();
}

function removeFromCart(id){
  let cart = window.getCart();
  cart = cart.filter(i=>i.id!==id);
  window.saveCart(cart);
  renderCart();
}

function clearCart(){
  if(confirm('Clear cart?')){ window.saveCart([]); renderCart(); }
}

function proceedCheckout(){
  const auth = JSON.parse(localStorage.getItem('obs_auth')||'null');
  if(!auth){ alert('Please login to proceed to checkout'); location.href='login.html'; return; }
  const orders = JSON.parse(localStorage.getItem('obs_orders')||'[]');
  const cart = window.getCart();
  if(!cart.length){ alert('Cart is empty'); return; }
  const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
  const order = { id:Date.now(), user:auth.email, items:cart, total:total, date:new Date().toISOString() };
  orders.push(order);
  localStorage.setItem('obs_orders', JSON.stringify(orders));
  window.saveCart([]);
  alert('Order placed (demo). Thank you!');
  location.href='dashboard.html';
}

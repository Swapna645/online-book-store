
document.addEventListener('DOMContentLoaded', ()=>{
  const regForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  if(regForm) regForm.addEventListener('submit', e=>{ e.preventDefault(); registerUser(); });
  if(loginForm) loginForm.addEventListener('submit', e=>{ e.preventDefault(); loginUser(); });
  updateAuthNav();
});

function registerUser(){
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const users = JSON.parse(localStorage.getItem('obs_users')||'[]');
  if(users.find(u=>u.email===email)){ alert('Email already registered'); return; }
  users.push({ name, email, password });
  localStorage.setItem('obs_users', JSON.stringify(users));
  alert('Account created. Please login.');
  location.href='login.html';
}

function loginUser(){
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('obs_users')||'[]');
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user){ alert('Invalid credentials'); return; }
  localStorage.setItem('obs_auth', JSON.stringify({ email:user.email, name:user.name }));
  alert('Logged in');
  location.href='dashboard.html';
}

function updateAuthNav(){
  const navAuth = document.getElementById('navAuth');
  const auth = JSON.parse(localStorage.getItem('obs_auth')||'null');
  if(navAuth){
    if(auth){ navAuth.textContent = 'Logout'; navAuth.href='#'; navAuth.addEventListener('click', e=>{ e.preventDefault(); logout(); }); }
    else { navAuth.textContent = 'Login'; navAuth.href='login.html'; }
  }
}

function logout(){ localStorage.removeItem('obs_auth'); alert('Logged out'); location.href='index.html'; }

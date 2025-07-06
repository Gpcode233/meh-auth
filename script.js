// Modal and form switching
const registerBtn = document.getElementById('registerBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const toLogin = document.getElementById('toLogin');
const toRegister = document.getElementById('toRegister');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const congrats = document.getElementById('congrats');
const confettiCanvas = document.getElementById('confetti');

// Show modal
registerBtn.onclick = () => {
  modal.classList.remove('hidden');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
};
closeModal.onclick = () => {
  modal.classList.add('hidden');
};
toLogin.onclick = e => {
  e.preventDefault();
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
};
toRegister.onclick = e => {
  e.preventDefault();
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
};

// Registration
registerForm.onsubmit = e => {
  e.preventDefault();
  const fullName = document.getElementById('fullName').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (!fullName || !username || !email || !password || !confirmPassword) {
    alert('Please fill all fields.');
    return;
  }
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }
  // Check if user exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(u => u.email === email || u.username === username)) {
    alert('User already exists.');
    return;
  }
  users.push({ fullName, username, email, password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Registration successful! You can now login.');
  registerForm.reset();
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
};

// Login
loginForm.onsubmit = e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert('Invalid credentials.');
    return;
  }
  modal.classList.add('hidden');
  showCongrats();
};

// Confetti animation
const showCongrats = () => {
  congrats.classList.remove('hidden');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  launchConfetti();
  setTimeout(() => {
    congrats.classList.add('hidden');
  }, 4000);
};

// Simple confetti
const launchConfetti = () => {
  const ctx = confettiCanvas.getContext('2d');
  const confettiColors = ['#ffb6b9', '#b5ead7', '#f7d6e0', '#f6d365', '#fda085'];
  let confetti = Array(100).fill().map(() => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * -confettiCanvas.height,
    r: Math.random() * 8 + 4,
    d: Math.random() * 40 + 10,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    tilt: Math.random() * 10 - 10
  }));
  let angle = 0;
  const draw = () => {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confetti.map(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
  };
  const update = () => {
    angle += 0.01;
    confetti = confetti.map(c => {
      c.y += (Math.cos(angle + c.d) + 1 + c.r / 2) * 1.2;
      c.x += Math.sin(angle) * 2;
      if (c.y > confettiCanvas.height) {
        c.x = Math.random() * confettiCanvas.width;
        c.y = Math.random() * -20;
      }
      return c;
    });
  };
  let frame = 0;
  const animate = () => {
    if (frame++ < 120) {
      draw();
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  };
  animate();
};

// Close congrats on click
congrats.onclick = () => congrats.classList.add('hidden');

// Responsive confetti
window.onresize = () => {
  if (!congrats.classList.contains('hidden')) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
};

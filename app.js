// Tiny inline SVG icon so you don't need image files
const ICON = "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
  "<rect width='100' height='100' rx='20' fill='%230d1526'/>" +
  "<circle cx='50' cy='50' r='24' fill='%2322c55e'/>" +
  "</svg>";

const SCREEN = "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>" +
  "<rect width='800' height='450' fill='%23121b2f'/>" +
  "<text x='400' y='230' text-anchor='middle' font-size='48' fill='%23e5e7eb' font-family='Arial'>Screenshot</text>" +
  "</svg>";

const APPS = [
  {
    id: "notes",
    name: "Quick Notes",
    category: "Productivity",
    rating: 4.6,
    downloads: "100K+",
    desc: "Fast, clean note-taking with offline support.",
    icon: ICON,
    website: "https://example.com/notes",
    // Replace with your real GitHub Release APK URL:
    apk: "https://github.com/<your-username>/<repo>/releases/download/v1.0.0/quick-notes.apk",
    screens: [SCREEN, SCREEN]
  },
  {
    id: "camera",
    name: "Pro Camera",
    category: "Photography",
    rating: 4.4,
    downloads: "50K+",
    desc: "Manual controls, RAW capture, and crisp results.",
    icon: ICON,
    website: "https://example.com/camera",
    apk: "https://github.com/<your-username>/<repo>/releases/download/v1.0.0/pro-camera.apk",
    screens: [SCREEN, SCREEN]
  },
  {
    id: "runner",
    name: "Fit Runner",
    category: "Health & Fitness",
    rating: 4.7,
    downloads: "250K+",
    desc: "Track runs, analyze stats, and stay motivated.",
    icon: ICON,
    website: "https://example.com/runner",
    apk: "https://github.com/<your-username>/<repo>/releases/download/v1.0.0/fit-runner.apk",
    screens: [SCREEN, SCREEN]
  }
];

const CATEGORIES = ["All","Productivity","Photography","Health & Fitness"];

const grid = document.querySelector('#apps');
const search = document.querySelector('#search');
const chips = document.querySelector('#categoryChips');
const modal = document.querySelector('#appModal');
const modalTitle = document.querySelector('#modalTitle');
const modalDesc = document.querySelector('#modalDesc');
const modalIcon = document.querySelector('#modalIcon');
const modalScreens = document.querySelector('#modalScreens');
const apkLink = document.querySelector('#apkLink');
const websiteLink = document.querySelector('#websiteLink');
const closeModal = document.querySelector('#closeModal');
const installBtn = document.getElementById('installBtn');

let category = "All";

function starify(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "★".repeat(full);
  if(half) s += "½";
  return s.padEnd(5,"☆");
}

function renderChips(){
  chips.innerHTML = "";
  CATEGORIES.forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'chip' + (cat===category ? ' active':'');
    btn.textContent = cat;
    btn.onclick = ()=>{ category = cat; render(); renderChips(); };
    chips.appendChild(btn);
  });
}

function render(){
  const term = search.value.trim().toLowerCase();
  grid.innerHTML = "";
  APPS.filter(a => (category==="All" || a.category===category))
      .filter(a => a.name.toLowerCase().includes(term) || a.desc.toLowerCase().includes(term))
      .forEach(app => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <img class="app-icon" src="${app.icon}" alt="${app.name} icon">
          <div class="info">
            <h3>${app.name}</h3>
            <div class="meta">
              <span>${starify(app.rating)} • ${app.rating.toFixed(1)}</span>
              <span>•</span>
              <span>${app.downloads}</span>
            </div>
            <p>${app.desc}</p>
            <div class="actions">
              <button class="btn" data-id="${app.id}">Details</button>
              <a class="btn ghost" href="${app.apk}" download>Download APK</a>
            </div>
          </div>
        `;
        card.querySelector('button').onclick = ()=>openModal(app);
        grid.appendChild(card);
      });
}

function openModal(app){
  modalTitle.textContent = app.name;
  modalDesc.textContent = app.desc;
  modalIcon.src = app.icon;
  websiteLink.href = app.website;
  apkLink.href = app.apk;
  modalScreens.innerHTML = "";
  app.screens.forEach(s=>{
    const img = document.createElement('img');
    img.src = s;
    img.alt = app.name + " screenshot";
    img.loading = "lazy";
    img.decoding = "async";
    modalScreens.appendChild(img);
  });
  modal.showModal();
}

closeModal.onclick = ()=>modal.close();
modal.addEventListener('click', (e)=>{
  const d = e.currentTarget;
  const rect = d.getBoundingClientRect();
  const inDialog = (rect.top<=e.clientY && e.clientY<=rect.top+rect.height &&
                    rect.left<=e.clientX && e.clientX<=rect.left+rect.width);
  if(!inDialog) d.close();
});

// Search & category
search.addEventListener('input', render);
renderChips();
render();

// Install prompt (PWA)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';
});
installBtn.addEventListener('click', async ()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  }
});

// Register service worker
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js');
  });
}

// Tiny docs
function openDocs(){
  alert(
`How to deploy on GitHub Pages:
1) Upload all files to a public repo.
2) Settings → Pages → Branch: main, Folder: /root → Save.
3) Open the URL. On mobile Chrome, tap ⋮ → Add to Home screen.

To make Download APK real:
- Create a GitHub Release and upload your .apk
- Copy the APK asset URL and set it in app.js (apk:)`
  );
  }

function clearMainContent(){
    document.getElementById('mainContent').innerHTML = '';
}

async function loadDateIdeas(){
    clearMainContent();
    document.getElementById('mainContent').innerHTML += elementTemplate('Ideen werden geladen 💡');
    
    setTimeout(() => {
    loadDateIdeasFromDB('');
    }, 1000);
}

function loadLoveBox2(){
    clearMainContent();
    renderLoveBox2();
}

function loadSettings(){
    clearMainContent();
    renderSettings();
}

function openAddNewDate() {
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
}

function closeAddNewDate() {
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

function goHome(){
    location.reload();
}

function openSpotify(){
    window.open("https://open.spotify.com/playlist/0jwv5EfYUfpoUHdYfKYf1k?si=85dd91ad8eee4438,_blank");
}

function addRandomEmoji(text) {
    const emojis = [
        '🌟','💖','🍀','🎉','😊','🔥','🌸','🍕','☕','🎈',
        '🍩','🐶','🐱','🌈','⭐','🍎','🍓','🍌','🥑','🥳',
        '🎵','🎬','🏖️','🚀','💎','🏔️','🌊','🛶','🦋','🌻'
    ];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const checked = document.getElementById('checkbox').checked;
    if (checked) {
        return text + ' ' + randomEmoji;
    } else {
        return text;
    }
}

async function resetApp() {
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
  }
  window.location.href = window.location.origin;
  console.log('gemacht');
  
}
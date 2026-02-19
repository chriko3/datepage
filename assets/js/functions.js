function clearMainContent(){
    document.getElementById('mainContent').innerHTML = '';
}

async function loadDateIdeas(){
    clearMainContent();
    await loadDateIdeasFromDB('');
}

function loadLoveBox2(){
    clearMainContent();
    renderLoveBox2();
}

function renderDateIdeas(responseToJson) {
    let mainContent = document.getElementById('mainContent');
    mainContent.innerHTML += elementAddButtonTemplate();
    mainContent.innerHTML += elementBackButtonTemplate();
    const keys = Object.keys(responseToJson);
    for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        const dateIdea = responseToJson[key];
        mainContent.innerHTML += elementTemplate(dateIdea, key);
    }
}


function renderLoveBox2(){
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML += elementBackButtonTemplate();

    let backButton = document.getElementById('backButton');
    backButton.classList.add('full-width');


    const targetDate = new Date('2025-11-28');
    mainContent.innerHTML += elementNormalTemplate('28.11.2025 🫶🏻');

    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.abs(Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)));
    mainContent.innerHTML += elementNormalTemplate(`${diffDays} Tage 📆`);

    const mapsIframe = `<iframe 
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d810.4403797459418!2d16.72002487644746!3d48.34228647153582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sde!2sat!4v1771506364053!5m2!1sde!2sat" 
        width="100%" 
        height="250" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>`;

    mainContent.innerHTML += elementNormalTemplate(mapsIframe);
    const elements = mainContent.querySelectorAll('.element');
    const lastElement = elements[elements.length - 1];
    lastElement.classList.add('full-width');
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

function enableSwipeToDelete() {
    const elements = document.querySelectorAll('.element:not(.addButton)');

    elements.forEach(el => {
        const key = el.dataset.key;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        el.addEventListener('pointerdown', e => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            startX = e.clientX;
            isDragging = true;
            el.setPointerCapture(e.pointerId);
        });

        el.addEventListener('pointermove', e => {
            if (!isDragging) return;

            currentX = e.clientX - startX;

            if (currentX > 0) {
                el.style.transform = `translateX(${currentX}px)`;
            }
        });

        el.addEventListener('pointerup', async e => {
            isDragging = false;
            el.releasePointerCapture(e.pointerId);

            if (currentX > el.offsetWidth * 0.35) {
                el.style.transform = `translateX(120%)`;
                el.style.opacity = '0';

                setTimeout(async () => {
                    el.remove();
                    if (key) await deleateFromDB(key);
                }, 300);
            } else {
                el.style.transform = 'translateX(0)';
            }

            currentX = 0;
        });

        el.addEventListener('pointercancel', () => {
            isDragging = false;
            el.style.transform = 'translateX(0)';
            currentX = 0;
        });
    });
}

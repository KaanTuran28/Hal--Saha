// --- Mobil Dokunmatik Ekran Desteği ---
MobileDragDrop.polyfill({
    holdToDrag: 200, 
    dragImageTranslateOverride: MobileDragDrop.scrollBehaviourDragImageTranslateOverride
});
window.addEventListener('touchmove', function() {}, {passive: false});

document.addEventListener('DOMContentLoaded', () => {
    
    const formationsHome = {
        "2-3-1": [ {top:92, left:50}, {top:78, left:30}, {top:78, left:70}, {top:62, left:20}, {top:65, left:50}, {top:62, left:80}, {top:53, left:50} ],
        "3-2-1": [ {top:92, left:50}, {top:80, left:20}, {top:83, left:50}, {top:80, left:80}, {top:62, left:35}, {top:62, left:65}, {top:53, left:50} ],
        "2-2-2": [ {top:92, left:50}, {top:78, left:30}, {top:78, left:70}, {top:65, left:30}, {top:65, left:70}, {top:55, left:35}, {top:55, left:65} ],
        "3-1-2": [ {top:92, left:50}, {top:80, left:20}, {top:82, left:50}, {top:80, left:80}, {top:68, left:50}, {top:56, left:35}, {top:56, left:65} ],
        "1-3-2": [ {top:92, left:50}, {top:75, left:25}, {top:75, left:50}, {top:75, left:75}, {top:55, left:35}, {top:55, left:65} ],
        "2-1-3": [ {top:92, left:50}, {top:82, left:30}, {top:82, left:70}, {top:68, left:50}, {top:52, left:20}, {top:52, left:50}, {top:52, left:80} ]
    };

    const formationsAway = {
        "2-3-1": [ {top:8, left:50}, {top:22, left:30}, {top:22, left:70}, {top:38, left:20}, {top:35, left:50}, {top:38, left:80}, {top:47, left:50} ],
        "3-2-1": [ {top:8, left:50}, {top:20, left:20}, {top:17, left:50}, {top:20, left:80}, {top:38, left:35}, {top:38, left:65}, {top:47, left:50} ],
        "2-2-2": [ {top:8, left:50}, {top:22, left:30}, {top:22, left:70}, {top:35, left:30}, {top:35, left:70}, {top:45, left:35}, {top:45, left:65} ],
        "3-1-2": [ {top:8, left:50}, {top:20, left:20}, {top:18, left:50}, {top:20, left:80}, {top:32, left:50}, {top:44, left:35}, {top:44, left:65} ],
        "1-3-2": [ {top:8, left:50}, {top:25, left:25}, {top:25, left:50}, {top:25, left:75}, {top:45, left:35}, {top:45, left:65} ],
        "2-1-3": [ {top:8, left:50}, {top:18, left:30}, {top:18, left:70}, {top:32, left:50}, {top:48, left:20}, {top:48, left:50}, {top:48, left:80} ]
    };

    let defaultHomePlayers = [];
    let defaultAwayPlayers = [];
    let playerIdCounter = 1;

    const elements = {
        pitch: document.getElementById('pitch'), exportPdfBtn: document.getElementById('exportPdfBtn'),
        poolHome: document.getElementById('playerPoolHome'), formHome: document.getElementById('homeFormationSelect'), inHomeTeam: document.getElementById('homeTeamNameInput'), inHomeMgr: document.getElementById('homeManagerInput'), inHomeNew: document.getElementById('newHomePlayerName'), btnHomeAdd: document.getElementById('addHomePlayerBtn'), disHomeTeam: document.getElementById('displayHomeTeam'), disHomeMgr: document.getElementById('displayHomeManager'),
        poolAway: document.getElementById('playerPoolAway'), formAway: document.getElementById('awayFormationSelect'), inAwayTeam: document.getElementById('awayTeamNameInput'), inAwayMgr: document.getElementById('awayManagerInput'), inAwayNew: document.getElementById('newAwayPlayerName'), btnAwayAdd: document.getElementById('addAwayPlayerBtn'), disAwayTeam: document.getElementById('displayAwayTeam'), disAwayMgr: document.getElementById('displayAwayManager'),
    };

    function init() {
        loadDefaultPlayers();
        renderInitialFormations();
        setupEventListeners();
        setupPitchFreeDrop();
    }

    function loadDefaultPlayers() {
        defaultHomePlayers.forEach(name => createPlayerElement(name, 'home'));
        defaultAwayPlayers.forEach(name => createPlayerElement(name, 'away'));
    }

    function createPlayerElement(name, team) {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player ${team}-player`;
        playerDiv.draggable = true;
        playerDiv.id = `player_${playerIdCounter++}`;
        playerDiv.dataset.team = team; 
        playerDiv.dataset.playerName = name;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        playerDiv.appendChild(nameSpan);

        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'fa-solid fa-times delete-btn';
        deleteBtn.title = 'Oyuncuyu Sil';
        deleteBtn.onclick = function(e) { e.stopPropagation(); playerDiv.remove(); };
        playerDiv.appendChild(deleteBtn);

        playerDiv.addEventListener('dragstart', handleDragStart);
        
        if(team === 'home') elements.poolHome.appendChild(playerDiv);
        else elements.poolAway.appendChild(playerDiv);
    }

    function renderInitialFormations() {
        renderTeamFormation('home', elements.formHome.value);
        renderTeamFormation('away', elements.formAway.value);
    }

    function renderTeamFormation(team, formationKey) {
        const pitchSlots = elements.pitch.querySelectorAll(`.slot-${team} .player`);
        const pool = team === 'home' ? elements.poolHome : elements.poolAway;
        
        pitchSlots.forEach(p => { 
            restorePlayerForPool(p);
            pool.appendChild(p); 
        });

        document.querySelectorAll(`.slot-${team}`).forEach(s => s.remove());

        const coords = team === 'home' ? formationsHome[formationKey] : formationsAway[formationKey];
        coords.forEach(pos => {
            const slot = document.createElement('div');
            slot.className = `slot slot-${team}`; 
            slot.style.top = `${pos.top}%`;
            slot.style.left = `${pos.left}%`;
            
            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('dragenter', handleDragEnter);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleDropToSlot);
            
            // ==========================================
            // YENİ: TIKLAYARAK YEDEKLERDEN SEÇİM EKRANI (MODAL)
            // ==========================================
            slot.addEventListener('click', (e) => {
                if (e.target.closest('.player')) return; // Slot doluyken tıklanırsa işlem yapma
                if (slot.children.length > 0) return;
                
                openPlayerSelectionModal(team, slot);
            });

            elements.pitch.appendChild(slot);
        });
    }

    function openPlayerSelectionModal(team, slot) {
        const pool = team === 'home' ? elements.poolHome : elements.poolAway;
        const benchPlayers = Array.from(pool.querySelectorAll('.player'));

        if (benchPlayers.length === 0) {
            alert('Yedek kulübesinde eklenecek oyuncu bulunmuyor!');
            return;
        }

        // Modal Arka Planı
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

        // Modal Kutusu
        const content = document.createElement('div');
        content.className = 'modal-content';

        const title = document.createElement('h3');
        title.innerHTML = team === 'home' ? '<i class="fa-solid fa-house" style="color:#38bdf8;"></i> Mavi Takımdan Seç' : '<i class="fa-solid fa-plane" style="color:#ef4444;"></i> Kırmızı Takımdan Seç';

        // Oyuncu Listesi (Dropdown)
        const select = document.createElement('select');
        benchPlayers.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.dataset.playerName;
            select.appendChild(opt);
        });

        // Butonlar
        const btnContainer = document.createElement('div');
        btnContainer.className = 'modal-buttons';

        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-cancel';
        btnCancel.textContent = 'İptal';
        btnCancel.onclick = () => overlay.remove();

        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn-confirm';
        btnConfirm.textContent = 'Sahaya Al';
        btnConfirm.onclick = () => {
            const selectedPlayerId = select.value;
            const playerEl = document.getElementById(selectedPlayerId);
            if (playerEl) {
                structurePlayerForPitch(playerEl, false);
                slot.appendChild(playerEl);
            }
            overlay.remove();
        };

        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnConfirm);

        content.appendChild(title);
        content.appendChild(select);
        content.appendChild(btnContainer);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }

    function handleDragStart(e) {
        if(e.target.classList.contains('delete-btn')) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function handleDragEnter(e) {
        e.preventDefault();
        const slot = e.currentTarget;
        if(slot.classList.contains('slot-home')) slot.classList.add('drag-over-home');
        else if(slot.classList.contains('slot-away')) slot.classList.add('drag-over-away');
    }

    function handleDragLeave(e) { e.currentTarget.classList.remove('drag-over-home', 'drag-over-away'); }

    // SLOTA SÜRÜKLEYİP BIRAKMA
    function handleDropToSlot(e) {
        e.preventDefault(); e.stopPropagation();
        const slot = e.currentTarget;
        slot.classList.remove('drag-over-home', 'drag-over-away');
        
        const playerId = e.dataTransfer.getData('text/plain');
        const playerEl = document.getElementById(playerId);
        if (!playerEl) return;

        const playerTeam = playerEl.dataset.team; 

        const isSlotHome = slot.classList.contains('slot-home');
        const isSlotAway = slot.classList.contains('slot-away');

        if ((playerTeam === 'home' && isSlotAway) || (playerTeam === 'away' && isSlotHome)) {
            alert("HATA: Oyuncu kendi takımının sahasına yerleştirilmeli!"); return;
        }

        if (slot.children.length === 0) {
            structurePlayerForPitch(playerEl, false);
            slot.appendChild(playerEl);
        }
    }

    // SAHAYA SERBEST BIRAKMA 
    function setupPitchFreeDrop() {
        elements.pitch.addEventListener('dragover', (e) => e.preventDefault());
        elements.pitch.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.target.closest('.slot') || e.target.classList.contains('player')) return;

            const playerId = e.dataTransfer.getData('text/plain');
            const playerEl = document.getElementById(playerId);
            if (!playerEl) return;

            const rect = elements.pitch.getBoundingClientRect();
            let clientX = e.clientX; let clientY = e.clientY;
            
            if(e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX; clientY = e.changedTouches[0].clientY;
            }

            let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            let y = Math.max(0, Math.min(clientY - rect.top, rect.height));

            structurePlayerForPitch(playerEl, true);
            playerEl.style.position = 'absolute';
            playerEl.style.left = `${(x / rect.width) * 100}%`;
            playerEl.style.top = `${(y / rect.height) * 100}%`;
            playerEl.style.transform = 'translate(-50%, -50%)';

            elements.pitch.appendChild(playerEl);
        });
    }

    // ==========================================
    // KULÜBEYE GERİ ALMA (HATA KESİN ÇÖZÜLDÜ)
    // ==========================================
    [elements.poolHome, elements.poolAway].forEach(pool => {
        pool.addEventListener('dragover', (e) => e.preventDefault());
        pool.addEventListener('drop', (e) => {
            e.preventDefault();
            const playerId = e.dataTransfer.getData('text/plain');
            const playerEl = document.getElementById(playerId);
            if(!playerEl) return;

            // Takım verisi her zaman güvence altında (DOM üzerinden okunur)
            const playerTeam = playerEl.dataset.team; 

            if((playerTeam === 'home' && pool.id === 'playerPoolHome') || (playerTeam === 'away' && pool.id === 'playerPoolAway')) {
                restorePlayerForPool(playerEl);
                pool.appendChild(playerEl);
            } else {
                alert("Oyuncu sadece kendi yedek kulübesine dönebilir.");
            }
        });
    });

    // --- YAPISAL DÖNÜŞÜM FONKSİYONLARI ---
    function structurePlayerForPitch(playerEl, isFree = false) {
        const name = playerEl.dataset.playerName || 'Oyuncu';
        playerEl.innerHTML = ''; 
        
        if (isFree) {
            playerEl.classList.add('on-pitch-free');
        } else {
            playerEl.classList.remove('on-pitch-free');
            playerEl.style.cssText = ''; 
        }

        const label = document.createElement('span');
        label.textContent = name;
        playerEl.appendChild(label);
    }

    function restorePlayerForPool(playerEl) {
        const name = playerEl.dataset.playerName || 'Oyuncu';
        playerEl.classList.remove('on-pitch-free');
        playerEl.style.cssText = ''; 
        playerEl.innerHTML = '';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        playerEl.appendChild(nameSpan);

        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'fa-solid fa-times delete-btn';
        deleteBtn.title = 'Oyuncuyu Sil';
        deleteBtn.onclick = function(e) { e.stopPropagation(); playerEl.remove(); };
        playerEl.appendChild(deleteBtn);
    }

    function setupEventListeners() {
        elements.formHome.addEventListener('change', (e) => renderTeamFormation('home', e.target.value));
        elements.inHomeTeam.addEventListener('input', (e) => elements.disHomeTeam.textContent = e.target.value || 'EV SAHİBİ');
        elements.inHomeMgr.addEventListener('input', (e) => elements.disHomeMgr.textContent = e.target.value || '-');
        elements.btnHomeAdd.addEventListener('click', () => addCustomPlayer('home'));
        elements.inHomeNew.addEventListener('keypress', (e) => { if(e.key === 'Enter') addCustomPlayer('home') });

        elements.formAway.addEventListener('change', (e) => renderTeamFormation('away', e.target.value));
        elements.inAwayTeam.addEventListener('input', (e) => elements.disAwayTeam.textContent = e.target.value || 'DEPLASMAN');
        elements.inAwayMgr.addEventListener('input', (e) => elements.disAwayMgr.textContent = e.target.value || '-');
        elements.btnAwayAdd.addEventListener('click', () => addCustomPlayer('away'));
        elements.inAwayNew.addEventListener('keypress', (e) => { if(e.key === 'Enter') addCustomPlayer('away') });

        elements.exportPdfBtn.addEventListener('click', exportTacticsPDF);
    }

    function addCustomPlayer(team) {
        const input = team === 'home' ? elements.inHomeNew : elements.inAwayNew;
        const name = input.value.trim();
        if (name) { createPlayerElement(name, team); input.value = ''; }
    }

    function exportTacticsPDF() {
        const element = document.getElementById('export-area');
        const pitch = document.getElementById('pitch');
        
        const hName = elements.inHomeTeam.value || 'EvSahibi';
        const aName = elements.inAwayTeam.value || 'Deplasman';
        
        const pitchRect = pitch.getBoundingClientRect();
        pitch.style.width = pitchRect.width + 'px';
        pitch.style.height = pitchRect.height + 'px';
        element.style.height = 'auto'; 
        element.style.maxWidth = '100%';

        const btn = elements.exportPdfBtn;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> İndiriliyor...';
        btn.style.pointerEvents = 'none';

        const opt = {
            margin: 5,
            filename: `${hName}-vs-${aName}-Taktik.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#080a10', scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            pitch.style.width = '';
            pitch.style.height = '';
            element.style.height = '';
            element.style.maxWidth = '';
            btn.innerHTML = originalText;
            btn.style.pointerEvents = 'auto';
        });
    }

    init();
});
// ================== حركة فك قفل الصوت للجوالات 🔓 ==================
let audioUnlocked = false;

window.addEventListener('touchstart', function() {
    if (!audioUnlocked) {
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            audio.volume = 0; 
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 1; 
                }).catch(error => {});
            }
        });
        audioUnlocked = true;
    }
}, { once: true });

// ================== الاهتزاز والتأثيرات الصوتية ==================
window.hapticLight = () => {
    if (navigator.vibrate) navigator.vibrate(15);
};

// الاستماع لأي ضغطة في التطبيق
document.addEventListener('click', (e) => {
    // 1. تشغيل صوت الكليك لأي زر، أيقونة، أو خيار
    const isClickable = e.target.closest('button, .dock-item, .margin-icon, .theme-btn, .method-store-btn, .check-item input, .task-text');
    if(isClickable) {
        const clickAudio = document.getElementById('click-sound');
        if(clickAudio) {
            clickAudio.currentTime = 0; // يرجع الصوت من البداية عشان لو ضغطت بسرعة
            clickAudio.play().catch(err => {});
        }
    }

    // 2. تأثير اللمس السحري البصري
    if(e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
});

// ================== نظام التنقل المستقر ==================
window.showSection = (sectionId) => {
    hapticLight();
    
    // إخفاء جميع الأقسام فوراً
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // إظهار القسم المطلوب
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'flex';
        setTimeout(() => activeSection.classList.add('active'), 10);
        if(sectionId === 'vision-section') window.loadNewVisionBoard();
    }
};

window.switchView = (viewId, dockElement) => {
    document.querySelectorAll('.dock-item').forEach(item => item.classList.remove('active'));
    dockElement.classList.add('active');
    window.showSection(viewId);
};

// ================== نظام الليل والنهار ==================
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        hapticLight();
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('method-theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('method-theme', 'light');
        }
    });
}

if (localStorage.getItem('method-theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if(themeToggle) themeToggle.textContent = '☀️';
}

// ================== الفعاليات ==================
const marginDisplay = document.getElementById('margin-display');

window.openMarginFeature = (feature, element) => {
    hapticLight();
    document.querySelectorAll('.margin-icon').forEach(icon => icon.classList.remove('active'));
    if(element) element.classList.add('active');

    if (feature === 'incinerator') {
        marginDisplay.innerHTML = `
            <h3 style="margin-bottom:10px; color:var(--text-dark);">المحرقة الرقمية 🔥</h3>
            <p style="font-size:13px; color:var(--text-light); margin-bottom:20px;">اكتب ما يزعجك، ثم احرقه للأبد.</p>
            <textarea id="burn-text" class="clean-input" rows="4" placeholder="أفرغ أفكارك هنا..."></textarea>
            <button class="clean-btn" style="background:#ff6b6b; color:#fff;" onclick="burnIt()">أشعل النار 🔥</button>
            <div id="burn-area" style="margin-top:20px;"></div>
        `;
    }
    else if (feature === 'checklist') {
        marginDisplay.innerHTML = `
            <h3 style="margin-bottom:10px; color:var(--text-dark);">قائمة المهام ✅</h3>
            <p style="font-size:13px; color:var(--text-light); margin-bottom:15px;">رتب أفكارك ومهامك اليومية.</p>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <input type="text" id="new-task-input" class="clean-input" style="margin:0;" placeholder="مهمة جديدة...">
                <button class="clean-btn" style="width:auto; margin:0; padding:0 20px;" onclick="addChecklistItem()">إضافة</button>
            </div>
            <div id="checklist-container" style="max-height: 200px; overflow-y: auto; padding-left: 5px;"></div>
        `;
        renderChecklist();
    }
    else if (feature === 'breathe') {
        marginDisplay.innerHTML = `
            <h3 style="margin-bottom:10px; color:var(--text-dark);">فقاعة التنفس 🧘🏻‍♂️</h3>
            <p style="font-size:13px; color:var(--text-light); margin-bottom:20px;">شهيق مع التمدد.. زفير مع الانكماش.</p>
            <div class="breathe-bubble"></div>
        `;
    }
};

window.burnIt = () => {
    const input = document.getElementById('burn-text');
    if(!input || !input.value.trim()) return;
    hapticLight();
    
    const paper = document.createElement('div');
    paper.className = 'paper-slip';
    paper.textContent = input.value;
    document.getElementById('burn-area').appendChild(paper);
    
    const fireAudio = document.getElementById('audio-fire');
    if(fireAudio) { 
        fireAudio.volume = 0.5; 
        fireAudio.play(); 
        setTimeout(() => { 
            fireAudio.pause(); 
            fireAudio.currentTime = 0; 
        }, 2000); 
    }
    
    input.value = '';
    setTimeout(() => { 
        paper.classList.add('burning'); 
        setTimeout(() => paper.remove(), 1500); 
    }, 100);
};

// ================== المهام ==================
window.addChecklistItem = () => {
    hapticLight();
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if(!text) return;
    const tasks = JSON.parse(localStorage.getItem('method-checklist') || "[]");
    tasks.push({ text: text, done: false });
    localStorage.setItem('method-checklist', JSON.stringify(tasks));
    input.value = '';
    renderChecklist();
};

window.toggleChecklistItem = (index) => {
    hapticLight();
    const tasks = JSON.parse(localStorage.getItem('method-checklist') || "[]");
    tasks[index].done = !tasks[index].done;
    localStorage.setItem('method-checklist', JSON.stringify(tasks));
    renderChecklist();
};

window.deleteChecklistItem = (index) => {
    hapticLight();
    const tasks = JSON.parse(localStorage.getItem('method-checklist') || "[]");
    tasks.splice(index, 1);
    localStorage.setItem('method-checklist', JSON.stringify(tasks));
    renderChecklist();
};

window.renderChecklist = () => {
    const container = document.getElementById('checklist-container');
    if(!container) return;
    const tasks = JSON.parse(localStorage.getItem('method-checklist') || "[]");
    if(tasks.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size:13px; color:var(--text-light); margin-top:20px;">القائمة فارغة.</p>';
        return;
    }
    container.innerHTML = tasks.map((task, index) => `
        <div class="check-item ${task.done ? 'done' : ''}">
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleChecklistItem(${index})" style="accent-color: var(--color-2); transform: scale(1.2); cursor:pointer;">
            <span class="task-text" onclick="toggleChecklistItem(${index})">${task.text}</span>
            <button class="del-task-btn" onclick="deleteChecklistItem(${index})">✕</button>
        </div>
    `).join('');
};

// ================== المحرر والأرشيف ==================
window.formatText = (cmd, value = null) => {
    hapticLight();
    document.execCommand(cmd, false, value);
    document.getElementById('rich-editor').focus();
};

window.saveEditor = () => {
    const editor = document.getElementById('rich-editor');
    const content = editor.innerHTML.trim();
    if(!content || content === '<br>' || content === '<div><br></div>') { 
        alert('الرجاء كتابة شيء أولاً ✍️'); 
        return; 
    }
    const notes = JSON.parse(localStorage.getItem('method-notes-archive') || "[]");
    const date = new Date().toLocaleDateString('ar-SA'); 
    notes.unshift({ date: date, text: content }); 
    localStorage.setItem('method-notes-archive', JSON.stringify(notes));
    editor.innerHTML = ''; 
    alert('تم الحفظ بنجاح! ✨');
    if(typeof window.renderNotesList === 'function') window.renderNotesList();
};

window.toggleSavedNotes = () => {
    hapticLight();
    const editorSpace = document.getElementById('editor-workspace');
    const notesSpace = document.getElementById('saved-notes-workspace');
    if(editorSpace.style.display === 'none') {
        editorSpace.style.display = 'flex';
        notesSpace.style.display = 'none';
    } else {
        editorSpace.style.display = 'none';
        notesSpace.style.display = 'flex';
        renderNotesList();
    }
};

window.deleteNote = (index) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        const notes = JSON.parse(localStorage.getItem('method-notes-archive') || "[]");
        notes.splice(index, 1); 
        localStorage.setItem('method-notes-archive', JSON.stringify(notes));
        window.renderNotesList(); 
    }
};

window.renderNotesList = () => {
    const notes = JSON.parse(localStorage.getItem('method-notes-archive') || "[]");
    const list = document.getElementById('notes-list');
    if(!list) return;
    if(notes.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-light); margin-top:40px;">الأرشيف فارغ.</p>';
        return;
    }
    list.innerHTML = notes.map((note, index) => `
        <div class="log-card">
            <span class="log-date">📅 ${note.date}</span>
            <div style="font-size:15px; color:var(--text-dark); line-height:1.6;">${note.text}</div>
            <button class="clean-btn" style="background:transparent; color:#ff6b6b; box-shadow:none; padding:5px; margin-top:10px; width:auto; font-size:12px;" onclick="window.deleteNote(${index})">🗑️ حذف</button>
        </div>
    `).join('');
};

// ================== الاستوديو ==================
const tracks = ['rain', 'fire', 'cafe', 'lofi'];
tracks.forEach(track => {
    const slider = document.getElementById(`vol-${track}`);
    const audio = document.getElementById(`audio-${track}`);
    if(slider && audio) {
        slider.addEventListener('input', (e) => {
            const vol = e.target.value / 100;
            audio.volume = vol;
            if(vol > 0 && audio.paused) audio.play();
            else if (vol === 0 && !audio.paused) audio.pause();
        });
    }
});

// ================== لوحة الإلهام ==================
window.loadNewVisionBoard = () => {
    const images = JSON.parse(localStorage.getItem('method-vision-v2') || "[]");
    const board = document.getElementById('new-vision-board');
    if (!board) return;
    if (images.length === 0) {
        board.innerHTML = '<p style="grid-column: span 2; text-align: center; color: var(--text-light); margin-top: 20px;">اللوحة فارغة.</p>';
        return;
    }
    board.innerHTML = images.map((imgSrc, index) => `
        <div class="vision-item">
            <img src="${imgSrc}" alt="إلهام">
            <button class="delete-btn" onclick="window.removeVisionImage(${index})">✕</button>
        </div>
    `).join('');
};

window.removeVisionImage = (index) => {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        const images = JSON.parse(localStorage.getItem('method-vision-v2') || "[]");
        images.splice(index, 1);
        localStorage.setItem('method-vision-v2', JSON.stringify(images));
        window.loadNewVisionBoard();
    }
};

window.addNewImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار صورة صالحة.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;
            if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } }
            else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            try {
                const board = JSON.parse(localStorage.getItem('method-vision-v2') || "[]");
                board.push(compressedDataUrl);
                localStorage.setItem('method-vision-v2', JSON.stringify(board));
                window.loadNewVisionBoard();
            } catch (error) {
                alert('مساحة التخزين ممتلئة! يرجى حذف صور قديمة.');
            }
        };
    };
    reader.readAsDataURL(file);
};

window.downloadNewVisionBoard = () => {
    const boardArea = document.getElementById('new-vision-board'); 
    if (!boardArea) return;
    
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => btn.style.visibility = 'hidden');

    html2canvas(boardArea, {
        useCORS: true,
        backgroundColor: document.body.classList.contains('dark-mode') ? '#1a1a2e' : '#ffcbf2', 
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'لوحة_إلهام.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        deleteButtons.forEach(btn => btn.style.visibility = 'visible');
    }).catch(err => {
        deleteButtons.forEach(btn => btn.style.visibility = 'visible');
        alert('حدث خطأ أثناء حفظ اللوحة.');
    });
};

window.loadNewVisionBoard();
// ================== حركة فك قفل الصوت للجوالات 🔓 ==================
let audioUnlocked = false;

window.addEventListener('touchstart', function() {
    if (!audioUnlocked) {
        // نجيب كل الأصوات اللي في التطبيق
        const allAudios = document.querySelectorAll('audio');
        
        allAudios.forEach(audio => {
            // نشغلها ونوقفها بصمت فوراً بس عشان ناخذ التصريح
            audio.volume = 0; 
            let playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 0; // نرجع الصوت لطبيعته للمرات الجاية
                }).catch(error => {
                    // نتجاهل الخطأ لو صار
                });
            }
        });
        
        audioUnlocked = true; // كذا فكينا القفل خلاص!
    }
}, { once: true }); // تتنفذ مرة وحدة بس أول ما تلمس الشاشة
// ===================================================================

// دالة الاهتزاز الخفيف (Haptic Feedback)
window.hapticLight = () => {
    if (navigator.vibrate) navigator.vibrate(15);
};

// --- نظام التنقل بين الصفحات (Dock Navigation) ---
window.switchView = (viewId, dockElement) => {
    hapticLight();
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.dock-item').forEach(item => item.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    dockElement.classList.add('active');
};

// --- نظام الليل والنهار ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    hapticLight();
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
});
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

// ================== برمجة فعاليات الهامش الجانبي ==================
const marginDisplay = document.getElementById('margin-display');

window.openMarginFeature = (feature, element) => {
    hapticLight();
    
    // تفعيل الأيقونة بصرياً
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
            <p style="font-size:13px; color:var(--text-light); margin-bottom:15px;">رتبّ أفكارك ومهامك اليومية.</p>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <input type="text" id="new-task-input" class="clean-input" style="margin:0;" placeholder="مهمة جديدة...">
                <button class="clean-btn" style="width:auto; margin:0; padding:0 20px;" onclick="addChecklistItem()">إضافة</button>
            </div>
            <div id="checklist-container" style="max-height: 250px; overflow-y: auto; padding-left: 5px;"></div>
        `;
        renderChecklist();
    }
    else if (feature === 'breathe') {
        marginDisplay.innerHTML = `
            <h3 style="margin-bottom:10px; color:var(--text-dark);">فقاعة التنفس 🧘🏻‍♀️</h3>
            <p style="font-size:13px; color:var(--text-light); margin-bottom:20px;">شهيق مع التمدد.. زفير مع الانكماش.</p>
            <div class="breathe-bubble"></div>
            <p style="margin-top: 60px; font-size:12px; color:var(--text-light); text-align:center;">(شغل صوت المطر من الاستوديو لروقان تام 🌧️)</p>
        `;
    }
};

// --- وظيفة المحرقة 🔥 ---
window.burnIt = () => {
    const input = document.getElementById('burn-text');
    if(!input.value.trim()) return;
    hapticLight();
    const paper = document.createElement('div');
    paper.className = 'paper-slip';
    paper.textContent = input.value;
    document.getElementById('burn-area').appendChild(paper);
    
    const fireAudio = document.getElementById('audio-fire');
    if(fireAudio) { fireAudio.volume = 0.5; fireAudio.play(); setTimeout(() => fireAudio.pause(), 2000); }
    
    input.value = '';
    setTimeout(() => { paper.classList.add('burning'); setTimeout(() => paper.remove(), 1500); }, 100);
};

// --- وظائف قائمة المهام (Checklist) ✅ ---
window.addChecklistItem = () => {
    hapticLight();
    const input = document.getElementById('new-task-input');
    const text = input.value.trim();
    if(!text) return; // ما يضيف مهمة فاضية
    
    const tasks = JSON.parse(localStorage.getItem('fofo-checklist') || "[]");
    tasks.push({ text: text, done: false });
    localStorage.setItem('fofo-checklist', JSON.stringify(tasks));
    
    input.value = '';
    renderChecklist();
};

window.toggleChecklistItem = (index) => {
    hapticLight();
    const tasks = JSON.parse(localStorage.getItem('fofo-checklist') || "[]");
    tasks[index].done = !tasks[index].done; // يعكس الحالة (مكتمل/غير مكتمل)
    localStorage.setItem('fofo-checklist', JSON.stringify(tasks));
    renderChecklist();
};

window.deleteChecklistItem = (index) => {
    hapticLight();
    const tasks = JSON.parse(localStorage.getItem('fofo-checklist') || "[]");
    tasks.splice(index, 1);
    localStorage.setItem('fofo-checklist', JSON.stringify(tasks));
    renderChecklist();
};

window.renderChecklist = () => {
    const container = document.getElementById('checklist-container');
    if(!container) return;
    const tasks = JSON.parse(localStorage.getItem('fofo-checklist') || "[]");
    
    if(tasks.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size:13px; color:var(--text-light); margin-top:20px;">القائمة فاضية.. يا حظك! 😉</p>';
        return;
    }
    
    container.innerHTML = tasks.map((task, index) => `
        <div class="check-item ${task.done ? 'done' : ''}">
            <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleChecklistItem(${index})" style="accent-color: var(--color-2); transform: scale(1.2); cursor:pointer;">
            <span class="task-text" onclick="toggleChecklistItem(${index})">${task.text}</span>
            <button class="del-task-btn" onclick="deleteChecklistItem(${index})" title="حذف">✕</button>
        </div>
    `).join('');
};
// ================== برمجة لوحة الإلهام الجديدة ==================
const newVisionBoard = document.getElementById('new-vision-board');

// 1. عرض الصور
window.loadNewVisionBoard = () => {
    // استخدمنا اسم جديد في الذاكرة عشان ما يتداخل مع القديم الخربان
    const images = JSON.parse(localStorage.getItem('method-vision-data-v2') || "[]");
    if (!newVisionBoard) return;
    
    if (images.length === 0) {
        newVisionBoard.innerHTML = '<p style="grid-column: span 2; text-align: center; color: #aaa; margin-top: 20px;">اللوحة فارغة.. ابدأ بإضافة صورك للإلهام! ✨</p>';
        return;
    }
    
    newVisionBoard.innerHTML = images.map((imgSrc, index) => `
        <div class="vision-item">
            <img src="${imgSrc}" alt="إلهام">
            <button class="delete-btn" onclick="window.removeVisionImage(${index})">✕</button>
        </div>
    `).join('');
};

// 2. حذف صورة
window.removeVisionImage = (index) => {
    if (confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
        const images = JSON.parse(localStorage.getItem('method-vision-data-v2') || "[]");
        images.splice(index, 1);
        localStorage.setItem('method-vision-data-v2', JSON.stringify(images));
        window.loadNewVisionBoard();
    }
};

// 3. إضافة وضغط الصورة
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

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

            try {
                const board = JSON.parse(localStorage.getItem('method-vision-data-v2') || "[]");
                board.push(compressedDataUrl);
                localStorage.setItem('method-vision-data-v2', JSON.stringify(board));
                window.loadNewVisionBoard();
            } catch (error) {
                alert('مساحة التخزين ممتلئة! يرجى حذف بعض الصور القديمة.');
            }
        };
    };
    reader.readAsDataURL(file);
};

// ================== دالة تصوير وحفظ لوحة الإلهام (النسخة الذكية) 📸 ==================
window.downloadNewVisionBoard = () => {
    const boardArea = document.getElementById('new-vision-board'); 
    if (!boardArea) return;

    // تنبيه بسيط
    console.log("جاري تجهيز الصورة بدون أزرار الحذف...");

    html2canvas(boardArea, {
        useCORS: true,
        backgroundColor: '#1e1e1e', 
        scale: 2,
        // هذا الجزء السحري: يقوم بإخفاء أزرار الحذف فقط وقت التصوير
        onclone: (clonedDoc) => {
            const deleteButtons = clonedDoc.querySelectorAll('.delete-btn');
            deleteButtons.forEach(btn => btn.style.display = 'none');
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'لوحة_إلهام_ميثود.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        alert('حدث خطأ أثناء حفظ اللوحة، يرجى المحاولة مرة أخرى.');
    });
};
// التشغيل المبدئي
window.loadNewVisionBoard();
// ================== برمجة استوديو الترددات 🎧 ==================
const tracks = ['rain', 'fire', 'cafe', 'lofi'];
tracks.forEach(track => {
    const slider = document.getElementById(`vol-${track}`);
    const audio = document.getElementById(`audio-${track}`);
    if(slider && audio) {
        audio.volume = 0;
        slider.addEventListener('input', (e) => {
            const vol = e.target.value / 100;
            audio.volume = vol;
            if(vol > 0 && audio.paused) audio.play();
            else if (vol === 0 && !audio.paused) audio.pause();
        });
    }
});
// ================== برمجة المحرر الحر (ونظام الأرشيف) ✍️ ==================
window.formatText = (cmd, value = null) => {
    hapticLight();
    document.execCommand(cmd, false, value);
    document.getElementById('rich-editor').focus();
};

window.saveEditor = () => {
    // نجيب مساحة الكتابة
    const editor = document.getElementById('rich-editor');
    const content = editor.innerHTML.trim();
    
    // نتأكد إن الهامش مو فاضي أو فيه مسافات بس
    if(!content || content === '<br>' || content === '<div><br></div>') { 
        alert('الهامش فاضي! اكتب شيء أول ✍️'); 
        return; 
    }

    // نجيب الأرشيف من الذاكرة أو نسوي واحد جديد
    const notes = JSON.parse(localStorage.getItem('ميثود-notes-archive') || "[]");
    const date = new Date().toLocaleDateString('ar-SA'); 
    
    // نضيف الهامش الجديد
    notes.unshift({ date: date, text: content }); 
    localStorage.setItem('ميثود-notes-archive', JSON.stringify(notes));
    
    // نفرغ الشاشة ونعطي رسالة نجاح
    editor.innerHTML = ''; 
    alert('تم حفظ هامشك في الأرشيف بنجاح! ✨');
    
    // نحدث العرض فوراً
    if(typeof window.renderNotesList === 'function') {
        window.renderNotesList();
    }
};

window.toggleSavedNotes = () => {
    hapticLight();
    const editorSpace = document.getElementById('editor-workspace');
    const notesSpace = document.getElementById('saved-notes-workspace');
    
    // تبديل بين شاشة الكتابة وشاشة الأرشيف
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
    // رسالة تأكيد أنيقة عشان ما ينحذف شيء بالغلط
    if (confirm("متأكد تبي تحذف هذا الهامش؟ 🥺🗑️")) {
        const notes = JSON.parse(localStorage.getItem('ميثود-notes-archive') || "[]");
        notes.splice(index, 1); // يحذف العنصر من القائمة
        localStorage.setItem('ميثود-notes-archive', JSON.stringify(notes));
        window.renderNotesList(); // يحدّث العرض فوراً
    }
};

window.renderNotesList = () => {
    const notes = JSON.parse(localStorage.getItem('ميثود-notes-archive') || "[]");
    const list = document.getElementById('notes-list');
    
    if(notes.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:var(--text-light); margin-top:40px;">الأرشيف فاضي.. ابدأ بكتابة أول هامش! 🤍</p>';
        return;
    }
    
    // لاحظي هنا ربطنا زر الحذف بـ window.deleteNote مباشرة عشان ما يعلق
    list.innerHTML = notes.map((note, index) => `
        <div class="log-card">
            <span class="log-date">📅 ${note.date}</span>
            <div style="font-size:15px; color:var(--text-dark); line-height:1.6;">${note.text}</div>
            <button class="clean-btn" style="background:transparent; color:#ff6b6b; box-shadow:none; padding:5px; margin-top:10px; width:auto; font-size:12px;" onclick="window.deleteNote(${index})">🗑️ حذف</button>
        </div>
    `).join('');
};

// ================== تأثير اللمس السحري ✨ ==================
document.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
});


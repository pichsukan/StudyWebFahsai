// --- ส่วนการตั้งค่าระบบเสียง ---
const clickSound = new Audio('sound.wav'); 
const bgMusic = new Audio('backsound.ogg'); 

bgMusic.loop = true;  // เล่นวนซ้ำ
bgMusic.volume = 0.3; // ความดัง 30%

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// เริ่มเพลงพื้นหลังเมื่อมีการคลิกครั้งแรก (ตามกฎ Browser)
window.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
}, { once: true });

// ทำให้ทุกปุ่มที่มีอยู่ตอนนี้มีเสียงคลิก และโหลดงานที่เคยบันทึกไว้ขึ้นมา
window.addEventListener('DOMContentLoaded', () => {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });
    
    // โหลดงานขึ้นมาแสดงทันทีที่เปิดเว็บ
    renderTasks();
});

// --- ระบบจัดการข้อมูลและหน้าเว็บ ---

// 1. ดึงข้อมูลเก่าจาก localStorage (ถ้าเพิ่งเข้าเว็บครั้งแรก ให้เป็นอาร์เรย์ว่าง [])
let tasks = JSON.parse(localStorage.getItem('studyweb_saved_tasks')) || []; 

// ฟังก์ชันใหม่: เอาไว้เซฟข้อมูลลงในเครื่อง
function saveToLocalStorage() {
    localStorage.setItem('studyweb_saved_tasks', JSON.stringify(tasks));
}

function showPage(pageId) {
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('addtaskpage').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
}

function showPopup() { document.getElementById('subjectpopup').style.display = 'block'; }
function hidePopup() { document.getElementById('subjectpopup').style.display = 'none'; }

function selectSubject(name) {
    document.getElementById('subject-display').innerText = name;
    hidePopup();
}

function saveTask() {
    const subject = document.getElementById('subject-display').innerText;
    const work = document.getElementById('work-input').value;
    const date = document.getElementById('date-input').value;

    if (tasks.length >= 10) {
        alert("รายการงานเต็มแล้ว (สูงสุด 10 อย่าง)");
        return;
    }

    // เพิ่มงานใหม่เข้าไป
    tasks.push({ subject, work, date });
    
    // 2. บันทึกลง localStorage ทันทีที่มีการเพิ่มงาน
    saveToLocalStorage(); 
    
    renderTasks(); 
    
    // ล้างค่าในช่องกรอก
    document.getElementById('work-input').value = "";
    document.getElementById('date-input').value = "";
    document.getElementById('subject-display').innerText = "Subject";
    
    showPage('homepage');
}

function deleteTask(index) {
    // ลบงานออก
    tasks.splice(index, 1);
    
    // 3. บันทึกลง localStorage อัปเดตข้อมูลทันทีที่ลบงาน
    saveToLocalStorage(); 
    
    renderTasks();
}

function renderTasks() {
    const container = document.getElementById('task-container');
    container.innerHTML = ""; 

    tasks.forEach((task, index) => {
        const slotIndex = index + 1; 
        const card = document.createElement('div');
        card.className = `taskcard-item slot-${slotIndex}`;
        card.innerHTML = `
            <div class="taskcardlayout"></div>
            <div class="task-subject">${task.subject}</div>
            <div class="task-work">${task.work}</div>
            <div class="task-date">${task.date}</div>
            <button class="deletetaskbutton"></button>
        `;
        
        // ใส่ Event เสียงคลิกให้ปุ่มลบที่สร้างขึ้นใหม่
        const delBtn = card.querySelector('.deletetaskbutton');
        delBtn.onclick = () => deleteTask(index);
        delBtn.addEventListener('click', playClickSound);

        container.appendChild(card);
    });
}
let currentTeacherName = "";
let blinkInterval = null;

const authSection = document.getElementById('authSection');
const mainSection = document.getElementById('mainSection');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const leaveBtn = document.getElementById('leaveBtn');
const alertBox = document.getElementById('alertBox');
const noNotification = document.getElementById('noNotification');

if (Notification.permission === "default") {
    Notification.requestPermission();
}

window.addEventListener('load', () => {
    const sessionTeacher = sessionStorage.getItem('currentTabTeacher');
    if (sessionTeacher) {
        currentTeacherName = sessionTeacher;
        showDashboard();
    }
});

registerBtn.addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const pw = document.getElementById('regPw').value.trim();

    if (!name || !pw) {
        alert('성함과 비밀번호를 입력해주세요!');
        return;
    }

    currentTeacherName = name;

    const allTeachers = JSON.parse(localStorage.getItem('allTeachersList') || "[]");
    if (!allTeachers.includes(name)) {
        allTeachers.push(name);
        localStorage.setItem('allTeachersList', JSON.stringify(allTeachers));
    }

    sessionStorage.setItem('currentTabTeacher', name);
    showDashboard();
});

function showDashboard() {
    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    document.getElementById('welcomeMessage').innerText = `안녕하세요, ${currentTeacherName} 선생님`;
    startListening();
}

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('currentTabTeacher');
    resetUI();
});

leaveBtn.addEventListener('click', () => {
    if (confirm('정말 회원 탈퇴하시겠습니까? 학생 목록에서 성함이 완전히 삭제됩니다.')) {
        let allTeachers = JSON.parse(localStorage.getItem('allTeachersList') || "[]");
        allTeachers = allTeachers.filter(name => name !== currentTeacherName);
        localStorage.setItem('allTeachersList', JSON.stringify(allTeachers));
        
        sessionStorage.removeItem('currentTabTeacher');
        resetUI();
    }
});

function resetUI() {
    currentTeacherName = "";
    document.getElementById('regName').value = "";
    document.getElementById('regPw').value = "";
    clearInterval(blinkInterval);
    document.title = "선생님용 시스템";
    
    alertBox.classList.add('hidden');
    noNotification.classList.remove('hidden');
    mainSection.classList.add('hidden');
    authSection.classList.remove('hidden');
}

function startListening() {
    window.addEventListener('storage', (event) => {
        if (event.key === 'teacherCallSignal' && event.newValue) {
            const data = JSON.parse(event.newValue);
            if (data.teacher === currentTeacherName) {
                showAlarm(data);
            }
        }
    });
}

function showAlarm(data) {
    noNotification.classList.add('hidden');
    alertBox.classList.remove('hidden');
    document.getElementById('alertContent').innerText = `[메시지]: ${data.message}`;
    document.getElementById('alertTime').innerText = `호출 시간: ${data.time}`;

    if (Notification.permission === "granted") {
        new Notification("🚨 학생 호출 발생!", {
            body: `내용: ${data.message}\n호출 시간: ${data.time}`,
            tag: "call-alert"
        });
    }

    clearInterval(blinkInterval);
    let isBlink = false;
    blinkInterval = setInterval(() => {
        document.title = isBlink ? "선생님용 시스템" : "🚨 [학생 호출 발생!!]";
        isBlink = !isBlink;
    }, 500);

    setTimeout(() => {
        alert(`🚨 알림이 왔습니다!\n내용: ${data.message}`);
    }, 50);
}

document.getElementById('closeAlertBtn').addEventListener('click', () => {
    alertBox.classList.add('hidden');
    noNotification.classList.remove('hidden');
    clearInterval(blinkInterval);
    document.title = "선생님용 시스템";
});
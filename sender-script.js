let selectedTeacherName = "";
const teacherList = document.getElementById('teacherList');
const callBtn = document.getElementById('callBtn');

function loadTeachers() {
    teacherList.innerHTML = "";
    const allTeachers = JSON.parse(localStorage.getItem('allTeachersList') || "[]");
    
    allTeachers.forEach(name => {
        const li = document.createElement('li');
        li.className = 'teacher-item';
        li.setAttribute('data-name', name);
        li.innerText = `${name} 선생님`;
        teacherList.appendChild(li);
    });
}

loadTeachers();
window.addEventListener('storage', (event) => {
    if (event.key === 'allTeachersList') {
        loadTeachers();
        const allTeachers = JSON.parse(event.newValue || "[]");
        if (selectedTeacherName && !allTeachers.includes(selectedTeacherName)) {
            selectedTeacherName = "";
            document.getElementById('selectedTeacher').innerText = "없음";
            callBtn.disabled = true;
        }
    }
});

teacherList.addEventListener('click', (event) => {
    const item = event.target.closest('.teacher-item');
    if (!item) return;

    document.querySelectorAll('.teacher-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    selectedTeacherName = item.getAttribute('data-name');
    document.getElementById('selectedTeacher').innerText = selectedTeacherName + " 선생님";
    callBtn.disabled = false;
});

callBtn.addEventListener('click', () => {
    const message = document.getElementById('messageInput').value.trim() || "내용 없음 (빠른 호출)";
    const callData = {
        teacher: selectedTeacherName,
        message: message,
        time: new Date().toLocaleTimeString(),
        id: Date.now()
    };
    localStorage.setItem('teacherCallSignal', JSON.stringify(callData));
    alert(`${selectedTeacherName} 선생님을 호출했습니다!`);
    document.getElementById('messageInput').value = "";
});
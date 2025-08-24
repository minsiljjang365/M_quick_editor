// audio.js - 오디오 처리 관련 함수들

// 전역 변수
let isRecording = false;
let mediaRecorder = null;

function uploadBGM(input) {
    const file = input.files[0];
    if (file && file.type.startsWith('audio/')) {
        console.log('배경음악 업로드:', file.name);
        alert('배경음악 업로드됨: ' + file.name);
    }
}

function uploadAudio(input) {
    const file = input.files[0];
    if (file && file.type.startsWith('audio/')) {
        console.log('음성파일 업로드:', file.name);
        alert('음성파일 업로드됨: ' + file.name);
    }
}

function uploadSFX(input) {
    const file = input.files[0];
    if (file && file.type.startsWith('audio/')) {
        console.log('효과음 업로드:', file.name);
        alert('효과음 업로드됨: ' + file.name);
    }
}

function selectOwnedSFX() {
    const select = document.getElementById('owned-sfx');
    const selected = select.value;
    if (selected) {
        console.log('효과음 선택:', selected);
        alert('효과음 선택됨: ' + selected);
    }
}

function searchFreeSFX() {
    const query = document.getElementById('sfx-search').value;
    if (!query.trim()) {
        alert('검색어를 입력하세요.');
        return;
    }
    console.log('무료 효과음 검색:', query);
    alert('무료 효과음 API 연동 예정 - 검색어: ' + query);
}

function startRecording() {
    if (isRecording) return;
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            isRecording = true;
            console.log('녹음 시작');
            alert('녹음을 시작했습니다.');
        })
        .catch(err => {
            console.error('녹음 시작 실패:', err);
            alert('마이크 권한을 허용해주세요.');
        });
}

function stopRecording() {
    if (!isRecording || !mediaRecorder) return;
    
    mediaRecorder.stop();
    isRecording = false;
    console.log('녹음 중지');
    alert('녹음이 중지되었습니다.');
}
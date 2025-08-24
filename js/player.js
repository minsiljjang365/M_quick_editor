// player.js - 유튜브 쇼츠 플레이어 완전 기능

// 플레이어 전역 변수
let currentMode = 'edit'; // 'edit' 또는 'player'
let isPlaying = false;
let currentTime = 0;
let totalDuration = 60; // 기본 60초
let playInterval = null;
let timelineElements = []; // 타임라인에 등록된 요소들
let audioContext = null;
let backgroundMusic = null;
let playerInitialized = false;

// 플레이어 초기화
function initializePlayer() {
    if (playerInitialized) return;
    
    createPlayerUI();
    setupPlayerEvents();
    setupCanvasForPlayer();
    playerInitialized = true;
    console.log('🎬 플레이어 초기화 완료');
}

// 플레이어 UI 생성
function createPlayerUI() {
    const canvasArea = document.getElementById('canvas-area');
    
    // 모드 전환 버튼 추가
    const modeControls = document.createElement('div');
    modeControls.id = 'mode-controls';
    modeControls.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
        padding: 10px;
        background: #2a2a2a;
        border-radius: 8px;
    `;
    
    const editModeBtn = document.createElement('button');
    editModeBtn.id = 'edit-mode-btn';
    editModeBtn.innerHTML = '✏️ 편집 모드';
    editModeBtn.className = 'mode-btn active';
    editModeBtn.onclick = () => switchToEditMode();
    
    const playerModeBtn = document.createElement('button');
    playerModeBtn.id = 'player-mode-btn';
    playerModeBtn.innerHTML = '▶️ 플레이어 모드';
    playerModeBtn.className = 'mode-btn';
    playerModeBtn.onclick = () => switchToPlayerMode();
    
    modeControls.appendChild(editModeBtn);
    modeControls.appendChild(playerModeBtn);
    
    // 플레이어 컨트롤 생성
    const playerControls = document.createElement('div');
    playerControls.id = 'player-controls';
    playerControls.style.cssText = `
        display: none;
        flex-direction: column;
        gap: 10px;
        padding: 15px;
        background: #2a2a2a;
        border-radius: 8px;
        margin-top: 10px;
    `;
    
    // 재생 컨트롤 바
    const controlBar = document.createElement('div');
    controlBar.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    // 재생/일시정지 버튼
    const playPauseBtn = document.createElement('button');
    playPauseBtn.id = 'play-pause-btn';
    playPauseBtn.innerHTML = '▶️';
    playPauseBtn.onclick = () => togglePlayPause();
    playPauseBtn.style.cssText = `
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: #007bff;
        color: white;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // 정지 버튼
    const stopBtn = document.createElement('button');
    stopBtn.innerHTML = '⏹️';
    stopBtn.onclick = () => stopPlayback();
    stopBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 6px;
        background: #dc3545;
        color: white;
        font-size: 14px;
        cursor: pointer;
    `;
    
    // 시간 표시
    const timeDisplay = document.createElement('div');
    timeDisplay.id = 'time-display';
    timeDisplay.innerHTML = '00:00 / 01:00';
    timeDisplay.style.cssText = `
        color: white;
        font-family: monospace;
        font-size: 14px;
        min-width: 100px;
    `;
    
    controlBar.appendChild(playPauseBtn);
    controlBar.appendChild(stopBtn);
    controlBar.appendChild(timeDisplay);
    
    // 타임라인 슬라이더
    const timelineContainer = document.createElement('div');
    timelineContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const timelineSlider = document.createElement('input');
    timelineSlider.type = 'range';
    timelineSlider.id = 'timeline-slider';
    timelineSlider.min = '0';
    timelineSlider.max = totalDuration;
    timelineSlider.value = '0';
    timelineSlider.oninput = (e) => seekTo(parseInt(e.target.value));
    timelineSlider.style.cssText = `
        flex: 1;
        height: 8px;
        background: #404040;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
    `;
    
    // 속도 조절
    const speedControl = document.createElement('select');
    speedControl.id = 'speed-control';
    speedControl.innerHTML = `
        <option value="0.5">0.5x</option>
        <option value="1" selected>1.0x</option>
        <option value="1.5">1.5x</option>
        <option value="2">2.0x</option>
    `;
    speedControl.onchange = (e) => changePlaybackSpeed(parseFloat(e.target.value));
    speedControl.style.cssText = `
        background: #404040;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px;
        cursor: pointer;
    `;
    
    timelineContainer.appendChild(timelineSlider);
    timelineContainer.appendChild(speedControl);
    
    // 볼륨 컨트롤
    const volumeContainer = document.createElement('div');
    volumeContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const volumeLabel = document.createElement('span');
    volumeLabel.innerHTML = '🔊';
    volumeLabel.style.color = 'white';
    
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.id = 'volume-slider';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = '80';
    volumeSlider.oninput = (e) => changeVolume(parseInt(e.target.value));
    volumeSlider.style.cssText = `
        width: 100px;
        height: 6px;
        background: #404040;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
    `;
    
    const volumeValue = document.createElement('span');
    volumeValue.id = 'volume-value';
    volumeValue.innerHTML = '80%';
    volumeValue.style.cssText = `
        color: #ccc;
        font-size: 12px;
        min-width: 35px;
    `;
    
    volumeContainer.appendChild(volumeLabel);
    volumeContainer.appendChild(volumeSlider);
    volumeContainer.appendChild(volumeValue);
    
    // 플레이어 옵션
    const optionsContainer = document.createElement('div');
    optionsContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        padding-top: 10px;
        border-top: 1px solid #444;
    `;
    
    // 반복 재생 버튼
    const loopBtn = document.createElement('button');
    loopBtn.id = 'loop-btn';
    loopBtn.innerHTML = '🔄 반복';
    loopBtn.onclick = () => toggleLoop();
    loopBtn.style.cssText = `
        padding: 8px 15px;
        background: #555;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
    `;
    
    // 전체화면 버튼
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '⛶ 전체화면';
    fullscreenBtn.onclick = () => toggleFullscreen();
    fullscreenBtn.style.cssText = `
        padding: 8px 15px;
        background: #555;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
    `;
    
    // 내보내기 버튼
    const exportBtn = document.createElement('button');
    exportBtn.innerHTML = '💾 내보내기';
    exportBtn.onclick = () => exportVideo();
    exportBtn.style.cssText = `
        padding: 8px 15px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
    `;
    
    optionsContainer.appendChild(loopBtn);
    optionsContainer.appendChild(fullscreenBtn);
    optionsContainer.appendChild(exportBtn);
    
    // 모든 요소 조립
    playerControls.appendChild(controlBar);
    playerControls.appendChild(timelineContainer);
    playerControls.appendChild(volumeContainer);
    playerControls.appendChild(optionsContainer);
    
    // 캔버스 영역에 추가
    canvasArea.insertBefore(modeControls, canvasArea.firstChild);
    canvasArea.appendChild(playerControls);
    
    // 모드 버튼 스타일 추가
    addModeButtonStyles();
}

// 모드 버튼 스타일 추가
function addModeButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .mode-btn {
            padding: 10px 20px;
            border: 2px solid #555;
            background: #404040;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .mode-btn:hover {
            background: #555;
            border-color: #007bff;
        }
        
        .mode-btn.active {
            background: #007bff;
            border-color: #0056b3;
            color: white;
        }
        
        #timeline-slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #007bff;
            cursor: pointer;
        }
        
        #timeline-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #007bff;
            cursor: pointer;
            border: none;
        }
        
        #volume-slider::-webkit-slider-thumb {
            appearance: none;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #28a745;
            cursor: pointer;
        }
        
        #volume-slider::-moz-range-thumb {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #28a745;
            cursor: pointer;
            border: none;
        }
    `;
    document.head.appendChild(style);
}

// 캔버스를 플레이어용으로 설정
function setupCanvasForPlayer() {
    const canvas = document.getElementById('canvas');
    
    // 9:16 비율로 설정 (세로형 쇼츠)
    canvas.style.aspectRatio = '9/16';
    canvas.style.maxWidth = '300px';
    canvas.style.maxHeight = '533px';
    canvas.style.margin = '0 auto';
    canvas.style.border = '2px solid #007bff';
}

// 이벤트 설정
function setupPlayerEvents() {
    // 키보드 단축키
    document.addEventListener('keydown', (e) => {
        if (currentMode !== 'player') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                seekTo(Math.max(0, currentTime - 5));
                break;
            case 'ArrowRight':
                e.preventDefault();
                seekTo(Math.min(totalDuration, currentTime + 5));
                break;
            case 'KeyR':
                e.preventDefault();
                toggleLoop();
                break;
            case 'KeyF':
                e.preventDefault();
                toggleFullscreen();
                break;
        }
    });
}

// 편집 모드로 전환
function switchToEditMode() {
    currentMode = 'edit';
    
    // 재생 중이면 중지
    if (isPlaying) {
        stopPlayback();
    }
    
    // UI 업데이트
    document.getElementById('edit-mode-btn').classList.add('active');
    document.getElementById('player-mode-btn').classList.remove('active');
    document.getElementById('player-controls').style.display = 'none';
    
    // 캔버스 원래대로 복구
    const canvas = document.getElementById('canvas');
    canvas.style.aspectRatio = '';
    canvas.style.maxWidth = '';
    canvas.style.maxHeight = '';
    canvas.style.border = '';
    
    // 편집 모드에서는 모든 요소 표시
    const elements = canvas.querySelectorAll('.canvas-element');
    elements.forEach(element => {
        element.style.display = '';
        element.style.opacity = '';
    });
    
    console.log('✏️ 편집 모드로 전환');
}

// 플레이어 모드로 전환
function switchToPlayerMode() {
    currentMode = 'player';
    
    // UI 업데이트
    document.getElementById('edit-mode-btn').classList.remove('active');
    document.getElementById('player-mode-btn').classList.add('active');
    document.getElementById('player-controls').style.display = 'flex';
    
    // 캔버스를 플레이어용으로 설정
    setupCanvasForPlayer();
    
    // 타임라인 요소들 준비
    prepareTimelineElements();
    
    // 시작 시점으로 리셋
    seekTo(0);
    
    console.log('▶️ 플레이어 모드로 전환');
}

// 타임라인 요소들 준비
function prepareTimelineElements() {
    const canvas = document.getElementById('canvas');
    const elements = canvas.querySelectorAll('.canvas-element:not(.canvas-background-template)');
    
    timelineElements = [];
    
    elements.forEach((element, index) => {
        const timelineItem = {
            element: element,
            startTime: index * 3, // 3초씩 간격으로 등장
            endTime: totalDuration, // 끝까지 유지
            animation: 'fadeIn', // 기본 애니메이션
            duration: 0.5 // 애니메이션 지속시간
        };
        
        timelineElements.push(timelineItem);
        
        // 초기에는 모든 요소 숨김
        element.style.display = 'none';
        element.style.opacity = '0';
    });
    
    console.log(`📋 타임라인 요소 ${timelineElements.length}개 준비 완료`);
}

// 재생/일시정지 토글
function togglePlayPause() {
    if (isPlaying) {
        pausePlayback();
    } else {
        startPlayback();
    }
}

// 재생 시작
function startPlayback() {
    if (currentMode !== 'player') return;
    
    isPlaying = true;
    document.getElementById('play-pause-btn').innerHTML = '⏸️';
    
    // 재생 간격 설정 (60fps)
    playInterval = setInterval(() => {
        currentTime += 1/60;
        
        if (currentTime >= totalDuration) {
            if (document.getElementById('loop-btn').classList.contains('active')) {
                seekTo(0); // 반복 재생
            } else {
                stopPlayback(); // 재생 완료
            }
            return;
        }
        
        updateTimeline();
        updateTimeDisplay();
        updateTimelineSlider();
        
    }, 1000/60); // 60fps
    
    console.log('▶️ 재생 시작');
}

// 재생 일시정지
function pausePlayback() {
    isPlaying = false;
    document.getElementById('play-pause-btn').innerHTML = '▶️';
    
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    
    console.log('⏸️ 재생 일시정지');
}

// 재생 정지
function stopPlayback() {
    pausePlayback();
    seekTo(0);
    console.log('⏹️ 재생 정지');
}

// 특정 시점으로 이동
function seekTo(time) {
    currentTime = Math.max(0, Math.min(totalDuration, time));
    updateTimeline();
    updateTimeDisplay();
    updateTimelineSlider();
}

// 타임라인 업데이트 (요소들 표시/숨김)
function updateTimeline() {
    timelineElements.forEach(item => {
        const { element, startTime, endTime, animation, duration } = item;
        
        if (currentTime >= startTime && currentTime <= endTime) {
            // 요소 표시
            if (element.style.display === 'none') {
                element.style.display = '';
                animateElement(element, animation, duration);
            }
        } else {
            // 요소 숨김
            element.style.display = 'none';
            element.style.opacity = '0';
        }
    });
}

// 요소 애니메이션
function animateElement(element, animationType, duration) {
    element.style.transition = `all ${duration}s ease`;
    
    switch(animationType) {
        case 'fadeIn':
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.opacity = '1';
            }, 10);
            break;
            
        case 'slideInLeft':
            element.style.transform = 'translateX(-100px)';
            element.style.opacity = '1';
            setTimeout(() => {
                element.style.transform = 'translateX(0)';
            }, 10);
            break;
            
        case 'slideInRight':
            element.style.transform = 'translateX(100px)';
            element.style.opacity = '1';
            setTimeout(() => {
                element.style.transform = 'translateX(0)';
            }, 10);
            break;
            
        case 'scaleIn':
            element.style.transform = 'scale(0)';
            element.style.opacity = '1';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 10);
            break;
            
        default:
            element.style.opacity = '1';
    }
}

// 시간 표시 업데이트
function updateTimeDisplay() {
    const current = formatTime(currentTime);
    const total = formatTime(totalDuration);
    document.getElementById('time-display').innerHTML = `${current} / ${total}`;
}

// 타임라인 슬라이더 업데이트
function updateTimelineSlider() {
    document.getElementById('timeline-slider').value = currentTime;
}

// 시간 포맷팅
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 재생 속도 변경
function changePlaybackSpeed(speed) {
    // 현재는 시각적 효과만, 실제 오디오 연동시 구현
    console.log(`⚡ 재생 속도: ${speed}x`);
}

// 볼륨 조절
function changeVolume(volume) {
    document.getElementById('volume-value').innerHTML = `${volume}%`;
    
    // 실제 오디오 볼륨 조절 (구현 예정)
    if (backgroundMusic) {
        backgroundMusic.volume = volume / 100;
    }
    
    console.log(`🔊 볼륨: ${volume}%`);
}

// 반복 재생 토글
function toggleLoop() {
    const loopBtn = document.getElementById('loop-btn');
    loopBtn.classList.toggle('active');
    
    if (loopBtn.classList.contains('active')) {
        loopBtn.style.background = '#007bff';
        loopBtn.innerHTML = '🔄 반복 ON';
    } else {
        loopBtn.style.background = '#555';
        loopBtn.innerHTML = '🔄 반복';
    }
}

// 전체화면 토글
function toggleFullscreen() {
    const canvas = document.getElementById('canvas');
    
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().then(() => {
            canvas.style.maxWidth = '100vw';
            canvas.style.maxHeight = '100vh';
            console.log('⛶ 전체화면 모드');
        });
    } else {
        document.exitFullscreen().then(() => {
            setupCanvasForPlayer();
            console.log('⛷ 전체화면 해제');
        });
    }
}

// 동영상 내보내기
function exportVideo() {
    alert('동영상 내보내기 기능 구현 예정\n\n지원 포맷:\n- MP4 (H.264)\n- WebM\n- GIF\n\n해상도:\n- 1080x1920 (Full HD)\n- 720x1280 (HD)');
    console.log('💾 동영상 내보내기');
}

// 배경음악 설정
function setBackgroundMusic(audioFile) {
    // 실제 구현 시 Web Audio API 사용
    console.log('🎵 배경음악 설정:', audioFile);
}

// 타임라인 요소 추가 (수동)
function addTimelineElement(element, startTime, endTime, animation = 'fadeIn') {
    timelineElements.push({
        element: element,
        startTime: startTime,
        endTime: endTime,
        animation: animation,
        duration: 0.5
    });
    
    console.log(`➕ 타임라인에 요소 추가: ${startTime}s - ${endTime}s`);
}

// 타임라인 요소 제거
function removeTimelineElement(element) {
    timelineElements = timelineElements.filter(item => item.element !== element);
    console.log('➖ 타임라인에서 요소 제거');
}

// 플레이어 상태 저장
function savePlayerState() {
    const state = {
        currentTime: currentTime,
        totalDuration: totalDuration,
        timelineElements: timelineElements.map(item => ({
            elementId: item.element.id,
            startTime: item.startTime,
            endTime: item.endTime,
            animation: item.animation
        }))
    };
    
    localStorage.setItem('playerState', JSON.stringify(state));
    console.log('💾 플레이어 상태 저장');
}

// 플레이어 상태 로드
function loadPlayerState() {
    const saved = localStorage.getItem('playerState');
    if (saved) {
        const state = JSON.parse(saved);
        currentTime = state.currentTime;
        totalDuration = state.totalDuration;
        
        // 타임라인 요소 복원은 DOM이 준비된 후에
        console.log('📂 플레이어 상태 로드');
        return state;
    }
    return null;
}

// 페이지 로드시 플레이어 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 약간의 지연 후 초기화 (다른 스크립트들이 로드된 후)
    setTimeout(() => {
        initializePlayer();
        
        // 저장된 상태가 있으면 복원
        loadPlayerState();
    }, 100);
});

// 페이지 언로드시 상태 저장
window.addEventListener('beforeunload', function() {
    if (playerInitialized) {
        savePlayerState();
    }
});

console.log('🎬 player.js 로드 완료');

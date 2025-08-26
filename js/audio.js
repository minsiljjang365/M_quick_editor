// ========== 오디오 관련 함수들 ==========

/**
 * 음성파일 업로드 함수
 * @param {HTMLInputElement} input - 파일 입력 요소
 */
function uploadAudioFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    console.log('음성파일 업로드:', file.name);
    
    // 파일을 처리하여 목록에 추가
    const audioList = document.getElementById('uploaded-audio-list');
    if (audioList) {
        const audioItem = document.createElement('div');
        audioItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin: 5px 0; padding: 5px; background: #404040; border-radius: 4px;">
                <span style="color: white; font-size: 11px; flex: 1;">${file.name}</span>
                <button onclick="playAudio('${file.name}')" style="padding: 2px 6px; background: #007bff; color: white; border: none; border-radius: 3px; font-size: 10px;">재생</button>
                <button onclick="addAudioToCanvas('${file.name}')" style="padding: 2px 6px; background: #28a745; color: white; border: none; border-radius: 3px; font-size: 10px;">추가</button>
            </div>
        `;
        audioList.appendChild(audioItem);
    }
}

/**
 * 효과음 업로드 함수 (다중 파일 지원)
 * @param {HTMLInputElement} input - 파일 입력 요소
 */
function uploadEffectSounds(input) {
    const files = Array.from(input.files);
    if (!files.length) return;
    
    console.log('효과음 업로드:', files.map(f => f.name));
    
    // 파일들을 처리하여 목록에 추가
    const effectList = document.getElementById('effect-sounds-list');
    if (effectList) {
        files.forEach(file => {
            const effectItem = document.createElement('div');
            effectItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin: 5px 0; padding: 5px; background: #404040; border-radius: 4px;">
                    <span style="color: white; font-size: 11px; flex: 1;">🔊 ${file.name}</span>
                    <button onclick="playEffect('${file.name}')" style="padding: 2px 6px; background: #007bff; color: white; border: none; border-radius: 3px; font-size: 10px;">재생</button>
                    <button onclick="addEffectToCanvas('${file.name}')" style="padding: 2px 6px; background: #28a745; color: white; border: none; border-radius: 3px; font-size: 10px;">사용</button>
                </div>
            `;
            effectList.appendChild(effectItem);
        });
    }
}

/**
 * 무료 효과음 검색 함수 (API 연동 예정)
 */
function searchFreeSFX() {
    const query = document.getElementById('sfx-search').value.trim();
    if (!query) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    console.log('무료 효과음 검색:', query);
    
    // API 연결 예정 - 임시로 가짜 결과 표시
    const resultsContainer = document.getElementById('free-sfx-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div style="color: #ccc; font-size: 11px; text-align: center; margin: 10px 0;">
                "${query}" 검색 결과 (API 연결 예정)
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin: 5px 0; padding: 5px; background: #404040; border-radius: 4px;">
                <span style="color: white; font-size: 11px; flex: 1;">🎵 ${query}_sound_01.wav</span>
                <button onclick="playFreeSFX('sample1')" style="padding: 2px 6px; background: #007bff; color: white; border: none; border-radius: 3px; font-size: 10px;">재생</button>
                <button onclick="downloadFreeSFX('sample1')" style="padding: 2px 6px; background: #28a745; color: white; border: none; border-radius: 3px; font-size: 10px;">다운</button>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin: 5px 0; padding: 5px; background: #404040; border-radius: 4px;">
                <span style="color: white; font-size: 11px; flex: 1;">🎵 ${query}_sound_02.wav</span>
                <button onclick="playFreeSFX('sample2')" style="padding: 2px 6px; background: #007bff; color: white; border: none; border-radius: 3px; font-size: 10px;">재생</button>
                <button onclick="downloadFreeSFX('sample2')" style="padding: 2px 6px; background: #28a745; color: white; border: none; border-radius: 3px; font-size: 10px;">다운</button>
            </div>
        `;
    }
}

/**
 * 녹음 예정 메시지 표시
 */
function showRecordingMessage() {
    alert(`🎙️ 음성 녹음 기능은 구현예정입니다.

향후 업데이트에서 다음 기능들이 추가될 예정입니다:
- 실시간 음성 녹음
- 마이크 음성 입력
- 녹음 파일 편집
- 음성 품질 조절`);
}

// ========== 오디오 재생 관련 함수들 ==========

/**
 * 업로드된 음성 재생
 * @param {string} fileName - 파일명
 */
function playAudio(fileName) {
    console.log('음성 재생:', fileName);
    // TODO: 실제 재생 기능 구현 예정
    // HTML5 Audio API 사용하여 재생 기능 구현
}

/**
 * 캔버스에 음성 추가
 * @param {string} fileName - 파일명
 */
function addAudioToCanvas(fileName) {
    console.log('캔버스에 음성 추가:', fileName);
    // TODO: 캔버스에 음성 트랙 추가 기능 구현 예정
    // 타임라인에 오디오 트랙 생성 및 관리
}

/**
 * 효과음 재생
 * @param {string} fileName - 파일명
 */
function playEffect(fileName) {
    console.log('효과음 재생:', fileName);
    // TODO: 실제 재생 기능 구현 예정
    // Web Audio API 또는 HTML5 Audio 사용
}

/**
 * 캔버스에 효과음 추가
 * @param {string} fileName - 파일명
 */
function addEffectToCanvas(fileName) {
    console.log('캔버스에 효과음 추가:', fileName);
    // TODO: 캔버스에 효과음 추가 기능 구현 예정
    // 특정 시점에 효과음 재생되도록 설정
}

/**
 * 무료 효과음 재생 (미리듣기)
 * @param {string} sampleId - 샘플 ID
 */
function playFreeSFX(sampleId) {
    console.log('무료 효과음 재생:', sampleId);
    // TODO: API에서 받은 오디오 URL로 재생 기능 구현 예정
    // fetch API + Audio 객체 사용
}

/**
 * 무료 효과음 다운로드
 * @param {string} sampleId - 샘플 ID
 */
function downloadFreeSFX(sampleId) {
    console.log('무료 효과음 다운로드:', sampleId);
    // TODO: API에서 파일 다운로드 기능 구현 예정
    // blob 다운로드 처리
}

// ========== 오디오 유틸리티 함수들 ==========

/**
 * 오디오 파일 유효성 검사
 * @param {File} file - 검사할 파일
 * @returns {boolean} - 유효한 오디오 파일인지 여부
 */
function validateAudioFile(file) {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!validTypes.includes(file.type)) {
        alert('지원되지 않는 오디오 형식입니다.\n지원 형식: MP3, WAV, OGG, AAC, M4A');
        return false;
    }
    
    if (file.size > maxSize) {
        alert('파일 크기가 너무 큽니다. (최대 50MB)');
        return false;
    }
    
    return true;
}

/**
 * 오디오 파일 메타데이터 추출
 * @param {File} file - 오디오 파일
 * @returns {Promise<Object>} - 메타데이터 객체
 */
async function extractAudioMetadata(file) {
    return new Promise((resolve) => {
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        
        audio.addEventListener('loadedmetadata', () => {
            const metadata = {
                duration: audio.duration,
                name: file.name,
                size: file.size,
                type: file.type,
                url: url
            };
            resolve(metadata);
        });
        
        audio.src = url;
    });
}

/**
 * 시간을 MM:SS 형식으로 포맷팅
 * @param {number} seconds - 초 단위 시간
 * @returns {string} - 포맷된 시간 문자열
 */
function formatAudioTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// ========== 기존 오디오 함수들 (호환성 유지) ==========

/**
 * 배경음악 업로드 (더 이상 사용하지 않음)
 * @deprecated 배경음악 기능이 제거됨
 */
function uploadBGM(input) {
    console.warn('uploadBGM 함수는 더 이상 사용되지 않습니다.');
    // 기존 코드와의 호환성을 위해 유지하되 경고만 표시
}

/**
 * 기존 오디오 업로드 (호환성 유지)
 * @param {HTMLInputElement} input - 파일 입력 요소
 */
function uploadAudio(input) {
    // 새로운 uploadAudioFile 함수로 리다이렉트
    uploadAudioFile(input);
}

/**
 * 기존 효과음 선택 (호환성 유지)
 */
function selectOwnedSFX() {
    console.log('기존 효과음 선택 기능');
    // TODO: 드롭다운에서 선택한 효과음 처리
}

/**
 * 기존 효과음 업로드 (호환성 유지)
 * @param {HTMLInputElement} input - 파일 입력 요소
 */
function uploadSFX(input) {
    // 새로운 uploadEffectSounds 함수로 리다이렉트
    uploadEffectSounds(input);
}

/**
 * 녹음 시작 (호환성 유지)
 */
function startRecording() {
    showRecordingMessage();
}

/**
 * 녹음 정지 (호환성 유지)
 */
function stopRecording() {
    showRecordingMessage();
}

console.log('🎵 오디오 모듈 로드 완료');
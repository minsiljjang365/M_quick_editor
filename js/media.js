// media.js - 미디어 관련 기능들 (이미지, 동영상 업로드, 검색, AI 생성)

// 전역 변수
let mediaApiKeys = {
    pexels: '',
    pixabay: '',
    fal_ai: ''
};

// ===========================================
// 🎯 빠른 이미지 추가 기능
// ===========================================

// 빠른 이미지 추가 - 파일 선택 다이얼로그
function addQuickImage() {
    console.log('📁 파일 선택 다이얼로그 열기');
    
    // 파일 선택 input 생성
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    // 파일 선택 시 처리
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            console.log('📷 파일 선택됨:', file.name);
            handleImageFile(file);
        }
        // input 요소 제거
        document.body.removeChild(input);
    };
    
    // input을 DOM에 추가하고 클릭
    document.body.appendChild(input);
    input.click();
}

// 선택된 이미지 파일 처리
function handleImageFile(file) {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }
    
    // 파일 크기 검증 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하만 가능합니다.');
        return;
    }
    
    console.log('🔄 이미지 파일 처리 중...');
    
    // FileReader로 파일을 Data URL로 변환
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        console.log('✅ 이미지 URL 생성 완료');
        
        // 캔버스 중앙에 이미지 추가
        const canvas = document.getElementById('canvas');
        const centerX = (canvas.offsetWidth / 2) - 75; // 이미지 중앙 정렬
        const centerY = (canvas.offsetHeight / 2) - 75;
        
        // canvas.js의 addImageElement 함수 호출
        if (typeof addImageElement === 'function') {
            addImageElement(imageUrl, centerX, centerY);
            console.log('🖼️ 이미지가 캔버스에 추가됨');
        } else {
            console.error('❌ addImageElement 함수를 찾을 수 없음');
        }
    };
    
    reader.onerror = function() {
        console.error('❌ 파일 읽기 실패');
        alert('파일을 읽는 중 오류가 발생했습니다.');
    };
    
    reader.readAsDataURL(file);
}

// ===========================================
// 📤 직접 업로드 기능
// ===========================================

// 직접 업로드 파일 처리
function uploadFile(input) {
    const file = input.files[0];
    if (!file) return;
    
    console.log('📤 파일 업로드:', file.name, file.type);
    
    // 이미지 파일 처리
    if (file.type.startsWith('image/')) {
        handleImageFile(file);
    }
    // 동영상 파일 처리 
    else if (file.type.startsWith('video/')) {
        handleVideoFile(file);
    }
    else {
        alert('이미지 또는 동영상 파일만 업로드 가능합니다.');
    }
    
    // input 값 초기화
    input.value = '';
}

// 선택된 동영상 파일 처리
function handleVideoFile(file) {
    // 파일 크기 검증 (100MB 제한)
    if (file.size > 100 * 1024 * 1024) {
        alert('동영상 파일 크기는 100MB 이하만 가능합니다.');
        return;
    }
    
    console.log('🎬 동영상 파일 처리 중...');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const videoUrl = e.target.result;
        console.log('✅ 동영상 URL 생성 완료');
        
        // 동영상 요소 생성하여 캔버스에 추가
        const canvas = document.getElementById('canvas');
        const centerX = (canvas.offsetWidth / 2) - 100;
        const centerY = (canvas.offsetHeight / 2) - 75;
        
        addVideoElement(videoUrl, centerX, centerY);
    };
    
    reader.readAsDataURL(file);
}

// 동영상 요소를 캔버스에 추가
function addVideoElement(src, x, y) {
    const canvas = document.getElementById('canvas');
    const element = document.createElement('video');
    
    element.className = 'canvas-element canvas-video';
    element.src = src;
    element.controls = true;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = '200px';
    element.style.height = '150px';
    element.style.position = 'absolute';
    element.style.cursor = 'move';
    element.id = 'element-' + Date.now();
    element.style.zIndex = '5';
    
    element.onclick = function() {
        if (typeof selectElement === 'function') {
            selectElement(this);
        }
    };
    
    // 드래그 이벤트 설정
    if (typeof setupDragEvents === 'function') {
        setupDragEvents(element);
    }
    
    canvas.appendChild(element);
    
    // 요소 선택
    if (typeof selectElement === 'function') {
        selectElement(element);
    }
    
    // 상태 저장
    if (typeof saveCanvasState === 'function') {
        saveCanvasState();
    }
    
    console.log('🎬 동영상이 캔버스에 추가됨');
}

// ===========================================
// 🌐 무료 스톡 이미지 검색
// ===========================================

// 무료 스톡 이미지 검색
async function searchStockImages() {
    const searchInput = document.getElementById('stock-image-search');
    const resultsDiv = document.getElementById('image-search-results');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    console.log('🔍 이미지 검색:', query);
    
    // 로딩 표시
    resultsDiv.innerHTML = '<div style="color: white; text-align: center; padding: 10px;">검색 중...</div>';
    
    try {
        // API 키 가져오기
        await loadApiKeys();
        
        // Pexels API 우선 사용
        if (mediaApiKeys.pexels) {
            await searchPexelsImages(query, resultsDiv);
        }
        // Pixabay API 사용
        else if (mediaApiKeys.pixabay) {
            await searchPixabayImages(query, resultsDiv);
        }
        else {
            resultsDiv.innerHTML = '<div style="color: #ff6b6b; padding: 10px;">API 키가 설정되지 않았습니다.<br>관리자 페이지에서 API 키를 설정해주세요.</div>';
        }
        
    } catch (error) {
        console.error('❌ 이미지 검색 실패:', error);
        resultsDiv.innerHTML = '<div style="color: #ff6b6b; padding: 10px;">검색 중 오류가 발생했습니다.</div>';
    }
}

// Pexels API 검색
async function searchPexelsImages(query, resultsDiv) {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`, {
        headers: {
            'Authorization': mediaApiKeys.pexels
        }
    });
    
    if (!response.ok) {
        throw new Error('Pexels API 호출 실패');
    }
    
    const data = await response.json();
    displayImageResults(data.photos, resultsDiv, 'pexels');
}

// Pixabay API 검색
async function searchPixabayImages(query, resultsDiv) {
    const response = await fetch(`https://pixabay.com/api/?key=${mediaApiKeys.pixabay}&q=${encodeURIComponent(query)}&image_type=photo&per_page=6`);
    
    if (!response.ok) {
        throw new Error('Pixabay API 호출 실패');
    }
    
    const data = await response.json();
    displayImageResults(data.hits, resultsDiv, 'pixabay');
}

// 이미지 검색 결과 표시
function displayImageResults(images, resultsDiv, source) {
    if (!images || images.length === 0) {
        resultsDiv.innerHTML = '<div style="color: #ccc; padding: 10px;">검색 결과가 없습니다.</div>';
        return;
    }
    
    resultsDiv.innerHTML = '';
    
    images.forEach(image => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        // 소스별 이미지 데이터 구조 처리
        let imageUrl, thumbnailUrl, title, photographer;
        
        switch(source) {
            case 'pexels':
                imageUrl = image.src.large;
                thumbnailUrl = image.src.tiny;
                title = image.alt || 'Untitled';
                photographer = image.photographer;
                break;
            case 'pixabay':
                imageUrl = image.webformatURL;
                thumbnailUrl = image.previewURL;
                title = image.tags.substring(0, 30) + '...';
                photographer = image.user;
                break;
        }
        
        resultItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${title}" class="search-result-thumbnail">
            <div class="search-result-info">
                <div class="search-result-title">${title}</div>
                <div class="search-result-source">${photographer} - ${source}</div>
            </div>
        `;
        
        // 클릭 이벤트 - 캔버스에 이미지 추가
        resultItem.onclick = function() {
            console.log('🖼️ 스톡 이미지 선택:', title);
            
            const canvas = document.getElementById('canvas');
            const centerX = (canvas.offsetWidth / 2) - 75;
            const centerY = (canvas.offsetHeight / 2) - 75;
            
            if (typeof addImageElement === 'function') {
                addImageElement(imageUrl, centerX, centerY);
                console.log('✅ 스톡 이미지 캔버스에 추가됨');
            }
        };
        
        resultsDiv.appendChild(resultItem);
    });
}

// ===========================================
// 🎬 무료 스톡 동영상 검색
// ===========================================

// 무료 스톡 동영상 검색
async function searchStockVideos() {
    const searchInput = document.getElementById('stock-video-search');
    const resultsDiv = document.getElementById('video-search-results');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    console.log('🔍 동영상 검색:', query);
    
    // 로딩 표시
    resultsDiv.innerHTML = '<div style="color: white; text-align: center; padding: 10px;">검색 중...</div>';
    
    try {
        // API 키 가져오기
        await loadApiKeys();
        
        // Pexels Video API 우선 사용
        if (mediaApiKeys.pexels) {
            await searchPexelsVideos(query, resultsDiv);
        }
        // Pixabay Video API 사용
        else if (mediaApiKeys.pixabay) {
            await searchPixabayVideos(query, resultsDiv);
        }
        else {
            resultsDiv.innerHTML = '<div style="color: #ff6b6b; padding: 10px;">API 키가 설정되지 않았습니다.<br>관리자 페이지에서 API 키를 설정해주세요.</div>';
        }
        
    } catch (error) {
        console.error('❌ 동영상 검색 실패:', error);
        resultsDiv.innerHTML = '<div style="color: #ff6b6b; padding: 10px;">검색 중 오류가 발생했습니다.</div>';
    }
}

// Pexels Video API 검색
async function searchPexelsVideos(query, resultsDiv) {
    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=6`, {
        headers: {
            'Authorization': mediaApiKeys.pexels
        }
    });
    
    if (!response.ok) {
        throw new Error('Pexels Video API 호출 실패');
    }
    
    const data = await response.json();
    displayVideoResults(data.videos, resultsDiv, 'pexels');
}

// Pixabay Video API 검색
async function searchPixabayVideos(query, resultsDiv) {
    const response = await fetch(`https://pixabay.com/api/videos/?key=${mediaApiKeys.pixabay}&q=${encodeURIComponent(query)}&per_page=6`);
    
    if (!response.ok) {
        throw new Error('Pixabay Video API 호출 실패');
    }
    
    const data = await response.json();
    displayVideoResults(data.hits, resultsDiv, 'pixabay');
}

// 동영상 검색 결과 표시
function displayVideoResults(videos, resultsDiv, source) {
    if (!videos || videos.length === 0) {
        resultsDiv.innerHTML = '<div style="color: #ccc; padding: 10px;">검색 결과가 없습니다.</div>';
        return;
    }
    
    resultsDiv.innerHTML = '';
    
    videos.forEach(video => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        // 소스별 동영상 데이터 구조 처리
        let videoUrl, thumbnailUrl, title, author;
        
        switch(source) {
            case 'pexels':
                videoUrl = video.video_files[0]?.link || '';
                thumbnailUrl = video.image || '';
                title = video.tags || 'Untitled Video';
                author = video.user?.name || 'Unknown';
                break;
            case 'pixabay':
                videoUrl = video.videos?.medium?.url || '';
                thumbnailUrl = video.userImageURL || '';
                title = video.tags.substring(0, 30) + '...';
                author = video.user;
                break;
        }
        
        resultItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${title}" class="search-result-thumbnail">
            <div class="search-result-info">
                <div class="search-result-title">${title}</div>
                <div class="search-result-source">${author} - ${source}</div>
            </div>
        `;
        
        // 클릭 이벤트 - 캔버스에 동영상 추가
        resultItem.onclick = function() {
            console.log('🎬 스톡 동영상 선택:', title);
            
            const canvas = document.getElementById('canvas');
            const centerX = (canvas.offsetWidth / 2) - 100;
            const centerY = (canvas.offsetHeight / 2) - 75;
            
            addVideoElement(videoUrl, centerX, centerY);
            console.log('✅ 스톡 동영상 캔버스에 추가됨');
        };
        
        resultsDiv.appendChild(resultItem);
    });
}

// ===========================================
// 🎨 AI 생성 기능들 (fal.ai 사용)
// ===========================================

// 1. 텍스트 → 이미지 생성
async function generateAIImage() {
    const promptInput = document.getElementById('ai-image-prompt');
    const resultDiv = document.getElementById('ai-image-result');
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('이미지 설명을 입력해주세요.');
        return;
    }
    
    console.log('🎨 AI 이미지 생성 요청:', prompt);
    
    // 로딩 표시
    resultDiv.innerHTML = '<div style="color: white; text-align: center; padding: 10px;">AI 이미지 생성 중... (약 10-30초 소요)</div>';
    
    try {
        // API 키 가져오기
        await loadApiKeys();
        
        if (!mediaApiKeys.fal_ai) {
            resultDiv.innerHTML = '<div style="color: #ff6b6b; padding: 10px;">fal.ai API 키가 설정되지 않았습니다.<br>관리자 페이지에서 API 키를 설정해주세요.</div>';
            return;
        }
        
        // fal.ai API 호출
        const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${mediaApiKeys.fal_ai}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                image_size: "square_hd"
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`fal.ai API 오류: ${errorData.detail || response.status}`);
        }
        
        const data = await response.json();
        const imageUrl = data.images[0].url;
        
        // 생성된 이미지 미리보기 표시
        resultDiv.innerHTML = `
            <div class="search-result-item" style="cursor: pointer;">
                <img src="${imageUrl}" alt="AI Generated Image" class="search-result-thumbnail">
                <div class="search-result-info">
                    <div class="search-result-title">생성된 이미지</div>
                    <div class="search-result-source">fal.ai Generated</div>
                </div>
            </div>
        `;
        
        // 클릭 이벤트 - 캔버스에 이미지 추가
        resultDiv.querySelector('.search-result-item').onclick = function() {
            console.log('🎨 AI 생성 이미지 선택');
            
            const canvas = document.getElementById('canvas');
            const centerX = (canvas.offsetWidth / 2) - 75;
            const centerY = (canvas.offsetHeight / 2) - 75;
            
            if (typeof addImageElement === 'function') {
                addImageElement(imageUrl, centerX, centerY);
                console.log('✅ AI 생성 이미지 캔버스에 추가됨');
            }
        };
        
        console.log('✅ AI 이미지 생성 완료');
        
    } catch (error) {
        console.error('❌ AI 이미지 생성 실패:', error);
        resultDiv.innerHTML = `<div style="color: #ff6b6b; padding: 10px;">AI 이미지 생성 실패:<br>${error.message}</div>`;
    }
}

// ===========================================
// 🔧 유틸리티 함수들
// ===========================================

// API 키 불러오기
async function loadApiKeys() {
    try {
        // localStorage에서 API 키 불러오기
        const stored = localStorage.getItem('apiKeys');
        if (stored) {
            const apiKeys = JSON.parse(stored);
            mediaApiKeys.pexels = apiKeys.pexels || '';
            mediaApiKeys.pixabay = apiKeys.pixabay || '';
            mediaApiKeys.fal_ai = apiKeys.fal_ai || '';
            console.log('🔑 API 키 로드 완료');
        }
    } catch (error) {
        console.error('❌ API 키 로드 실패:', error);
    }
}

// 미디어 기능 초기화
function initMediaFeatures() {
    console.log('🎬 미디어 기능 초기화');
    
    // API 키 로드
    loadApiKeys();
    
    // 엔터 키 검색 지원
    const imageSearchInput = document.getElementById('stock-image-search');
    const videoSearchInput = document.getElementById('stock-video-search');
    const aiPromptInput = document.getElementById('ai-image-prompt');
    
    if (imageSearchInput) {
        imageSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStockImages();
            }
        });
    }
    
    if (videoSearchInput) {
        videoSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStockVideos();
            }
        });
    }
    
    if (aiPromptInput) {
        aiPromptInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                generateAIImage();
            }
        });
    }
    
    console.log('✅ 미디어 기능 초기화 완료');
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 약간의 지연 후 초기화 (다른 스크립트들이 로드되기를 기다림)
    setTimeout(initMediaFeatures, 100);
});

console.log('📦 media.js 로드 완료 - 이미지/동영상 업로드, 검색 (Pexels, Pixabay), AI 생성 (fal.ai)');
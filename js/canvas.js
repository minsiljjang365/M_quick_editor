// canvas.js - 캔버스 관리 및 요소 추가/선택 관련 함수들

// 전역 변수
let selectedElement = null;
let elementCounter = 0;

// 이미지 요소 추가
function addImageElement(src, x, y) {
    const canvas = document.getElementById('canvas');
    const element = document.createElement('img');
    
    element.className = 'canvas-element canvas-image';
    element.src = src;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = '150px';
    element.style.height = '150px';
    element.id = 'element-' + (++elementCounter);
    element.style.zIndex = '5'; // 이미지는 중간 레이어
    
    element.onclick = function() {
        selectElement(this);
    };
    
    canvas.appendChild(element);
    selectElement(element);
}

// 템플릿을 배경으로 추가 (맨 아래 레이어)
function addTemplateAsBackground(imageSrc, templateName) {
    const canvas = document.getElementById('canvas');
    
    // 기존 배경 템플릿 제거
    const existingBg = canvas.querySelector('.canvas-background-template');
    if (existingBg) {
        existingBg.remove();
    }
    
    const bgElement = document.createElement('img');
    bgElement.className = 'canvas-element canvas-background-template';
    bgElement.src = imageSrc;
    bgElement.style.left = '0px';
    bgElement.style.top = '0px';
    bgElement.style.width = '100%';
    bgElement.style.height = '100%';
    bgElement.style.objectFit = 'cover';
    bgElement.style.zIndex = '1'; // 가장 아래 레이어
    bgElement.style.pointerEvents = 'none'; // 클릭 이벤트 차단
    bgElement.id = 'background-template';
    bgElement.alt = templateName;
    
    // 캔버스의 맨 앞에 추가 (z-index로 아래 배치)
    canvas.insertBefore(bgElement, canvas.firstChild);
    
    console.log(`배경 템플릿 적용됨: ${templateName}`);
}

// 배경 템플릿 제거
function removeBackgroundTemplate() {
    const canvas = document.getElementById('canvas');
    const bgTemplate = canvas.querySelector('.canvas-background-template');
    if (bgTemplate) {
        bgTemplate.remove();
        console.log('배경 템플릿 제거됨');
        return true;
    }
    return false;
}

// 요소 선택
function selectElement(element) {
    // 배경 템플릿은 선택 불가
    if (element.classList.contains('canvas-background-template')) {
        return;
    }
    
    // 이전 선택 해제
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }
    
    // 새 요소 선택
    selectedElement = element;
    element.classList.add('selected');
    
    // PPT 편집기 업데이트
    updatePPTEditor(element);
}

// 선택된 요소 삭제
function deleteSelectedElement() {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        
        // 편집기 초기화
        const noSelection = document.getElementById('no-selection');
        const textEditor = document.getElementById('text-editor');
        const imageEditor = document.getElementById('image-editor');
        
        if (noSelection) noSelection.style.display = 'block';
        if (textEditor) textEditor.style.display = 'none';
        if (imageEditor) imageEditor.style.display = 'none';
    }
}

// 배경 변경 (기존 함수 - 단색 배경용)
function changeBackground(background) {
    // 배경 템플릿이 있으면 제거
    removeBackgroundTemplate();
    document.getElementById('canvas').style.background = background;
}

// 캔버스 초기화 (모든 요소 제거)
function clearCanvas() {
    if (confirm('캔버스의 모든 요소를 삭제하시겠습니까?')) {
        const canvas = document.getElementById('canvas');
        const elements = canvas.querySelectorAll('.canvas-element');
        elements.forEach(element => element.remove());
        
        selectedElement = null;
        const noSelection = document.getElementById('no-selection');
        const textEditor = document.getElementById('text-editor');
        const imageEditor = document.getElementById('image-editor');
        
        if (noSelection) noSelection.style.display = 'block';
        if (textEditor) textEditor.style.display = 'none';
        if (imageEditor) imageEditor.style.display = 'none';
        
        // 배경도 초기화
        canvas.style.background = '#333';
        
        console.log('캔버스 초기화 완료');
    }
}
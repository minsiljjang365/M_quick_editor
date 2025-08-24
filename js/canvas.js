// canvas.js - 캔버스 관리 및 요소 추가/선택 관련 함수들

// 전역 변수
let selectedElement = null;
let elementCounter = 0;

// 텍스트 요소 추가
function addTextElement(content, x, y) {
    const canvas = document.getElementById('canvas');
    const element = document.createElement('div');
    
    element.className = 'canvas-element canvas-text';
    element.textContent = content;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.id = 'element-' + (++elementCounter);
    
    element.onclick = function() {
        selectElement(this);
    };
    
    canvas.appendChild(element);
    selectElement(element);
}

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
    
    element.onclick = function() {
        selectElement(this);
    };
    
    canvas.appendChild(element);
    selectElement(element);
}

// 요소 선택
function selectElement(element) {
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
        document.getElementById('no-selection').style.display = 'block';
        document.getElementById('text-editor').style.display = 'none';
        document.getElementById('image-editor').style.display = 'none';
    }
}

// 배경 변경
function changeBackground(background) {
    document.getElementById('canvas').style.background = background;
}

// 커스텀 텍스트 추가
function addCustomText() {
    const input = document.getElementById('custom-text');
    if (input.value.trim()) {
        addTextElement(input.value.trim(), 50, 50);
        input.value = '';
    }
}
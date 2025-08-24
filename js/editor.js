// editor.js - PPT 편집기 관련 함수들

function updatePPTEditor(element) {
    // 모든 편집기 숨김
    const noSelection = document.getElementById('no-selection');
    const textEditor = document.getElementById('text-editor');
    const imageEditor = document.getElementById('image-editor');
    
    if (noSelection) noSelection.style.display = 'none';
    if (textEditor) textEditor.style.display = 'none';
    if (imageEditor) imageEditor.style.display = 'none';
    
    if (element.classList.contains('canvas-text')) {
        // 텍스트 편집은 text.js에서 처리
        if (typeof selectTextElement === 'function') {
            selectTextElement(element);
        }
        
    } else if (element.classList.contains('canvas-image')) {
        // 이미지 편집기 표시
        if (imageEditor) imageEditor.style.display = 'block';
        
        // 현재 값 설정
        const imageWidth = document.getElementById('image-width');
        const imageHeight = document.getElementById('image-height');
        const imageX = document.getElementById('image-x');
        const imageY = document.getElementById('image-y');
        
        if (imageWidth) imageWidth.value = parseInt(element.style.width);
        if (imageHeight) imageHeight.value = parseInt(element.style.height);
        if (imageX) imageX.value = parseInt(element.style.left);
        if (imageY) imageY.value = parseInt(element.style.top);
        
        // 이벤트 리스너 추가
        setupImageEditor(element);
    }
}

function setupImageEditor(element) {
    const imageWidth = document.getElementById('image-width');
    const imageHeight = document.getElementById('image-height');
    const imageX = document.getElementById('image-x');
    const imageY = document.getElementById('image-y');
    
    if (imageWidth) {
        imageWidth.oninput = function() {
            element.style.width = this.value + 'px';
        };
    }
    
    if (imageHeight) {
        imageHeight.oninput = function() {
            element.style.height = this.value + 'px';
        };
    }
    
    if (imageX) {
        imageX.onchange = function() {
            element.style.left = this.value + 'px';
        };
    }
    
    if (imageY) {
        imageY.onchange = function() {
            element.style.top = this.value + 'px';
        };
    }
}
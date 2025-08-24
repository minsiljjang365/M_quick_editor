// editor.js - PPT 편집기 관련 함수들

function updatePPTEditor(element) {
    // 모든 편집기 숨김
    document.getElementById('no-selection').style.display = 'none';
    document.getElementById('text-editor').style.display = 'none';
    document.getElementById('image-editor').style.display = 'none';
    
    if (element.classList.contains('canvas-text')) {
        // 텍스트 편집기 표시
        document.getElementById('text-editor').style.display = 'block';
        
        // 현재 값 설정
        document.getElementById('text-content').value = element.textContent;
        document.getElementById('text-size').value = parseInt(getComputedStyle(element).fontSize);
        document.getElementById('text-color').value = rgbToHex(getComputedStyle(element).color);
        document.getElementById('text-x').value = parseInt(element.style.left);
        document.getElementById('text-y').value = parseInt(element.style.top);
        
        // 이벤트 리스너 추가
        setupTextEditor(element);
        
    } else if (element.classList.contains('canvas-image')) {
        // 이미지 편집기 표시
        document.getElementById('image-editor').style.display = 'block';
        
        // 현재 값 설정
        document.getElementById('image-width').value = parseInt(element.style.width);
        document.getElementById('image-height').value = parseInt(element.style.height);
        document.getElementById('image-x').value = parseInt(element.style.left);
        document.getElementById('image-y').value = parseInt(element.style.top);
        
        // 이벤트 리스너 추가
        setupImageEditor(element);
    }
}

function setupTextEditor(element) {
    const textContent = document.getElementById('text-content');
    const textSize = document.getElementById('text-size');
    const textColor = document.getElementById('text-color');
    const textX = document.getElementById('text-x');
    const textY = document.getElementById('text-y');
    
    textContent.oninput = function() {
        element.textContent = this.value;
    };
    
    textSize.oninput = function() {
        element.style.fontSize = this.value + 'px';
    };
    
    textColor.onchange = function() {
        element.style.color = this.value;
    };
    
    textX.onchange = function() {
        element.style.left = this.value + 'px';
    };
    
    textY.onchange = function() {
        element.style.top = this.value + 'px';
    };
}

function setupImageEditor(element) {
    const imageWidth = document.getElementById('image-width');
    const imageHeight = document.getElementById('image-height');
    const imageX = document.getElementById('image-x');
    const imageY = document.getElementById('image-y');
    
    imageWidth.oninput = function() {
        element.style.width = this.value + 'px';
    };
    
    imageHeight.oninput = function() {
        element.style.height = this.value + 'px';
    };
    
    imageX.onchange = function() {
        element.style.left = this.value + 'px';
    };
    
    imageY.onchange = function() {
        element.style.top = this.value + 'px';
    };
}
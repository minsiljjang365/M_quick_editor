// ========== 편집기 컨트롤 관련 함수들 ==========

// ========== 탭 전환 함수 ==========
function switchEditorTab(tabName) {
    // 모든 탭 비활성화
    const tabs = document.querySelectorAll('.editor-tab');
    const contents = document.querySelectorAll('.editor-tab-content');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.style.backgroundColor = '#555';
        tab.style.color = '#ccc';
    });
    contents.forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    const selectedTab = document.querySelector(`[onclick="switchEditorTab('${tabName}')"]`);
    const selectedContent = document.getElementById(`${tabName}-tab`);
    
    if (selectedTab) {
        selectedTab.classList.add('active');
        selectedTab.style.backgroundColor = '#007bff';
        selectedTab.style.color = 'white';
    }
    if (selectedContent) selectedContent.classList.add('active');
        
        // 텍스트 탭으로 전환할 때 선택된 텍스트 요소가 있으면 편집 도구에 로드
        if (tabName === 'text' && selectedElement && selectedElement.classList.contains('canvas-text')) {
            loadTextToEditor(selectedElement);
        }
        
        console.log('편집기 탭 전환:', tabName);
    }

// ========== 텍스트 편집 함수들 ==========
function updateTextFontSize(size) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.fontSize = size + 'px';
    document.getElementById('text-font-size-value').textContent = size + 'px';
    saveCanvasState();
}

function updateTextColor(color) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.color = color;
    saveCanvasState();
}

function updateTextBgColor(color) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.backgroundColor = color;
    saveCanvasState();
}

function toggleTextBold() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    const currentWeight = selectedElement.style.fontWeight;
    selectedElement.style.fontWeight = currentWeight === 'bold' ? 'normal' : 'bold';
    
    const btn = document.getElementById('text-bold-btn');
    if (btn) {
        btn.classList.toggle('active');
    }
    saveCanvasState();
}

function toggleTextItalic() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    const currentStyle = selectedElement.style.fontStyle;
    selectedElement.style.fontStyle = currentStyle === 'italic' ? 'normal' : 'italic';
    
    const btn = document.getElementById('text-italic-btn');
    if (btn) {
        btn.classList.toggle('active');
    }
    saveCanvasState();
}

function toggleTextUnderline() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    const currentDecoration = selectedElement.style.textDecoration;
    selectedElement.style.textDecoration = currentDecoration === 'underline' ? 'none' : 'underline';
    
    const btn = document.getElementById('text-underline-btn');
    if (btn) {
        btn.classList.toggle('active');
    }
    saveCanvasState();
}

// 텍스트 내용 실시간 연동
function syncTextContent() {
    const textContent = document.getElementById('text-content');
    if (textContent && selectedElement && selectedElement.classList.contains('canvas-text')) {
        selectedElement.innerHTML = textContent.value;
        saveCanvasState();
    }
}

// 선택된 텍스트 요소의 값을 편집 도구에 반영
function loadTextToEditor(element) {
    if (!element || !element.classList.contains('canvas-text')) return;
    
    const textContent = document.getElementById('text-content');
    const textColor = document.getElementById('text-color');
    const textBgColor = document.getElementById('text-bg-color');
    const textFontSize = document.getElementById('text-font-size');
    const textWidth = document.getElementById('text-width');
    const textHeight = document.getElementById('text-height');
    const textX = document.getElementById('text-x');
    const textY = document.getElementById('text-y');
    
    if (textContent) {
        textContent.value = element.textContent || element.innerHTML;
    }
    if (textColor) {
        textColor.value = rgb2hex(element.style.color) || '#ffffff';
    }
    if (textBgColor) {
        textBgColor.value = rgb2hex(element.style.backgroundColor) || '#000000';
    }
    if (textFontSize) {
        const fontSize = parseInt(element.style.fontSize) || 16;
        textFontSize.value = fontSize;
        document.getElementById('text-font-size-value').textContent = fontSize + 'px';
    }
    if (textWidth) {
        const width = parseInt(element.style.width) || 150;
        textWidth.value = width;
        document.getElementById('text-width-value').textContent = width + 'px';
    }
    if (textHeight) {
        const height = parseInt(element.style.height) || 50;
        textHeight.value = height;
        document.getElementById('text-height-value').textContent = height + 'px';
    }
    if (textX) {
        textX.value = parseInt(element.style.left) || 0;
    }
    if (textY) {
        textY.value = parseInt(element.style.top) || 0;
    }
}

// RGB를 HEX로 변환하는 헬퍼 함수
function rgb2hex(rgb) {
    if (!rgb || rgb.indexOf("rgb") === -1) return rgb;
    
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!rgb) return "#000000";
    
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// ========== 텍스트 크기 조절 함수들 ==========
function updateTextWidth(width) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    
    selectedElement.style.width = width + 'px';
    document.getElementById('text-width-value').textContent = width + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateTextHeight(height) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    
    selectedElement.style.height = height + 'px';
    document.getElementById('text-height-value').textContent = height + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateTextPosition() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    
    const x = document.getElementById('text-x').value;
    const y = document.getElementById('text-y').value;
    
    selectedElement.style.left = x + 'px';
    selectedElement.style.top = y + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

// ========== 이미지 편집 함수들 ==========
function updateImageWidth(width) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    
    selectedElement.style.width = width + 'px';
    document.getElementById('image-width-value').textContent = width + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateImageHeight(height) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    
    selectedElement.style.height = height + 'px';
    document.getElementById('image-height-value').textContent = height + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateImagePosition() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    
    const x = document.getElementById('image-x').value;
    const y = document.getElementById('image-y').value;
    
    selectedElement.style.left = x + 'px';
    selectedElement.style.top = y + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateImageOpacity(opacity) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    selectedElement.style.opacity = opacity / 100;
    document.getElementById('image-opacity-value').textContent = opacity + '%';
    saveCanvasState();
}

function updateImageRotation(angle) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    selectedElement.style.transform = `rotate(${angle}deg)`;
    document.getElementById('image-rotation-value').textContent = angle + '°';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function flipImageH() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    const currentTransform = selectedElement.style.transform || '';
    const hasFlipX = currentTransform.includes('scaleX(-1)');
    
    if (hasFlipX) {
        selectedElement.style.transform = currentTransform.replace('scaleX(-1)', 'scaleX(1)');
    } else {
        selectedElement.style.transform = currentTransform + ' scaleX(-1)';
    }
    saveCanvasState();
}

function flipImageV() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    const currentTransform = selectedElement.style.transform || '';
    const hasFlipY = currentTransform.includes('scaleY(-1)');
    
    if (hasFlipY) {
        selectedElement.style.transform = currentTransform.replace('scaleY(-1)', 'scaleY(1)');
    } else {
        selectedElement.style.transform = currentTransform + ' scaleY(-1)';
    }
    saveCanvasState();
}

function rotateImage(angle) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    
    const currentRotation = parseInt(document.getElementById('image-rotation').value) || 0;
    const newRotation = (currentRotation + angle) % 360;
    
    document.getElementById('image-rotation').value = newRotation;
    updateImageRotation(newRotation);
}

function resetImageSize() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    
    selectedElement.style.width = '150px';
    selectedElement.style.height = 'auto';
    
    document.getElementById('image-width').value = 150;
    document.getElementById('image-height').value = 150;
    document.getElementById('image-width-value').textContent = '150px';
    document.getElementById('image-height-value').textContent = '150px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function toggleAspectRatio() {
    const btn = document.getElementById('lock-ratio-btn');
    btn.classList.toggle('active');
    
    if (btn.classList.contains('active')) {
        btn.innerHTML = '🔓 비율해제';
        btn.style.background = '#007bff';
    } else {
        btn.innerHTML = '🔒 비율고정';
        btn.style.background = '#555';
    }
}

function applyImageFilter(filter) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    
    let filterValue = '';
    switch(filter) {
        case 'none':
            filterValue = 'none';
            break;
        case 'grayscale':
            filterValue = 'grayscale(100%)';
            break;
        case 'sepia':
            filterValue = 'sepia(100%)';
            break;
        case 'blur':
            filterValue = 'blur(2px)';
            break;
    }
    
    selectedElement.style.filter = filterValue;
    saveCanvasState();
}

// ========== 도형 편집 함수들 ==========
function updateShapeWidth(width) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    
    selectedElement.style.width = width + 'px';
    document.getElementById('shape-width-value').textContent = width + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateShapeHeight(height) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    
    selectedElement.style.height = height + 'px';
    document.getElementById('shape-height-value').textContent = height + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateShapePosition() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    
    const x = document.getElementById('shape-x').value;
    const y = document.getElementById('shape-y').value;
    
    selectedElement.style.left = x + 'px';
    selectedElement.style.top = y + 'px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function updateShapeBgColor(color) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.backgroundColor = color;
    saveCanvasState();
}

function updateShapeBorderColor(color) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.borderColor = color;
    saveCanvasState();
}

function updateShapeBorderWidth(width) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.borderWidth = width + 'px';
    selectedElement.style.borderStyle = width > 0 ? 'solid' : 'none';
    document.getElementById('shape-border-width-value').textContent = width + 'px';
    saveCanvasState();
}

function updateShapeOpacity(opacity) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.opacity = opacity / 100;
    document.getElementById('shape-opacity-value').textContent = opacity + '%';
    saveCanvasState();
}

function updateShapeRotation(angle) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.transform = `rotate(${angle}deg)`;
    document.getElementById('shape-rotation-value').textContent = angle + '°';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

function rotateShape(angle) {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    
    const currentRotation = parseInt(document.getElementById('shape-rotation').value) || 0;
    const newRotation = (currentRotation + angle) % 360;
    
    document.getElementById('shape-rotation').value = newRotation;
    updateShapeRotation(newRotation);
}

function toggleShapeAspectRatio() {
    // 비율 고정 기능 구현
    const btn = document.getElementById('shape-lock-ratio-btn');
    btn.classList.toggle('active');
    
    if (btn.classList.contains('active')) {
        btn.innerHTML = '🔓 비율해제';
        btn.style.background = '#007bff';
    } else {
        btn.innerHTML = '🔒 비율고정';
        btn.style.background = '#555';
    }
}

function resetShapeSize() {
    if (!selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    
    selectedElement.style.width = '120px';
    selectedElement.style.height = '80px';
    
    document.getElementById('shape-width').value = 120;
    document.getElementById('shape-height').value = 80;
    document.getElementById('shape-width-value').textContent = '120px';
    document.getElementById('shape-height-value').textContent = '80px';
    
    // 리사이즈 핸들 업데이트
    if (typeof updateResizeHandles === 'function') {
        updateResizeHandles();
    }
    
    saveCanvasState();
}

// ========== 요소 추가 함수들 ==========
function addQuickText() {
    // 텍스트 요소 추가
    const canvas = document.getElementById('canvas');
    const textElement = document.createElement('div');
    textElement.className = 'canvas-element canvas-text';
    textElement.innerHTML = '텍스트 입력';
    textElement.contentEditable = true;
    textElement.style.position = 'absolute';
    textElement.style.left = '50px';
    textElement.style.top = '50px';
    textElement.style.cursor = 'move';
    
    // 드래그 기능을 위한 이벤트 처리
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    textElement.addEventListener('mousedown', function(e) {
        // 텍스트 편집 중이 아닐 때만 드래그 시작
        if (!this.isContentEditable || e.ctrlKey) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = parseInt(this.style.left) || 0;
            initialY = parseInt(this.style.top) || 0;
            this.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging && textElement) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            textElement.style.left = (initialX + deltaX) + 'px';
            textElement.style.top = (initialY + deltaY) + 'px';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging && textElement) {
            isDragging = false;
            textElement.style.cursor = 'move';
        }
    });
    
    textElement.onclick = function() {
        selectElement(this);
        switchEditorTab('text'); // 이 줄 추가
        loadTextToEditor(this);
    };

    // 여기에 추가
    textElement.addEventListener('input', function() {
        const textContent = document.getElementById('text-content');
        if (textContent && document.getElementById('text-tab').classList.contains('active')) {
            textContent.value = this.textContent || this.innerHTML;
        }
    });

    textElement.addEventListener('blur', function() {
        const textContent = document.getElementById('text-content');
        if (textContent && document.getElementById('text-tab').classList.contains('active')) {
            textContent.value = this.textContent || this.innerHTML;
        }
    });
    
    canvas.appendChild(textElement);
    
    // 텍스트 탭으로 이동
    switchEditorTab('text');
    
    // 요소 선택
    if (typeof selectElement === 'function') {
        selectElement(textElement);
    }
    
    console.log('텍스트 요소 추가 및 텍스트 탭으로 이동');
}

function addQuickImage() {
    // 파일 선택 다이얼로그 열기
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // 이미지 요소 추가
                const canvas = document.getElementById('canvas');
                const imgElement = document.createElement('img');
                imgElement.className = 'canvas-element canvas-image';
                imgElement.src = event.target.result;
                imgElement.style.position = 'absolute';
                imgElement.style.left = '50px';
                imgElement.style.top = '100px';
                imgElement.style.width = '100px';
                imgElement.style.height = 'auto';
                imgElement.style.cursor = 'move';
                imgElement.onclick = function() {
                    selectElement(this);
                    switchEditorTab('image'); // 이 줄 추가
                };
                
                canvas.appendChild(imgElement);
                
                // 요소 선택
                if (typeof selectElement === 'function') {
                    selectElement(imgElement);
                }
                
                console.log('이미지 요소 추가');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
    
    // 이미지 탭으로 이동
    switchEditorTab('image');
    console.log('이미지 파일 선택 및 이미지 탭으로 이동');
}

function addQuickShape(shapeType) {
    // 도형 요소 추가
    const canvas = document.getElementById('canvas');
    const shapeElement = document.createElement('div');
    shapeElement.className = 'canvas-element canvas-shape';
    shapeElement.style.position = 'absolute';
    shapeElement.style.left = '50px';
    shapeElement.style.top = '150px';
    shapeElement.style.width = '80px';
    shapeElement.style.height = '80px';
    shapeElement.style.cursor = 'move';
    
    if (shapeType === 'circle') {
        shapeElement.style.borderRadius = '50%';
        shapeElement.style.backgroundColor = '#667eea';
    } else if (shapeType === 'rectangle') {
        shapeElement.style.backgroundColor = '#667eea';
    }
    
    shapeElement.onclick = function() {
        selectElement(this);
        switchEditorTab('shape'); // 이 줄 추가
    };
    
    canvas.appendChild(shapeElement);
    
    // 도형 탭으로 이동
    switchEditorTab('shape');
    
    // 요소 선택
    if (typeof selectElement === 'function') {
        selectElement(shapeElement);
    }
    
    console.log(`${shapeType} 도형 추가 및 도형 탭으로 이동`);
}

function addQuickVideo() {
    // 동영상 파일 선택 다이얼로그 열기
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // 동영상 요소 추가
            const canvas = document.getElementById('canvas');
            const videoElement = document.createElement('video');
            videoElement.className = 'canvas-element canvas-video';
            videoElement.src = URL.createObjectURL(file);
            videoElement.controls = true;
            videoElement.style.position = 'absolute';
            videoElement.style.left = '50px';
            videoElement.style.top = '200px';
            videoElement.style.width = '120px';
            videoElement.style.height = 'auto';
            videoElement.style.cursor = 'move';
            videoElement.onclick = function() {
                selectElement(this);
                switchEditorTab('video'); // 이 줄 추가
            };
            
            canvas.appendChild(videoElement);
            
            // 요소 선택
            if (typeof selectElement === 'function') {
                selectElement(videoElement);
            }
            
            console.log('동영상 요소 추가');
        }
    };
    
    input.click();
    
    // 동영상 탭으로 이동
    switchEditorTab('video');
    console.log('동영상 파일 선택 및 동영상 탭으로 이동');
}

function addQuickAudio() {
    // 음성 파일 선택 다이얼로그 열기
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // 음성 요소 추가 (화면에는 보이지 않는 컨트롤러)
            const canvas = document.getElementById('canvas');
            const audioElement = document.createElement('audio');
            audioElement.className = 'canvas-element canvas-audio';
            audioElement.src = URL.createObjectURL(file);
            audioElement.controls = true;
            audioElement.style.position = 'absolute';
            audioElement.style.left = '50px';
            audioElement.style.top = '250px';
            audioElement.style.width = '200px';
            audioElement.style.cursor = 'move';
            audioElement.onclick = function() {
                selectElement(this);
                switchEditorTab('audio'); // 이 줄 추가
            };
            
            canvas.appendChild(audioElement);
            
            // 요소 선택
            if (typeof selectElement === 'function') {
                selectElement(audioElement);
            }
            
            console.log('음성 요소 추가');
        }
    };
    
    input.click();
    
    // 음성 탭으로 이동
    switchEditorTab('audio');
    console.log('음성 파일 선택 및 음성 탭으로 이동');
}
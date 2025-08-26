// ========== 편집기 컨트롤 관리 ==========
// 이 파일은 편집기의 탭 전환과 각 요소별 편집 기능을 담당합니다.

// ========== 1. 탭 전환 시스템 ==========
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
        
    // 선택된 요소가 있으면 편집 도구에 로드
    if (typeof selectedElement !== 'undefined' && selectedElement) {
        if (tabName === 'text' && selectedElement.classList.contains('canvas-text')) {
            loadTextToEditor(selectedElement);
        } else if (tabName === 'image' && selectedElement.classList.contains('canvas-image')) {
            loadImageToEditor(selectedElement);
        } else if (tabName === 'shape' && selectedElement.classList.contains('canvas-shape')) {
            loadShapeToEditor(selectedElement);
        }
    }
    
    console.log('편집기 탭 전환:', tabName);
}

// ========== 2. 요소 추가 함수들 ==========
function addQuickText() {
    const canvas = document.getElementById('canvas');
    const textElement = document.createElement('div');
    
    // 기본 속성 설정
    textElement.className = 'canvas-element canvas-text';
    textElement.innerHTML = '텍스트 입력';
    textElement.contentEditable = true;
    textElement.style.position = 'absolute';
    textElement.style.left = '50px';
    textElement.style.top = '50px';
    textElement.style.width = '150px';
    textElement.style.height = '50px';
    textElement.style.fontSize = '16px';
    textElement.style.color = '#ffffff';
    textElement.style.backgroundColor = 'transparent';
    textElement.style.cursor = 'move';
    textElement.style.padding = '5px';
    textElement.style.border = '1px dashed transparent';
    
    // 클릭 이벤트 - 요소 선택 및 탭 이동
    textElement.onclick = function(e) {
        e.stopPropagation();
        if (typeof selectElement === 'function') {
            selectElement(this);
        }
        switchEditorTab('text');
        loadTextToEditor(this);
    };
    
    // 텍스트 변경 시 동기화
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
    
    // 텍스트 탭으로 이동 및 요소 선택
    switchEditorTab('text');
    if (typeof selectElement === 'function') {
        selectElement(textElement);
    }
    
    console.log('텍스트 요소 추가 및 텍스트 탭으로 이동');
}

function addQuickImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const canvas = document.getElementById('canvas');
                const imgElement = document.createElement('img');
                
                // 기본 속성 설정
                imgElement.className = 'canvas-element canvas-image';
                imgElement.src = event.target.result;
                imgElement.style.position = 'absolute';
                imgElement.style.left = '50px';
                imgElement.style.top = '100px';
                imgElement.style.width = '150px';
                imgElement.style.height = 'auto';
                imgElement.style.cursor = 'move';
                imgElement.style.border = '1px dashed transparent';
                
                // 클릭 이벤트 - 요소 선택 및 탭 이동
                imgElement.onclick = function(e) {
                    e.stopPropagation();
                    if (typeof selectElement === 'function') {
                        selectElement(this);
                    }
                    switchEditorTab('image');
                    loadImageToEditor(this);
                };
                
                canvas.appendChild(imgElement);
                
                // 이미지 탭으로 이동 및 요소 선택
                switchEditorTab('image');
                if (typeof selectElement === 'function') {
                    selectElement(imgElement);
                }
                
                console.log('이미지 요소 추가 및 이미지 탭으로 이동');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function addQuickShape(shapeType) {
    const canvas = document.getElementById('canvas');
    const shapeElement = document.createElement('div');
    
    // 기본 속성 설정
    shapeElement.className = 'canvas-element canvas-shape';
    shapeElement.style.position = 'absolute';
    shapeElement.style.left = '50px';
    shapeElement.style.top = '150px';
    shapeElement.style.width = '120px';
    shapeElement.style.height = '80px';
    shapeElement.style.cursor = 'move';
    shapeElement.style.border = '1px dashed transparent';
    
    // 도형 타입별 스타일 적용
    if (shapeType === 'circle') {
        shapeElement.style.borderRadius = '50%';
        shapeElement.style.backgroundColor = '#667eea';
        shapeElement.style.width = '80px';
        shapeElement.style.height = '80px';
    } else if (shapeType === 'rectangle') {
        shapeElement.style.backgroundColor = '#667eea';
        shapeElement.style.borderRadius = '4px';
    }
    
    // 클릭 이벤트 - 요소 선택 및 탭 이동
    shapeElement.onclick = function(e) {
        e.stopPropagation();
        if (typeof selectElement === 'function') {
            selectElement(this);
        }
        switchEditorTab('shape');
        loadShapeToEditor(this);
    };
    
    canvas.appendChild(shapeElement);
    
    // 도형 탭으로 이동 및 요소 선택
    switchEditorTab('shape');
    if (typeof selectElement === 'function') {
        selectElement(shapeElement);
    }
    
    console.log(`${shapeType} 도형 추가 및 도형 탭으로 이동`);
}

function addQuickVideo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const canvas = document.getElementById('canvas');
            const videoElement = document.createElement('video');
            
            // 기본 속성 설정
            videoElement.className = 'canvas-element canvas-video';
            videoElement.src = URL.createObjectURL(file);
            videoElement.controls = true;
            videoElement.style.position = 'absolute';
            videoElement.style.left = '50px';
            videoElement.style.top = '200px';
            videoElement.style.width = '200px';
            videoElement.style.height = 'auto';
            videoElement.style.cursor = 'move';
            videoElement.style.border = '1px dashed transparent';
            
            // 클릭 이벤트 - 요소 선택 및 탭 이동
            videoElement.onclick = function(e) {
                e.stopPropagation();
                if (typeof selectElement === 'function') {
                    selectElement(this);
                }
                switchEditorTab('video');
                loadVideoToEditor(this);
            };
            
            canvas.appendChild(videoElement);
            
            // 비디오 탭으로 이동 및 요소 선택
            switchEditorTab('video');
            if (typeof selectElement === 'function') {
                selectElement(videoElement);
            }
            
            console.log('동영상 요소 추가 및 동영상 탭으로 이동');
        }
    };
    
    input.click();
}

function addQuickAudio() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const canvas = document.getElementById('canvas');
            const audioElement = document.createElement('audio');
            
            // 기본 속성 설정
            audioElement.className = 'canvas-element canvas-audio';
            audioElement.src = URL.createObjectURL(file);
            audioElement.controls = true;
            audioElement.style.position = 'absolute';
            audioElement.style.left = '50px';
            audioElement.style.top = '250px';
            audioElement.style.width = '250px';
            audioElement.style.cursor = 'move';
            audioElement.style.border = '1px dashed transparent';
            
            // 클릭 이벤트 - 요소 선택 및 탭 이동
            audioElement.onclick = function(e) {
                e.stopPropagation();
                if (typeof selectElement === 'function') {
                    selectElement(this);
                }
                switchEditorTab('audio');
                loadAudioToEditor(this);
            };
            
            canvas.appendChild(audioElement);
            
            // 오디오 탭으로 이동 및 요소 선택
            switchEditorTab('audio');
            if (typeof selectElement === 'function') {
                selectElement(audioElement);
            }
            
            console.log('음성 요소 추가 및 음성 탭으로 이동');
        }
    };
    
    input.click();
}

// ========== 3. 텍스트 편집 함수들 ==========
function updateTextFontSize(size) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.fontSize = size + 'px';
    document.getElementById('text-font-size-value').textContent = size + 'px';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateTextColor(color) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.color = color;
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateTextBgColor(color) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.backgroundColor = color;
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function toggleTextBold() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    const currentWeight = selectedElement.style.fontWeight;
    selectedElement.style.fontWeight = currentWeight === 'bold' ? 'normal' : 'bold';
    
    const btn = document.getElementById('text-bold-btn');
    if (btn) btn.classList.toggle('active');
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function toggleTextItalic() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    const currentStyle = selectedElement.style.fontStyle;
    selectedElement.style.fontStyle = currentStyle === 'italic' ? 'normal' : 'italic';
    
    const btn = document.getElementById('text-italic-btn');
    if (btn) btn.classList.toggle('active');
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function toggleTextUnderline() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    const currentDecoration = selectedElement.style.textDecoration;
    selectedElement.style.textDecoration = currentDecoration === 'underline' ? 'none' : 'underline';
    
    const btn = document.getElementById('text-underline-btn');
    if (btn) btn.classList.toggle('active');
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function syncTextContent() {
    const textContent = document.getElementById('text-content');
    if (textContent && typeof selectedElement !== 'undefined' && selectedElement && selectedElement.classList.contains('canvas-text')) {
        selectedElement.innerHTML = textContent.value;
        if (typeof saveCanvasState === 'function') saveCanvasState();
    }
}

function updateTextWidth(width) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.width = width + 'px';
    document.getElementById('text-width-value').textContent = width + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateTextHeight(height) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    selectedElement.style.height = height + 'px';
    document.getElementById('text-height-value').textContent = height + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateTextPosition() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-text')) return;
    const x = document.getElementById('text-x').value;
    const y = document.getElementById('text-y').value;
    selectedElement.style.left = x + 'px';
    selectedElement.style.top = y + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

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
    
    if (textContent) textContent.value = element.textContent || element.innerHTML;
    if (textColor) textColor.value = rgb2hex(element.style.color) || '#ffffff';
    if (textBgColor) textBgColor.value = rgb2hex(element.style.backgroundColor) || '#000000';
    
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
    if (textX) textX.value = parseInt(element.style.left) || 0;
    if (textY) textY.value = parseInt(element.style.top) || 0;
}

// ========== 4. 이미지 편집 함수들 ==========
function updateImageWidth(width) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    selectedElement.style.width = width + 'px';
    document.getElementById('image-width-value').textContent = width + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateImageHeight(height) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    selectedElement.style.height = height + 'px';
    document.getElementById('image-height-value').textContent = height + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateImagePosition() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    const x = document.getElementById('image-x').value;
    const y = document.getElementById('image-y').value;
    selectedElement.style.left = x + 'px';
    selectedElement.style.top = y + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateImageOpacity(opacity) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    selectedElement.style.opacity = opacity / 100;
    document.getElementById('image-opacity-value').textContent = opacity + '%';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateImageRotation(angle) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    selectedElement.style.transform = `rotate(${angle}deg)`;
    document.getElementById('image-rotation-value').textContent = angle + '°';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function flipImageH() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    const currentTransform = selectedElement.style.transform || '';
    const hasFlipX = currentTransform.includes('scaleX(-1)');
    selectedElement.style.transform = hasFlipX ? 
        currentTransform.replace('scaleX(-1)', 'scaleX(1)') : 
        currentTransform + ' scaleX(-1)';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function flipImageV() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    const currentTransform = selectedElement.style.transform || '';
    const hasFlipY = currentTransform.includes('scaleY(-1)');
    selectedElement.style.transform = hasFlipY ? 
        currentTransform.replace('scaleY(-1)', 'scaleY(1)') : 
        currentTransform + ' scaleY(-1)';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function rotateImage(angle) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    const currentRotation = parseInt(document.getElementById('image-rotation').value) || 0;
    const newRotation = (currentRotation + angle) % 360;
    document.getElementById('image-rotation').value = newRotation;
    updateImageRotation(newRotation);
}

function resetImageSize() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    selectedElement.style.width = '150px';
    selectedElement.style.height = 'auto';
    
    document.getElementById('image-width').value = 150;
    document.getElementById('image-height').value = 150;
    document.getElementById('image-width-value').textContent = '150px';
    document.getElementById('image-height-value').textContent = '150px';
    
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
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
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-image')) return;
    
    let filterValue = '';
    switch(filter) {
        case 'none': filterValue = 'none'; break;
        case 'grayscale': filterValue = 'grayscale(100%)'; break;
        case 'sepia': filterValue = 'sepia(100%)'; break;
        case 'blur': filterValue = 'blur(2px)'; break;
    }
    
    selectedElement.style.filter = filterValue;
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function loadImageToEditor(element) {
    if (!element || !element.classList.contains('canvas-image')) return;
    
    const imageWidth = document.getElementById('image-width');
    const imageHeight = document.getElementById('image-height');
    const imageX = document.getElementById('image-x');
    const imageY = document.getElementById('image-y');
    const imageOpacity = document.getElementById('image-opacity');
    const imageRotation = document.getElementById('image-rotation');
    
    if (imageWidth) {
        const width = parseInt(element.style.width) || 150;
        imageWidth.value = width;
        document.getElementById('image-width-value').textContent = width + 'px';
    }
    if (imageHeight) {
        const height = parseInt(element.style.height) || 150;
        imageHeight.value = height;
        document.getElementById('image-height-value').textContent = height + 'px';
    }
    if (imageX) imageX.value = parseInt(element.style.left) || 0;
    if (imageY) imageY.value = parseInt(element.style.top) || 0;
    if (imageOpacity) {
        const opacity = Math.round((parseFloat(element.style.opacity) || 1) * 100);
        imageOpacity.value = opacity;
        document.getElementById('image-opacity-value').textContent = opacity + '%';
    }
    if (imageRotation) {
        const rotation = extractRotationFromTransform(element.style.transform);
        imageRotation.value = rotation;
        document.getElementById('image-rotation-value').textContent = rotation + '°';
    }
}

// ========== 5. 도형 편집 함수들 ==========
function updateShapeWidth(width) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.width = width + 'px';
    document.getElementById('shape-width-value').textContent = width + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateShapeHeight(height) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.height = height + 'px';
    document.getElementById('shape-height-value').textContent = height + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateShapePosition() {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    const x = document.getElementById('shape-x').value;
    const y = document.getElementById('shape-y').value;
    selectedElement.style.left = x + 'px';
    selectedElement.style.top = y + 'px';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateShapeBgColor(color) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.backgroundColor = color;
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateShapeBorderColor(color) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.borderColor = color;
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateShapeBorderWidth(width) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.borderWidth = width + 'px';
    selectedElement.style.borderStyle = width > 0 ? 'solid' : 'none';
    document.getElementById('shape-border-width-value').textContent = width + 'px';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateShapeOpacity(opacity) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.opacity = opacity / 100;
    document.getElementById('shape-opacity-value').textContent = opacity + '%';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function updateShapeRotation(angle) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.transform = `rotate(${angle}deg)`;
    document.getElementById('shape-rotation-value').textContent = angle + '°';
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function rotateShape(angle) {
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    const currentRotation = parseInt(document.getElementById('shape-rotation').value) || 0;
    const newRotation = (currentRotation + angle) % 360;
    document.getElementById('shape-rotation').value = newRotation;
    updateShapeRotation(newRotation);
}

function toggleShapeAspectRatio() {
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
    if (typeof selectedElement === 'undefined' || !selectedElement || !selectedElement.classList.contains('canvas-shape')) return;
    selectedElement.style.width = '120px';
    selectedElement.style.height = '80px';
    
    document.getElementById('shape-width').value = 120;
    document.getElementById('shape-height').value = 80;
    document.getElementById('shape-width-value').textContent = '120px';
    document.getElementById('shape-height-value').textContent = '80px';
    
    if (typeof updateResizeHandles === 'function') updateResizeHandles();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function loadShapeToEditor(element) {
    if (!element || !element.classList.contains('canvas-shape')) return;
    
    const shapeWidth = document.getElementById('shape-width');
    const shapeHeight = document.getElementById('shape-height');
    const shapeX = document.getElementById('shape-x');
    const shapeY = document.getElementById('shape-y');
    const shapeBgColor = document.getElementById('shape-bg-color');
    const shapeBorderColor = document.getElementById('shape-border-color');
    const shapeBorderWidth = document.getElementById('shape-border-width');
    const shapeOpacity = document.getElementById('shape-opacity');
    const shapeRotation = document.getElementById('shape-rotation');
    
    if (shapeWidth) {
        const width = parseInt(element.style.width) || 120;
        shapeWidth.value = width;
        document.getElementById('shape-width-value').textContent = width + 'px';
    }
    if (shapeHeight) {
        const height = parseInt(element.style.height) || 80;
        shapeHeight.value = height;
        document.getElementById('shape-height-value').textContent = height + 'px';
    }
    if (shapeX) shapeX.value = parseInt(element.style.left) || 0;
    if (shapeY) shapeY.value = parseInt(element.style.top) || 0;
    if (shapeBgColor) shapeBgColor.value = rgb2hex(element.style.backgroundColor) || '#667eea';
    if (shapeBorderColor) shapeBorderColor.value = rgb2hex(element.style.borderColor) || '#333333';
    if (shapeBorderWidth) {
        const borderWidth = parseInt(element.style.borderWidth) || 0;
        shapeBorderWidth.value = borderWidth;
        document.getElementById('shape-border-width-value').textContent = borderWidth + 'px';
    }
    if (shapeOpacity) {
        const opacity = Math.round((parseFloat(element.style.opacity) || 1) * 100);
        shapeOpacity.value = opacity;
        document.getElementById('shape-opacity-value').textContent = opacity + '%';
    }
    if (shapeRotation) {
        const rotation = extractRotationFromTransform(element.style.transform);
        shapeRotation.value = rotation;
        document.getElementById('shape-rotation-value').textContent = rotation + '°';
    }
}

// ========== 6. 비디오/오디오 편집 함수들 (기본 구조) ==========
function loadVideoToEditor(element) {
    console.log('비디오 편집 도구 로드:', element);
    // 비디오 편집 관련 함수들은 필요에 따라 구현
}

function loadAudioToEditor(element) {
    console.log('오디오 편집 도구 로드:', element);
    // 오디오 편집 관련 함수들은 필요에 따라 구현
}

// ========== 7. 유틸리티 함수들 ==========
function rgb2hex(rgb) {
    if (!rgb || rgb.indexOf("rgb") === -1) return rgb;
    
    const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!rgbMatch) return "#000000";
    
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgbMatch[1]) + hex(rgbMatch[2]) + hex(rgbMatch[3]);
}

function extractRotationFromTransform(transform) {
    if (!transform) return 0;
    const match = transform.match(/rotate\((-?\d+)deg\)/);
    return match ? parseInt(match[1]) : 0;
}
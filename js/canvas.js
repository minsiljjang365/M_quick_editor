// canvas.js - 캔버스 관리 및 모든 편집 기능들 (완전판 + PPT 방식 + 자동저장)

// 전역 변수
let selectedElement = null;
let elementCounter = 0;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let canvasZoom = 1.0;
let clipboard = null;

// PPT 방식 추가 변수들
let resizeHandles = [];
let isResizing = false;
let resizeHandle = '';
let startRect = {};

// ===========================================
// 🎯 요소 추가 기능들
// ===========================================

// 빠른 텍스트 추가 (PPT 방식)
function addQuickText() {
    const canvas = document.getElementById('canvas');
    const textElement = document.createElement('div');
    
    textElement.className = 'canvas-element canvas-text';
    textElement.contentEditable = true;
    textElement.innerHTML = '텍스트를 입력하세요';
    textElement.style.left = '50px';
    textElement.style.top = '50px';
    textElement.style.position = 'absolute';
    textElement.style.minWidth = '100px';
    textElement.style.minHeight = '30px';
    textElement.style.padding = '8px';
    textElement.style.fontSize = '16px';
    textElement.style.color = '#000';
    textElement.style.background = 'rgba(255,255,255,0.9)';
    textElement.style.border = '1px dashed #ccc';
    textElement.style.cursor = 'move';
    textElement.style.outline = 'none';
    textElement.style.wordWrap = 'break-word';
    textElement.style.zIndex = '5';
    textElement.id = 'text-' + (++elementCounter);
    
    // PPT 방식 이벤트 연결
    setupPPTEvents(textElement);
    
    canvas.appendChild(textElement);
    selectElementPPT(textElement);
    
    console.log('✅ PPT 방식 텍스트 추가됨');
}

// 빠른 이미지 추가
function addQuickImage() {
    const defaultImageSrc = 'https://via.placeholder.com/150x150/667eea/white?text=이미지';
    addImageElement(defaultImageSrc, 100, 100);
}

// 빠른 도형 추가
function addQuickShape(shapeType) {
    const canvas = document.getElementById('canvas');
    const element = document.createElement('div');
    
    element.className = 'canvas-element canvas-shape';
    element.style.left = '100px';
    element.style.top = '100px';
    element.style.position = 'absolute';
    element.style.cursor = 'move';
    element.id = 'element-' + (++elementCounter);
    element.style.zIndex = '8';
    
    if (shapeType === 'circle') {
        element.style.width = '80px';
        element.style.height = '80px';
        element.style.borderRadius = '50%';
        element.style.backgroundColor = '#667eea';
    } else if (shapeType === 'rectangle') {
        element.style.width = '120px';
        element.style.height = '80px';
        element.style.backgroundColor = '#667eea';
    }
    
    // PPT 방식 이벤트 연결
    setupPPTEvents(element);
    
    canvas.appendChild(element);
    selectElementPPT(element);
}

// 이미지 요소 추가 (개선된 버전)
function addImageElement(src, x, y) {
    const canvas = document.getElementById('canvas');
    const element = document.createElement('img');
    
    element.className = 'canvas-element canvas-image';
    element.src = src;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = '150px';
    element.style.height = '150px';
    element.style.position = 'absolute';
    element.style.cursor = 'move';
    element.id = 'element-' + (++elementCounter);
    element.style.zIndex = '5';
    
    // PPT 방식 이벤트 연결
    setupPPTEvents(element);
    
    canvas.appendChild(element);
    selectElementPPT(element);
}

// 템플릿을 배경으로 추가 (기존 함수 유지)
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
    bgElement.style.zIndex = '1';
    bgElement.style.pointerEvents = 'none';
    bgElement.id = 'background-template';
    bgElement.alt = templateName;
    
    canvas.insertBefore(bgElement, canvas.firstChild);
    
    console.log(`배경 템플릿 적용됨: ${templateName}`);
}

// ===========================================
// 🎨 PPT 방식 이벤트 시스템 (자동저장 통합)
// ===========================================

// PPT 방식 이벤트 설정 (자동저장 추가)
function setupPPTEvents(element) {
    // 클릭 이벤트 (선택)
    element.onclick = function(e) {
        selectElementPPT(this);
        e.stopPropagation();
    };
    
    // 더블클릭 이벤트 (편집)
    element.ondblclick = function(e) {
        if (this.classList.contains('canvas-text')) {
            this.focus();
            // 텍스트 전체 선택
            const range = document.createRange();
            range.selectNodeContents(this);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        e.stopPropagation();
    };
    
    // 🔥 텍스트 편집 자동저장 추가
    if (element.classList.contains('canvas-text')) {
        // 텍스트 입력 중 자동저장
        element.oninput = function() {
            console.log('📝 텍스트 변경됨, 자동저장 중...');
            if (typeof saveCanvasState === 'function') {
                // 500ms 후 저장 (너무 자주 저장하지 않도록)
                clearTimeout(element.saveTimeout);
                element.saveTimeout = setTimeout(() => {
                    saveCanvasState();
                    console.log('💾 텍스트 자동저장 완료');
                }, 500);
            }
        };
        
        // 포커스 잃을 때 즉시 저장
        element.onblur = function() {
            console.log('📝 텍스트 편집 종료, 즉시 저장');
            if (typeof saveCanvasState === 'function') {
                saveCanvasState();
            }
        };
        
        // Enter 키 입력시 저장
        element.onkeypress = function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                console.log('📝 Enter 키로 편집 종료, 저장');
                this.blur(); // 편집 모드 종료
                if (typeof saveCanvasState === 'function') {
                    saveCanvasState();
                }
            }
        };
    }
    
    // 드래그 시작
    element.onmousedown = function(e) {
        if (e.target.classList.contains('resize-handle')) {
            return; // 리사이즈 핸들 클릭시는 드래그 안함
        }
        startDragPPT(e, this);
        e.preventDefault();
    };
}

// PPT 방식 요소 선택
function selectElementPPT(element) {
    // 배경 템플릿은 선택 불가
    if (element.classList.contains('canvas-background-template')) {
        return;
    }
    
    // 기존 선택 해제
    clearSelectionPPT();
    
    // 새 요소 선택
    selectedElement = element;
    element.style.outline = '2px solid #0078d4';
    
    // PPT 방식 리사이즈 핸들 추가
    addResizeHandlesPPT(element);
    
    // 선택된 도구들 표시
    const selectedTools = document.getElementById('selected-tools');
    if (selectedTools) selectedTools.style.display = 'block';
    
    // PPT 편집기 업데이트
    if (typeof updatePPTEditor === 'function') {
        updatePPTEditor(element);
    }
    
    console.log('🎯 PPT 방식 선택됨:', element.id);
}

// PPT 방식 선택 해제
function clearSelectionPPT() {
    if (selectedElement) {
        selectedElement.style.outline = '';
        removeResizeHandlesPPT();
    }
    selectedElement = null;
    
    const selectedTools = document.getElementById('selected-tools');
    if (selectedTools) selectedTools.style.display = 'none';
}

// PPT 방식 리사이즈 핸들 추가
function addResizeHandlesPPT(element) {
    removeResizeHandlesPPT();
    
    const positions = [
        {name: 'nw', style: 'top: -4px; left: -4px; cursor: nw-resize;'},
        {name: 'n', style: 'top: -4px; left: 50%; transform: translateX(-50%); cursor: n-resize;'},
        {name: 'ne', style: 'top: -4px; right: -4px; cursor: ne-resize;'},
        {name: 'e', style: 'top: 50%; right: -4px; transform: translateY(-50%); cursor: e-resize;'},
        {name: 'se', style: 'bottom: -4px; right: -4px; cursor: se-resize;'},
        {name: 's', style: 'bottom: -4px; left: 50%; transform: translateX(-50%); cursor: s-resize;'},
        {name: 'sw', style: 'bottom: -4px; left: -4px; cursor: sw-resize;'},
        {name: 'w', style: 'top: 50%; left: -4px; transform: translateY(-50%); cursor: w-resize;'}
    ];
    
    positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = 'resize-handle resize-handle-' + pos.name;
        handle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: #0078d4;
            border: 1px solid white;
            z-index: 1000;
            ${pos.style}
        `;
        handle.dataset.direction = pos.name;
        
        // 리사이즈 이벤트
        handle.onmousedown = function(e) {
            startResizePPT(e, pos.name);
            e.stopPropagation();
            e.preventDefault();
        };
        
        element.appendChild(handle);
        resizeHandles.push(handle);
    });
}

// PPT 방식 리사이즈 핸들 제거
function removeResizeHandlesPPT() {
    resizeHandles.forEach(handle => {
        if (handle.parentNode) {
            handle.parentNode.removeChild(handle);
        }
    });
    resizeHandles = [];
}

// PPT 방식 드래그 시작
function startDragPPT(e, element) {
    isDragging = true;
    
    const rect = element.getBoundingClientRect();
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    element.style.zIndex = '999';
    
    // 전역 마우스 이벤트 연결
    document.onmousemove = function(e) {
        dragPPT(e, element);
    };
    
    document.onmouseup = function() {
        stopDragPPT(element);
    };
}

// PPT 방식 드래그
function dragPPT(e, element) {
    if (!isDragging) return;
    
    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    let newX = e.clientX - canvasRect.left - dragOffset.x;
    let newY = e.clientY - canvasRect.top - dragOffset.y;
    
    // 경계 제한
    newX = Math.max(0, Math.min(newX, canvas.offsetWidth - element.offsetWidth));
    newY = Math.max(0, Math.min(newY, canvas.offsetHeight - element.offsetHeight));
    
    element.style.left = newX + 'px';
    element.style.top = newY + 'px';
    
    // 편집기 위치값 업데이트
    updateEditorPositionValues(element);
}

// PPT 방식 드래그 종료
function stopDragPPT(element) {
    isDragging = false;
    element.style.zIndex = '';
    
    document.onmousemove = null;
    document.onmouseup = null;
    
    // 실시간 저장
    if (typeof saveCanvasState === 'function') {
        saveCanvasState();
    }
}

// PPT 방식 리사이즈 시작
function startResizePPT(e, direction) {
    isResizing = true;
    resizeHandle = direction;
    
    const rect = selectedElement.getBoundingClientRect();
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    
    startRect = {
        left: rect.left - canvasRect.left,
        top: rect.top - canvasRect.top,
        width: rect.width,
        height: rect.height,
        mouseX: e.clientX,
        mouseY: e.clientY
    };
    
    document.onmousemove = resizePPT;
    document.onmouseup = stopResizePPT;
}

// PPT 방식 리사이즈
function resizePPT(e) {
    if (!isResizing || !selectedElement) return;
    
    const deltaX = e.clientX - startRect.mouseX;
    const deltaY = e.clientY - startRect.mouseY;
    
    let newLeft = startRect.left;
    let newTop = startRect.top;
    let newWidth = startRect.width;
    let newHeight = startRect.height;
    
    // 방향에 따른 리사이즈
    switch (resizeHandle) {
        case 'se': // 우하단
            newWidth = Math.max(50, startRect.width + deltaX);
            newHeight = Math.max(30, startRect.height + deltaY);
            break;
        case 'sw': // 좌하단
            newWidth = Math.max(50, startRect.width - deltaX);
            newHeight = Math.max(30, startRect.height + deltaY);
            newLeft = startRect.left + deltaX;
            if (newWidth === 50) newLeft = startRect.left + startRect.width - 50;
            break;
        case 'ne': // 우상단
            newWidth = Math.max(50, startRect.width + deltaX);
            newHeight = Math.max(30, startRect.height - deltaY);
            newTop = startRect.top + deltaY;
            if (newHeight === 30) newTop = startRect.top + startRect.height - 30;
            break;
        case 'nw': // 좌상단
            newWidth = Math.max(50, startRect.width - deltaX);
            newHeight = Math.max(30, startRect.height - deltaY);
            newLeft = startRect.left + deltaX;
            newTop = startRect.top + deltaY;
            if (newWidth === 50) newLeft = startRect.left + startRect.width - 50;
            if (newHeight === 30) newTop = startRect.top + startRect.height - 30;
            break;
        case 'n': // 상단
            newHeight = Math.max(30, startRect.height - deltaY);
            newTop = startRect.top + deltaY;
            if (newHeight === 30) newTop = startRect.top + startRect.height - 30;
            break;
        case 's': // 하단
            newHeight = Math.max(30, startRect.height + deltaY);
            break;
        case 'e': // 우측
            newWidth = Math.max(50, startRect.width + deltaX);
            break;
        case 'w': // 좌측
            newWidth = Math.max(50, startRect.width - deltaX);
            newLeft = startRect.left + deltaX;
            if (newWidth === 50) newLeft = startRect.left + startRect.width - 50;
            break;
    }
    
    // 스타일 적용
    selectedElement.style.left = newLeft + 'px';
    selectedElement.style.top = newTop + 'px';
    selectedElement.style.width = newWidth + 'px';
    selectedElement.style.height = newHeight + 'px';
    
    // 편집기 위치값 업데이트
    updateEditorPositionValues(selectedElement);
}

// PPT 방식 리사이즈 종료
function stopResizePPT() {
    isResizing = false;
    resizeHandle = '';
    
    document.onmousemove = null;
    document.onmouseup = null;
    
    // 실시간 저장
    if (typeof saveCanvasState === 'function') {
        saveCanvasState();
    }
}

// ===========================================
// 💾 자동저장 및 프로젝트 관리
// ===========================================

// 캔버스 상태 자동저장
function saveCanvasState() {
    try {
        const projectData = {
            name: document.getElementById('project-title').textContent,
            canvas: document.getElementById('canvas').innerHTML,
            timestamp: new Date().toISOString(),
            elements: []
        };
        
        // 캔버스 요소들 수집
        const elements = document.querySelectorAll('.canvas-element:not(.canvas-background-template)');
        elements.forEach((element, index) => {
            const elementData = {
                id: element.id,
                type: getElementType(element),
                style: element.style.cssText,
                position: {
                    left: element.style.left,
                    top: element.style.top
                }
            };
            
            // 텍스트 내용 저장
            if (element.classList.contains('canvas-text')) {
                elementData.content = element.innerHTML;
                elementData.textContent = element.textContent;
            }
            // 이미지 소스 저장
            else if (element.classList.contains('canvas-image')) {
                elementData.src = element.src;
            }
            
            projectData.elements.push(elementData);
        });
        
        // localStorage에 저장
        localStorage.setItem('currentProject', JSON.stringify(projectData));
        localStorage.setItem('lastSaved', new Date().toLocaleString());
        
        console.log('💾 프로젝트 자동저장 완료:', projectData.elements.length + '개 요소');
        
    } catch (error) {
        console.error('❌ 자동저장 실패:', error);
    }
}

// 프로젝트 불러오기 (개선된 버전)
function loadProject() {
    const saved = localStorage.getItem('currentProject');
    if (saved) {
        try {
            const projectData = JSON.parse(saved);
            
            // 프로젝트 제목 복원
            document.getElementById('project-title').textContent = projectData.name;
            
            // 캔버스 초기화
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = '';
            
            // 요소들 복원
            projectData.elements.forEach(elementData => {
                let element;
                
                if (elementData.type === 'text') {
                    element = document.createElement('div');
                    element.className = 'canvas-element canvas-text';
                    element.contentEditable = true;
                    element.innerHTML = elementData.content || elementData.textContent || '텍스트를 입력하세요';
                } else if (elementData.type === 'image') {
                    element = document.createElement('img');
                    element.className = 'canvas-element canvas-image';
                    element.src = elementData.src;
                } else if (elementData.type === 'shape') {
                    element = document.createElement('div');
                    element.className = 'canvas-element canvas-shape';
                }
                
                if (element) {
                    element.id = elementData.id;
                    element.style.cssText = elementData.style;
                    element.style.position = 'absolute';
                    element.style.cursor = 'move';
                    
                    // PPT 방식 이벤트 연결
                    setupPPTEvents(element);
                    
                    canvas.appendChild(element);
                }
            });
            
            const lastSaved = localStorage.getItem('lastSaved');
            console.log(`📂 프로젝트 불러오기 완료: ${projectData.elements.length}개 요소 (저장시간: ${lastSaved})`);
            return true;
            
        } catch (error) {
            console.error('❌ 프로젝트 불러오기 실패:', error);
            localStorage.removeItem('currentProject'); // 손상된 데이터 제거
        }
    }
    return false;
}

// ===========================================
// 🖱️ 기존 드래그 이동 기능 (호환성 유지)
// ===========================================

function setupDragEvents(element) {
    element.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return; // 왼쪽 클릭만
        
        isDragging = true;
        const canvas = document.getElementById('canvas');
        const canvasRect = canvas.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // 드래그 오프셋 계산
        dragOffset.x = e.clientX - elementRect.left;
        dragOffset.y = e.clientY - elementRect.top;
        
        // 요소 선택
        selectElement(element);
        
        // 드래그 스타일 적용
        element.style.opacity = '0.7';
        element.style.zIndex = '999';
        
        e.preventDefault();
        e.stopPropagation();
    });
}

// 전역 마우스 이벤트 리스너 (init.js에서 호출)
function setupGlobalDragEvents() {
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !selectedElement) return;
        
        const canvas = document.getElementById('canvas');
        const canvasRect = canvas.getBoundingClientRect();
        
        // 새 위치 계산
        let newX = e.clientX - canvasRect.left - dragOffset.x;
        let newY = e.clientY - canvasRect.top - dragOffset.y;
        
        // 캔버스 경계 제한
        newX = Math.max(0, Math.min(newX, canvasRect.width - 50));
        newY = Math.max(0, Math.min(newY, canvasRect.height - 50));
        
        // 위치 업데이트
        selectedElement.style.left = newX + 'px';
        selectedElement.style.top = newY + 'px';
        
        // 편집기 위치 값 업데이트
        updateEditorPositionValues(selectedElement);
        
        e.preventDefault();
    });
    
    document.addEventListener('mouseup', function(e) {
        if (isDragging && selectedElement) {
            // 드래그 종료
            isDragging = false;
            selectedElement.style.opacity = '';
            selectedElement.style.zIndex = selectedElement.style.zIndex === '999' ? '5' : selectedElement.style.zIndex;
            
            // 실시간 저장
            if (typeof saveCanvasState === 'function') {
                saveCanvasState();
            }
        }
    });
}

// 편집기 위치값 업데이트
function updateEditorPositionValues(element) {
    const textX = document.getElementById('text-x');
    const textY = document.getElementById('text-y');
    const imageX = document.getElementById('image-x');
    const imageY = document.getElementById('image-y');
    
    if (element.classList.contains('canvas-text')) {
        if (textX) textX.value = parseInt(element.style.left);
        if (textY) textY.value = parseInt(element.style.top);
    } else if (element.classList.contains('canvas-image')) {
        if (imageX) imageX.value = parseInt(element.style.left);
        if (imageY) imageY.value = parseInt(element.style.top);
    }
}

// ===========================================
// 🎯 요소 선택 및 관리 (호환성 유지)
// ===========================================

// 요소 선택 (기존 함수 개선)
function selectElement(element) {
    // 배경 템플릿은 선택 불가
    if (element.classList.contains('canvas-background-template')) {
        return;
    }
    
    // 이전 선택 해제
    if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement.style.outline = '';
    }
    
    // 새 요소 선택
    selectedElement = element;
    element.classList.add('selected');
    element.style.outline = '2px solid #667eea';
    
    // 선택된 도구들 표시
    const selectedTools = document.getElementById('selected-tools');
    if (selectedTools) selectedTools.style.display = 'block';
    
    // PPT 편집기 업데이트
    if (typeof updatePPTEditor === 'function') {
        updatePPTEditor(element);
    }
}

// 선택 해제
function deselectAllElements() {
    clearSelectionPPT(); // PPT 방식으로 통합
}

// 선택된 요소 삭제 (기존 함수 유지)
function deleteSelectedElement() {
    if (selectedElement) {
        selectedElement.remove();
        selectedElement = null;
        
        // 편집기 초기화
        const noSelection = document.getElementById('no-selection');
        const textEditor = document.getElementById('text-editor');
        const imageEditor = document.getElementById('image-editor');
        const selectedTools = document.getElementById('selected-tools');
        
        if (noSelection) noSelection.style.display = 'block';
        if (textEditor) textEditor.style.display = 'none';
        if (imageEditor) imageEditor.style.display = 'none';
        if (selectedTools) selectedTools.style.display = 'none';
        
        // 실시간 저장
        if (typeof saveCanvasState === 'function') {
            saveCanvasState();
        }
    }
}

// ===========================================
// 📐 정렬 기능들
// ===========================================

function alignLeft() {
    if (!selectedElement) return;
    selectedElement.style.left = '10px';
    updateEditorPositionValues(selectedElement);
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function alignCenter() {
    if (!selectedElement) return;
    const canvas = document.getElementById('canvas');
    const canvasWidth = canvas.offsetWidth;
    const elementWidth = selectedElement.offsetWidth;
    const centerX = (canvasWidth - elementWidth) / 2;
    selectedElement.style.left = centerX + 'px';
    updateEditorPositionValues(selectedElement);
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function alignRight() {
    if (!selectedElement) return;
    const canvas = document.getElementById('canvas');
    const canvasWidth = canvas.offsetWidth;
    const elementWidth = selectedElement.offsetWidth;
    const rightX = canvasWidth - elementWidth - 10;
    selectedElement.style.left = rightX + 'px';
    updateEditorPositionValues(selectedElement);
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function alignTop() {
    if (!selectedElement) return;
    selectedElement.style.top = '10px';
    updateEditorPositionValues(selectedElement);
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function alignMiddle() {
    if (!selectedElement) return;
    const canvas = document.getElementById('canvas');
    const canvasHeight = canvas.offsetHeight;
    const elementHeight = selectedElement.offsetHeight;
    const middleY = (canvasHeight - elementHeight) / 2;
    selectedElement.style.top = middleY + 'px';
    updateEditorPositionValues(selectedElement);
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function alignBottom() {
    if (!selectedElement) return;
    const canvas = document.getElementById('canvas');
    const canvasHeight = canvas.offsetHeight;
    const elementHeight = selectedElement.offsetHeight;
    const bottomY = canvasHeight - elementHeight - 10;
    selectedElement.style.top = bottomY + 'px';
    updateEditorPositionValues(selectedElement);
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

// ===========================================
// 📚 레이어 관리
// ===========================================

function bringToFront() {
    if (!selectedElement) return;
    selectedElement.style.zIndex = '100';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function sendToBack() {
    if (!selectedElement) return;
    selectedElement.style.zIndex = '2';
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function moveForward() {
    if (!selectedElement) return;
    const currentZ = parseInt(selectedElement.style.zIndex) || 5;
    selectedElement.style.zIndex = (currentZ + 1).toString();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function moveBackward() {
    if (!selectedElement) return;
    const currentZ = parseInt(selectedElement.style.zIndex) || 5;
    selectedElement.style.zIndex = Math.max(2, currentZ - 1).toString();
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

// ===========================================
// 📋 복사/붙여넣기/그룹
// ===========================================

function copySelectedElement() {
    if (!selectedElement) return;
    
    clipboard = {
        className: selectedElement.className,
        innerHTML: selectedElement.innerHTML,
        textContent: selectedElement.textContent,
        src: selectedElement.src,
        style: selectedElement.style.cssText,
        type: getElementType(selectedElement)
    };
    
    console.log('요소 복사됨');
    
    // 시각적 피드백
    const originalOpacity = selectedElement.style.opacity;
    selectedElement.style.opacity = '0.5';
    setTimeout(() => {
        if (selectedElement) selectedElement.style.opacity = originalOpacity;
    }, 200);
}

function duplicateElement() {
    if (!selectedElement) return;
    
    const canvas = document.getElementById('canvas');
    const type = getElementType(selectedElement);
    let newElement;
    
    if (type === 'text') {
        newElement = document.createElement('div');
        newElement.textContent = selectedElement.textContent;
        newElement.onclick = function() {
            if (typeof selectTextElement === 'function') {
                selectTextElement(this);
            } else {
                selectElementPPT(this);
            }
        };
    } else if (type === 'image') {
        newElement = document.createElement('img');
        newElement.src = selectedElement.src;
        newElement.onclick = function() {
            selectElementPPT(this);
        };
    } else if (type === 'shape') {
        newElement = document.createElement('div');
        newElement.onclick = function() {
            selectElementPPT(this);
        };
    } else {
        return;
    }
    
    // 스타일 복사
    newElement.className = selectedElement.className;
    newElement.style.cssText = selectedElement.style.cssText;
    
    // 새 ID와 위치 설정
    newElement.id = 'element-' + (++elementCounter);
    const currentLeft = parseInt(selectedElement.style.left) || 0;
    const currentTop = parseInt(selectedElement.style.top) || 0;
    newElement.style.left = (currentLeft + 20) + 'px';
    newElement.style.top = (currentTop + 20) + 'px';
    
    // PPT 방식 이벤트 추가
    setupPPTEvents(newElement);
    
    canvas.appendChild(newElement);
    selectElementPPT(newElement);
    
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

function groupElements() {
    // 그룹 기능은 복잡하므로 일단 알림만
    alert('그룹 기능은 개발 예정입니다.');
}

// ===========================================
// 🔍 줌 기능
// ===========================================

function zoomIn() {
    canvasZoom = Math.min(canvasZoom + 0.1, 3.0);
    applyZoom();
}

function zoomOut() {
    canvasZoom = Math.max(canvasZoom - 0.1, 0.3);
    applyZoom();
}

function applyZoom() {
    const canvas = document.getElementById('canvas');
    const zoomLevel = document.getElementById('zoom-level');
    
    canvas.style.transform = `scale(${canvasZoom})`;
    canvas.style.transformOrigin = 'top left';
    
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(canvasZoom * 100) + '%';
    }
}

// ===========================================
// 📄 캔버스 관리
// ===========================================

// 배경 변경 (기존 함수 유지)
function changeBackground(background) {
    removeBackgroundTemplate();
    document.getElementById('canvas').style.background = background;
    if (typeof saveCanvasState === 'function') saveCanvasState();
}

// 배경 템플릿 제거 (기존 함수 유지)
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

// 캔버스 초기화 (기존 함수 유지)
function clearCanvas() {
    if (confirm('캔버스의 모든 요소를 삭제하시겠습니까?')) {
        const canvas = document.getElementById('canvas');
        const elements = canvas.querySelectorAll('.canvas-element');
        elements.forEach(element => element.remove());
        
        clearSelectionPPT();
        const noSelection = document.getElementById('no-selection');
        const textEditor = document.getElementById('text-editor');
        const imageEditor = document.getElementById('image-editor');
        const selectedTools = document.getElementById('selected-tools');
        
        if (noSelection) noSelection.style.display = 'block';
        if (textEditor) textEditor.style.display = 'none';
        if (imageEditor) imageEditor.style.display = 'none';
        if (selectedTools) selectedTools.style.display = 'none';
        
        // 배경도 초기화
        canvas.style.background = '#333';
        
        if (typeof saveCanvasState === 'function') saveCanvasState();
        console.log('캔버스 초기화 완료');
    }
}

// 캔버스 리셋 (줌 포함)
function resetCanvas() {
    if (confirm('캔버스를 완전히 초기화하시겠습니까? (줌, 배경 등 모든 설정 포함)')) {
        clearCanvas();
        
        // 줌 리셋
        canvasZoom = 1.0;
        applyZoom();
        
        // 배경 리셋
        const canvas = document.getElementById('canvas');
        canvas.style.background = '#333';
        canvas.style.transform = '';
        
        console.log('캔버스 완전 리셋 완료');
    }
}

// ===========================================
// 🛠️ 유틸리티 함수들
// ===========================================

// 요소 타입 확인
function getElementType(element) {
    if (element.classList.contains('canvas-text')) return 'text';
    if (element.classList.contains('canvas-image')) return 'image';
    if (element.classList.contains('canvas-shape')) return 'shape';
    if (element.classList.contains('canvas-background-template')) return 'background-template';
    return 'unknown';
}

// ===========================================
// 🚀 초기화
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // 전역 드래그 이벤트 설정 (호환성)
    setupGlobalDragEvents();
    
    // 캔버스 클릭시 선택 해제
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.addEventListener('click', function(e) {
            if (e.target === canvas) {
                clearSelectionPPT();
            }
        });
    }
    
    console.log('✅ Canvas.js 완전판 로드 완료 - PPT 방식 편집 + 자동저장 + 모든 기능 활성화');
});
// template.js - 템플릿 처리 관련 함수들

const TEMPLATE_STORAGE_KEY = 'user_templates';

// 템플릿 업로드
function uploadTemplate(input) {
    const file = input.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const templateData = {
            id: Date.now().toString(),
            name: file.name.split('.')[0],
            data: e.target.result,
            uploadDate: new Date().toISOString()
        };

        saveTemplateToStorage(templateData);
        updateTemplateList();
        alert('✅ 템플릿이 업로드되었습니다: ' + file.name);
        
        // 입력 필드 초기화
        input.value = '';
    };
    reader.readAsDataURL(file);
}

// localStorage에 템플릿 저장
function saveTemplateToStorage(templateData) {
    let templates = getStoredTemplates();
    templates.push(templateData);
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
}

// localStorage에서 템플릿 목록 가져오기
function getStoredTemplates() {
    const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// 템플릿 목록 업데이트
function updateTemplateList() {
    const select = document.getElementById('my-templates');
    const templates = getStoredTemplates();
    
    // 기존 옵션 제거 (첫 번째 옵션 제외)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // 새 템플릿들 추가
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = `${template.name} (${new Date(template.uploadDate).toLocaleDateString()})`;
        select.appendChild(option);
    });
}

// 템플릿 선택 시 미리보기
function loadMyTemplate() {
    const select = document.getElementById('my-templates');
    const selectedId = select.value;
    
    if (!selectedId) {
        clearTemplatePreview();
        return;
    }

    const templates = getStoredTemplates();
    const template = templates.find(t => t.id === selectedId);
    
    if (template) {
        showTemplatePreview(template);
    }
}

// 템플릿 미리보기 표시
function showTemplatePreview(template) {
    const preview = document.getElementById('template-preview');
    if (!preview) return;
    
    preview.innerHTML = `
        <img src="${template.data}" 
             style="max-width: 100%; max-height: 100%; object-fit: contain;" 
             alt="${template.name}">
    `;
    
    // 적용 버튼 추가
    const applyButton = document.createElement('button');
    applyButton.textContent = '캔버스에 적용';
    applyButton.className = 'apply-template-btn';
    applyButton.style.cssText = `
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: #667eea;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 10px;
    `;
    applyButton.onclick = () => applyTemplateToCanvas(template);
    
    preview.style.position = 'relative';
    preview.appendChild(applyButton);
}

// 미리보기 초기화
function clearTemplatePreview() {
    const preview = document.getElementById('template-preview');
    if (preview) {
        preview.innerHTML = '템플릿을 선택하세요';
        preview.style.position = 'static';
    }
}

// 캔버스에 템플릿 적용
function applyTemplateToCanvas(template) {
    if (typeof addTemplateAsBackground === 'function') {
        addTemplateAsBackground(template.data, template.name);
        alert('✅ 템플릿이 캔버스에 적용되었습니다!');
    } else {
        console.error('addTemplateAsBackground 함수가 없습니다. canvas.js를 확인하세요.');
        alert('❌ 캔버스 함수가 준비되지 않았습니다.');
    }
}

// 선택된 템플릿 삭제
function deleteSelectedTemplate() {
    const select = document.getElementById('my-templates');
    const selectedId = select.value;
    
    if (!selectedId) {
        alert('삭제할 템플릿을 선택하세요.');
        return;
    }

    const templates = getStoredTemplates();
    const template = templates.find(t => t.id === selectedId);
    
    if (template && confirm(`"${template.name}" 템플릿을 삭제하시겠습니까?`)) {
        const filteredTemplates = templates.filter(t => t.id !== selectedId);
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(filteredTemplates));
        
        updateTemplateList();
        clearTemplatePreview();
        alert('✅ 템플릿이 삭제되었습니다.');
    }
}

// 전체 템플릿 삭제
function clearAllTemplates() {
    const templates = getStoredTemplates();
    
    if (templates.length === 0) {
        alert('삭제할 템플릿이 없습니다.');
        return;
    }

    if (confirm(`모든 템플릿 (${templates.length}개)을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
        localStorage.removeItem(TEMPLATE_STORAGE_KEY);
        updateTemplateList();
        clearTemplatePreview();
        alert('✅ 모든 템플릿이 삭제되었습니다.');
    }
}

// 페이지 로드 시 템플릿 목록 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 템플릿 목록 업데이트는 템플릿 패널이 로드된 후에 실행
    setTimeout(() => {
        if (document.getElementById('my-templates')) {
            updateTemplateList();
        }
    }, 1000);
});
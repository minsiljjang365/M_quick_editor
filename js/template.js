// template.js - 템플릿 처리 관련 함수들

function uploadTemplate(input) {
    const file = input.files[0];
    if (file) {
        console.log('템플릿 업로드:', file.name);
        alert('템플릿 업로드됨: ' + file.name);
    }
}

function loadMyTemplate() {
    const select = document.getElementById('my-templates');
    const selected = select.value;
    if (selected) {
        console.log('템플릿 로드:', selected);
        alert('템플릿 로드됨: ' + selected);
    }
}

function previewTemplate() {
    alert('템플릿 미리보기 (구현 예정)');
}

function editTemplate() {
    alert('템플릿 편집 모드 (구현 예정)');
}
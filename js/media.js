// media.js - 미디어 처리 관련 함수들

function uploadFile(input) {
    const file = input.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addImageElement(e.target.result, 50, 50);
        };
        reader.readAsDataURL(file);
    }
}

function searchStockImages() {
    const query = document.getElementById('stock-search').value;
    if (!query.trim()) {
        alert('검색어를 입력하세요.');
        return;
    }
    console.log('스톡 이미지 검색:', query);
    alert('스톡 이미지 API 연동 예정 - 검색어: ' + query);
}

function generateAIImage() {
    const prompt = document.getElementById('ai-image-prompt').value;
    if (!prompt.trim()) {
        alert('생성할 이미지에 대한 설명을 입력하세요.');
        return;
    }
    console.log('AI 이미지 생성:', prompt);
    alert('AI 이미지 생성 API 연동 예정 - 프롬프트: ' + prompt);
}
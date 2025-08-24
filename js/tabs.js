// tabs.js - 탭 전환 관련 함수

function switchTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.source-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.source-section').forEach(section => section.classList.remove('active'));
    
    // 선택된 탭 활성화
    event.target.classList.add('active');
    document.getElementById(tabName + '-sources').classList.add('active');
}
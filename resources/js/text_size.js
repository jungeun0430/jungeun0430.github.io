/* 기능: 텍스트 사이즈 함수입니다 */
/* [공통]상단 글씨크기 변경 */
function updateButtons(sizeToShow) {
    // classMap을 통해 버튼 클래스를 적절히 매핑
    const $buttons = $('.txt-size-btn');
    const classMap = { small: 'sm', normal: 'rg', large: 'lg' };

    $buttons.each((_, button) => {
        const $button = $(button);

        // 클래스 매핑에 따라 버튼 노출 설정
        if ($button.hasClass(classMap[sizeToShow])) {
            $button.show(); // 다음 버튼 노출
        } else {
            $button.hide(); // 나머지 버튼 숨김
        }
    });
}

function changeTextSize(size) {
    const $body = $('body');
    const validSizes = ['small', 'normal', 'large'];
    if (!validSizes.includes(size)) return;

    // 텍스트 크기 적용
    $body.attr('data-text-size', size);

    // localStorage에 현재 상태 저장
    localStorage.setItem('textSize', size);

    // 사이즈 순환 계산
    const sizes = ['small', 'normal', 'large'];
    const nextSize = sizes[(sizes.indexOf(size) + 1) % sizes.length];

    // 버튼 상태 갱신
    updateButtons(nextSize);
}

function initializeTextSize() {
    // localStorage에서 저장된 글자 크기 가져오기
    const savedSize = localStorage.getItem('textSize') || 'normal';
    // 초기화: 변경 로직 호출
    changeTextSize(savedSize);
}


$(document).ready(function() {
    /* 2. [공통]상단 글씨크기 변경 */
    initializeTextSize()
});


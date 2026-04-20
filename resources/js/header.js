/* 기능: 헤더 함수입니다. */
/* 1. [공통]사이드바 */
// 사이드바 열기
function openSideBar() {
    /* 1. 사이드바 */
    const $dimOverlay = $('#dim-overlay'); // Dim 처리 요소
    const $sidebar = $('.sidebar'); // 사이드바 메뉴
    const breakpoint = 1200; // PC와 모바일을 구분할 기준 너비

    if ($(window).width() < breakpoint) {
        $dimOverlay.addClass('active');
        $sidebar.addClass('active');
        $('body').addClass('no-scroll');

        // iOS VoiceOver 대응을 위한 추가 코드
        $sidebar.attr({
            'role': 'dialog',
            'aria-modal': 'true'
        });

        // 사이드바 외부 요소 비활성화 (inert 속성 사용)
        if ('inert' in HTMLElement.prototype) {
            // inert 속성에서 모달을 제외하여 설정
            $('body > *')
                .not($sidebar)
                .not($sidebar.parents())
                .not($dimOverlay)
                .not('.modal[style*="display: block"]') // 열린 모달은 inert 제외
                .attr('inert', '');
        } else {
            applyInertPolyfill();
        }

        trapFocus($sidebar[0]);
    }
}
// 사이드바 닫기 공통 함수
function closeSidebar() {
    /* 1. 사이드바 */
    const $hamburgerBtn = $('.ico-hamburger'); // 햄버거 버튼
    const $dimOverlay = $('#dim-overlay'); // Dim 처리 요소
    const $sidebar = $('.sidebar'); // 사이드바 메뉴

    $dimOverlay.removeClass('active');
    $sidebar.removeClass('active');
    $('body').removeClass('no-scroll');

    // 접근성 속성 및 inert 제거
    $sidebar.removeAttr('role aria-modal');

    if ('inert' in HTMLElement.prototype) {
        $('body > *').removeAttr('inert');
    } else {
        removeInertPolyfill();
    }

    $hamburgerBtn.focus();
    document.removeEventListener('keydown', handleKeydown);
}

function openMenu() {
    const popup = document.querySelector('.header-popup');
    const btn = document.querySelector('.btn-wrap.pc-tablet-flex-only .ico-hamburger');

    if (!popup) return;

    const isOpen = popup.classList.contains('active');

    if (isOpen) {
        popup.classList.remove('active');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    } else {
        popup.classList.add('active');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    }
}

function closeMenu() {
    const popup = document.querySelector('.header-popup');
    if (!popup) return;

    popup.classList.remove('active');
}

// -------- 사이드바 열고 닫기 관련 함수 모음 -----------
// 포커스 트랩 핸들러 (removeEventListener에서 참조하기 위해 외부 스코프에 선언)
let handleKeydown = null;

// 포커스 트랩 함수
function trapFocus(container) {
    const focusableElements = Array.from(
        container.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
    ).filter(el => {
        // 보이는 요소만 걸러냄 (display: none 등)
        return el.offsetParent !== null;
    });

    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    firstEl.focus();

    handleKeydown = function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        } else if (e.key === 'Escape') {
            closeSidebar();
        }
    };

    document.addEventListener('keydown', handleKeydown);
}

// 상태 초기화 함수
function removeActiveClasses() {
    /* 1. 사이드바 */
    const $hamburgerBtn = $('.ico-hamburger'); // 햄버거 버튼
    const $dimOverlay = $('#dim-overlay'); // Dim 처리 요소
    const $sidebar = $('.sidebar'); // 사이드바 메뉴

    $dimOverlay.removeClass('active');
    $sidebar.removeClass('active');

    // 접근성 속성 및 inert 제거
    $sidebar.removeAttr('role aria-modal');

    if ('inert' in HTMLElement.prototype) {
        $('body > *').removeAttr('inert');
    } else {
        removeInertPolyfill();
    }

    if (!document.querySelector('.modal[style*="display: block"]')) {
        $('body').removeClass('no-scroll'); // 열린 모달이 없을 때만 스크롤 활성화
    }

    $hamburgerBtn.focus();
}

// inert 폴리필 함수
function applyInertPolyfill() {
    /* 1. 사이드바 */
    const $dimOverlay = $('#dim-overlay'); // Dim 처리 요소
    const $sidebar = $('.sidebar'); // 사이드바 메뉴

    // 사이드바와 햄버거 버튼을 제외한 모든 요소
    const elements = $('body > *').not($sidebar).not($sidebar.parents()).not($dimOverlay);

    elements.each(function() {
        $(this).attr('aria-hidden', 'true');

        // 요소 내의 모든 포커스 가능한 요소 비활성화
        $(this).find('a, button, input, select, textarea, [tabindex]').each(function() {
            if (!$(this).data('original-tabindex')) {
                $(this).data('original-tabindex', $(this).attr('tabindex') || null);
            }
            $(this).attr('tabindex', '-1');
        });
    });
}

// inert 폴리필 제거 함수
function removeInertPolyfill() {
    $('[aria-hidden="true"]').removeAttr('aria-hidden');

    // 원래 tabindex 복원
    $('[data-original-tabindex]').each(function() {
        const originalValue = $(this).data('original-tabindex');
        if (originalValue === null) {
            $(this).removeAttr('tabindex');
        } else {
            $(this).attr('tabindex', originalValue);
        }
        $(this).removeData('original-tabindex');
    });
}

$(document).ready(function() {
    /* 1. [공통]사이드바 */
    // 윈도우 리사이즈 이벤트
    $(window).on('resize', function () {
        if ($(window).width() >= 1200) {
            // PC 모드로 전환되면 초기화
            removeActiveClasses();
        }
    });
});
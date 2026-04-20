/* 기능: 커스텀 셀렉트 박스 초기화 */
function initializeCustomSelect(selectElement, selectOptions, options = {}) {
    // 이미 초기화된 셀렉트 박스인 경우 기존 요소 정리
    if (selectElement._initialized) {
        // 기존 옵션 목록 비우기
        const list = selectElement.querySelector('.select-list');
        if (list) {
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
        }

        // 기존 이벤트 리스너 제거
        const button = selectElement.querySelector('.select-toggle');
        if (button) {
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
        }

        // 문서 이벤트 리스너 제거
        if (selectElement._documentClickHandler) {
            document.removeEventListener('click', selectElement._documentClickHandler);
        }
    }

    // 초기화 플래그 설정
    selectElement._initialized = true;

    const button = selectElement.querySelector('.select-toggle');
    const list = selectElement.querySelector('.select-list');
    const selectedText = button.querySelector('.selected-text');

    const {
        up = false,
        placeholder = selectElement.dataset.placeholder || '선택하세요',
        preventSelectionOnLink = false,
        initialValue = null,
    } = options;

    if (up) {
        selectElement.classList.add('up');
    }

    selectedText.textContent = placeholder;
    list.setAttribute('aria-hidden', 'true');

    // 옵션 DOM 생성
    selectOptions.forEach(opt => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', opt.value);

        const discountClass = opt.discount?.startsWith('-') ? 'c-red' : (opt.discount ? 'c-blue' : '');
        if (opt.tag === 'a') {
            li.innerHTML = `
        <a href="${opt.href}" target="_blank" class="flex-wrap gap-auto al-center" tabindex="0">
          <span class="txt-sm fw-medium">${opt.value}</span>
          ${opt.discount ? `<span class="txt-sm fw-medium ${discountClass} ml-4">${opt.discount}</span>` : ''}
        </a>
      `;
        } else if (opt.tag === 'button') {
            li.innerHTML = `
        <button type="button" class="flex-wrap gap-auto al-center"  tabindex="0">
          <span class="txt-sm fw-medium">${opt.value}</span>
          ${opt.discount ? `<span class="txt-sm fw-medium ${discountClass} ml-4">${opt.discount}</span>` : ''}
        </button>
      `;
        }

        list.appendChild(li);
    });

    // Focus 업데이트
    const items = list.querySelectorAll('li');

    const closeList = () => {
        list.setAttribute('aria-hidden', 'true');
        button.setAttribute('aria-expanded', 'false');
        selectElement.classList.remove('active');
    };

    const openList = () => {
        list.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        selectElement.classList.add('active');
    };

    const toggleList = () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        expanded ? closeList() : openList();
    };

    const selectItem = item => {
        const selectedButton = item.querySelector('button');
        const selectedAnchor = item.querySelector('a');

        if (selectedButton) {
            const div = document.createElement('div');
            div.classList.add('selected-item');
            div.innerHTML = selectedButton.innerHTML;
            selectedText.innerHTML = '';
            selectedText.appendChild(div);
        } else if (selectedAnchor && !preventSelectionOnLink) {
            const div = document.createElement('div');
            div.classList.add('selected-item');
            div.innerHTML = selectedAnchor.innerHTML;
            selectedText.innerHTML = '';
            selectedText.appendChild(div);
        }

        items.forEach(i => i.setAttribute('aria-selected', 'false'));
        item.setAttribute('aria-selected', 'true');
        closeList();
        button.focus();
    };

    // 초기값이 있을 경우 해당 항목을 선택
    if (initialValue !== null) {
        const initialItem = Array.from(items).find(item => item.dataset.value === initialValue);
        if (initialItem) {
            selectItem(initialItem);
        }
    }

    // 이벤트
    button.addEventListener('click', toggleList);

    items.forEach((item, index) => {
        item.addEventListener('keydown', e => {
            const isAnchor = !!item.querySelector('a');
            if ((e.key === 'Enter' || e.key === ' ') && isAnchor && !preventSelectionOnLink) {
                // 링크는 이동만 하고, 선택 텍스트는 업데이트 안 함
                closeList();  // 링크를 클릭하면 리스트는 닫아줘야 함
                return;
            }

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    const prev = items[index - 1] || items[items.length - 1];
                    prev.focus();
                } else {
                    const next = items[index + 1] || items[0];
                    next.focus();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = items[index + 1] || items[0];
                next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = items[index - 1] || items[items.length - 1];
                prev.focus();
            } else if ((e.key === 'Enter' || e.key === ' ') && isAnchor) {
                if (preventSelectionOnLink) {
                    closeList();
                } else {
                    e.preventDefault();
                    closeList();
                }
            } else if (e.key === 'Escape') {
                closeList();
                button.focus();
            }
        });

        item.addEventListener('click', () => {
            const isAnchor = !!item.querySelector('a');
            if (isAnchor && preventSelectionOnLink) {
                closeList(); // 텍스트 변경 안 하고 리스트만 닫기
                return;
            }

            selectItem(item);
        });
    });

    // 문서 클릭 이벤트 핸들러 생성 및 저장
    const documentClickHandler = e => {
        if (!selectElement.contains(e.target)) {
            closeList();
        }
    };

    // 이벤트 핸들러 등록 및 참조 저장
    document.addEventListener('click', documentClickHandler);
    selectElement._documentClickHandler = documentClickHandler;

    return {
        // 외부에서 제어할 수 있는 메서드 제공
        destroy: () => {
            // 이벤트 리스너 제거
            if (selectElement._documentClickHandler) {
                document.removeEventListener('click', selectElement._documentClickHandler);
            }
            // 초기화 플래그 해제
            selectElement._initialized = false;
        },
        update: (newOptions) => {
            // 옵션 업데이트 로직
            const list = selectElement.querySelector('.select-list');
            if (list) {
                while (list.firstChild) {
                    list.removeChild(list.firstChild);
                }

                // 새 옵션으로 다시 초기화
                initializeCustomSelect(selectElement, newOptions, options);
            }
        }
    };
}

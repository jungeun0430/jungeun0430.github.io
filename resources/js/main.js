/* 함수주석
* 1. [공통]사이드바 (function, 실행문)
* 2. [공통]상단 글씨크기 변경 (function, 실행문)
* 3. [공통]모달 관련 함수 (function, 실행문)
* 5. [공통] 탭 관련 함수
*  */
/* ---- [ function 모음 : 1,2,3 ]-------------------------------------------------------- */
/* 5. [공통] 탭 관련 함수 */
class TabManager {
    constructor() {
        this.isMobile = window.innerWidth <= 767;
        this.tabSets = new Map(); // Map을 명시적으로 초기화
        this.init();

        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 767;

            document.querySelectorAll('.tab-wrap').forEach(wrap => {
                const tabType = wrap.getAttribute('data-tab');
                const firstDepth = wrap.querySelector('.first-depth');

                if (!firstDepth) return;

                if (tabType === 'fraternal') {
                    if (!wasMobile && this.isMobile) {
                        this.moveActiveTabToTop(wrap);
                    } else if (wasMobile && !this.isMobile) {
                        this.restoreOriginalOrder(wrap);
                    }
                }
            });

            this.updateHeight();
        });
    }

    // 각 탭 세트의 ID 생성
    getTabSetId(wrap) {
        // 이미 ID가 있으면 사용, 없으면 data-tab 속성과 랜덤 값을 합쳐 고유 ID 생성
        if (!wrap.dataset.tabSetId) {
            const tabType = wrap.getAttribute('data-tab') || 'unknown';
            wrap.dataset.tabSetId = `${tabType}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        }
        return wrap.dataset.tabSetId;
    }

    // 탭 세트별로 초기 순서 저장
    saveOriginalOrder(wrap, firstDepth) {
        if (!firstDepth) return;

        // this.tabSets가 정의되어 있는지 확인
        if (!this.tabSets) {
            this.tabSets = new Map();
        }

        const id = this.getTabSetId(wrap);

        if (!this.tabSets.has(id)) {
            this.tabSets.set(id, {
                originalOrder: Array.from(firstDepth.children).map(li => li.cloneNode(true))
            });
        }
    }

    // 탭 세트별로 원래 순서 복원
    restoreOriginalOrder(wrap) {
        // this.tabSets가 정의되어 있는지 확인
        if (!this.tabSets) {
            console.warn('tabSets가 초기화되지 않았습니다.');
            return;
        }

        const id = this.getTabSetId(wrap);
        const tabSetData = this.tabSets.get(id);

        if (!tabSetData || !tabSetData.originalOrder) {
            console.warn(`저장된 탭 세트 데이터가 없습니다. ID: ${id}`);
            return;
        }

        const firstDepth = wrap.querySelector('.first-depth');
        if (!firstDepth) return;

        if (wrap.getAttribute('data-tab') === 'fraternal') {
            console.log(`${id} 탭 세트의 초기 순서 복원 중...`);

            // 현재 활성화된 탭 찾기
            const currentActiveTab = wrap.querySelector('.first-depth > li.active .tab');
            const currentActiveTabId = currentActiveTab ? currentActiveTab.textContent.trim() : null;

            firstDepth.innerHTML = '';

            // 원래 순서로 복원하지만 active 클래스는 모두 제거
            tabSetData.originalOrder.forEach(li => {
                const newLi = li.cloneNode(true);
                newLi.classList.remove('active'); // 모든 active 클래스 제거
                firstDepth.appendChild(newLi);
            });

            // 현재 활성화된 탭 텍스트와 일치하는 탭을 찾아 active로 설정
            if (currentActiveTabId) {
                const tabs = wrap.querySelectorAll('.first-depth > li .tab');
                for (const tab of tabs) {
                    if (tab.textContent.trim() === currentActiveTabId) {
                        const tabItem = tab.closest('li');
                        tabItem.classList.add('active');

                        // 해당 tab-box 표시
                        const tabBox = tabItem.querySelector('.tab-box');
                        if (tabBox) {
                            tabBox.style.display = 'block';
                        }
                        break;
                    }
                }
            }

            this.reattachEventListeners();
            this.updateHeight();
        }
    }

    moveActiveTabToTop(wrap) {
        const firstDepth = wrap.querySelector('.first-depth');
        if (!firstDepth) return;

        const activeTab = wrap.querySelector('.first-depth > li.active');
        if (activeTab && this.isMobile && wrap.getAttribute('data-tab') === 'fraternal') {
            firstDepth.insertBefore(activeTab, firstDepth.firstChild);
        }
    }

    attachEventListeners(wrap) {
        const firstDepth = wrap.querySelector('.first-depth');
        if (!firstDepth) return;

        const tabs = wrap.querySelectorAll('.first-depth > li .tab');
        const tabType = wrap.getAttribute('data-tab');
        const tabSingle = wrap.getAttribute('data-single');

        // 모바일 환경에서 탭 키 네비게이션을 위한 tabindex 설정
        if (tabType === 'fraternal') {
            this.updateTabindexes(wrap);

            // opened 클래스가 변경될 때마다 tabindex 업데이트
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' &&
                        mutation.attributeName === 'class' &&
                        firstDepth === mutation.target) {
                        this.updateTabindexes(wrap);
                    }
                });
            });

            observer.observe(firstDepth, { attributes: true });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (tabType === 'fraternal' && this.isMobile) {
                    if (firstDepth.classList.contains('opened')) {
                        console.log('activate1')

                        this.activateTab(tab);
                        firstDepth.classList.remove('opened');

                        // 클릭한 탭에 포커스 유지 (이 부분만 추가)
                        setTimeout(() => {
                            tab.focus();
                        }, 0);
                    } else {
                        firstDepth.classList.add('opened');
                    }
                } else if(tabSingle === 'aa') {

                    this.activateTab(tab, tabType,tabSingle);


                } else
                {
                    this.activateTab(tab, tabType);
                }
            });

            tab.addEventListener('focus', () => {
                if (tabType !== 'fraternal' || !this.isMobile) {
                    this.activateTab(tab, tabType);
                }
            });
        });
    }

// 탭의 tabindex를 업데이트하는 새로운 메서드
    updateTabindexes(wrap) {
        const firstDepth = wrap.querySelector('.first-depth');
        if (!firstDepth) return;

        const isOpened = firstDepth.classList.contains('opened');
        const tabType = wrap.getAttribute('data-tab');

        if (tabType === 'fraternal' && this.isMobile) {
            const tabs = wrap.querySelectorAll('.first-depth > li .tab');

            if (isOpened) {
                // 열린 상태에서는 모든 탭에 탭 포커스 활성화
                tabs.forEach(tab => {
                    tab.setAttribute('tabindex', '0');
                });
            } else {
                // 닫힌 상태에서는 활성화된 탭만 탭 포커스 활성화
                tabs.forEach(tab => {
                    const isActive = tab.closest('li').classList.contains('active');
                    tab.setAttribute('tabindex', isActive ? '0' : '-1');
                });
            }
        }
    }

// init 함수의 끝부분에 다음 코드 추가
    reattachEventListeners() {
        document.querySelectorAll('.tab-wrap').forEach(wrap => {
            this.attachEventListeners(wrap);
        });
    }

    init() {
        // Map 초기화 확인
        if (!this.tabSets) {
            this.tabSets = new Map();
        }

        const tabWraps = document.querySelectorAll('.tab-wrap');

        tabWraps.forEach((wrap, index) => {
            const tabType = wrap.getAttribute('data-tab');

            const firstDepth = wrap.querySelector('.first-depth');
            /*if (!firstDepth) {
              console.warn(`탭 랩 #${index}에 .first-depth 요소가 없습니다!`);
              return;
            }*/

            // 초기 순서 저장 - 수정된 메서드 호출
            this.saveOriginalOrder(wrap, firstDepth);

            const tabs = wrap.querySelectorAll('.first-depth > li .tab');
            if (tabs.length <= 1) {
                // 탭 버튼이 하나라면 숨기기
                firstDepth.classList.add('only');
            } else {
                firstDepth.classList.remove('only');
            }

            const tabBoxes = wrap.querySelectorAll('.tab-box');

            // 초기에 모든 tab-box 숨기기
            tabBoxes.forEach(box => box.style.display = 'none');

            // 활성 탭의 tab-box 보이기
            const activeTabBox = wrap.querySelector('.first-depth > li.active .tab-box');
            if (activeTabBox) {
                activeTabBox.style.display = 'block';

                // fraternal 타입 모바일일 경우만 초기에 활성 탭을 최상단으로 이동
                if (tabType === 'fraternal' && this.isMobile) {
                    const activeTab = activeTabBox.closest('li');
                    firstDepth.insertBefore(activeTab, firstDepth.firstChild);
                }
            } else {
                console.log(`활성 탭 박스를 찾을 수 없음`);
            }

            // 각 탭 랩에 이벤트 리스너 부착
            this.attachEventListeners(wrap);

            // 모바일에서 외부 클릭 시 목록 닫기 (fraternal 타입만)
            if (tabType === 'fraternal') {
                document.addEventListener('click', (e) => {
                    if (this.isMobile && !wrap.contains(e.target)) {
                        firstDepth.classList.remove('opened');
                    }
                });
            }
        });
        this.updateHeight();
    }

    activateTab(selectedTab, tabType) {
        const wrap = selectedTab.closest('.tab-wrap');
        if (!wrap) return;

        const firstDepth = wrap.querySelector('.first-depth');
        if (!firstDepth) return;

        const allTabs = wrap.querySelectorAll('.first-depth > li');
        tabType = tabType || wrap.getAttribute('data-tab');

        // 모든 탭 비활성화 및 tab-box 숨기기
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            const tabBox = tab.querySelector('.tab-box');
            if (tabBox) {
                tabBox.style.display = 'none';
            }
        });

        // 선택된 탭 활성화 및 tab-box 보이기
        const activeTabItem = selectedTab.closest('li');
        activeTabItem.classList.add('active');
        if(activeTabItem.dataset.selectedTab === 'cancel') {
            changeButtonStateAndEvent('modal-courseChange','cancel')
        } else if(activeTabItem.dataset.selectedTab === 'delay') {
            changeButtonStateAndEvent('modal-courseChange','delay')
        }

        const activeTabBox = activeTabItem.querySelector('.tab-box');
        if (activeTabBox) {
            activeTabBox.style.display = 'block';
        }

        // fraternal 타입의 모바일에서만 선택된 탭을 최상단으로 이동
        if (tabType === 'fraternal' && this.isMobile) {
            const parent = activeTabItem.parentNode;
            parent.insertBefore(activeTabItem, parent.firstChild);
        }

        setTimeout(() => this.updateHeight(), 0);
    }

    updateHeight(modalId = null) {
        // 대상 선택: modalId가 있으면 특정 모달 내부의 tab-wrap만 선택
        const tabWrapSelector = modalId
            ? `#${modalId} .tab-wrap` // 특정 모달 안의 .tab-wrap
            : '.tab-wrap';            // 모든 .tab-wrap

        console.log(tabWrapSelector)
        // 선택된 tab-wrap 요소
        const tabWraps = document.querySelectorAll(tabWrapSelector);

        // tab-wrap이 존재하지 않으면 아무 작업도 하지 않음
        if (!tabWraps.length) {
            console.log('tab-wrap 요소가 없습니다.');
            return;
        }

        // 각 tab-wrap의 높이 계산 및 업데이트
        tabWraps.forEach(wrap => {
            const activeTab = wrap.querySelector('.first-depth > li.active .tab-box'); // 활성화된 탭 찾기
            if (activeTab) {
                const tabBoxHeight = activeTab.offsetHeight; // 활성 탭의 높이
                // modal 내부인지 확인하는 조건
                const isInModal = modalId && wrap.closest(`#${modalId}`);
                const listLength = wrap.querySelectorAll('.first-depth > li').length;

                /* tab의 수가 1이하인 경우 상단에 버튼을 가리기위해 0 높이 더함 /
                *  나머지의 경우 pc / mobile 에 따라 차등을 두어 값 적용
                *  */
                const topSpacing =
                    listLength <= 1
                        ? 0
                        : isInModal
                            ? 84
                            : this.isMobile
                                ? 84
                                : 104;

                wrap.style.height = `${tabBoxHeight + topSpacing}px`; // 계산된 높이 설정
            }
        });
    }
}
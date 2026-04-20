/* 기능: 테이블 체크박스 연동(pc/mo 동기화 + 전체선택 버튼 + 선택삭제) */
(function () {
    function findGroup(target) {
        var group = target.closest('.apply-table-group');
        if (group) return group;

        var btnWrap = target.closest('.table-btn-wrap');
        if (btnWrap) {
            var next = btnWrap.nextElementSibling;
            while (next) {
                if (next.classList && next.classList.contains('apply-table-group')) {
                    return next;
                }
                next = next.nextElementSibling;
            }
        }

        return null;
    }

    function getItemCheckboxes(group) {
        return Array.from(group.querySelectorAll('.js-check-item'));
    }

    function getAllCheckboxes(group) {
        return Array.from(group.querySelectorAll('input.js-check-all'));
    }

    function getAllButtons(group) {
        var container = group.parentElement;
        if (!container) return [];
        return Array.from(container.querySelectorAll('.js-check-all-btn'));
    }

    function getDeleteButtons(group) {
        var container = group.parentElement;
        if (!container) return [];
        return Array.from(container.querySelectorAll('.js-delete-selected'));
    }

    function getItemStateMap(group) {
        var map = {};
        var items = getItemCheckboxes(group);

        items.forEach(function (checkbox, index) {
            var key = checkbox.dataset.itemId || ('index-' + index);
            map[key] = checkbox.checked;
        });

        return map;
    }

    function isAllChecked(group) {
        var itemStateMap = getItemStateMap(group);
        var keys = Object.keys(itemStateMap);

        return keys.length > 0 && keys.every(function (key) {
            return itemStateMap[key];
        });
    }

    function updateAllControls(group) {
        var allChecked = isAllChecked(group);
        var hasItems = getItemCheckboxes(group).length > 0;
        var hasCheckedItems = getItemCheckboxes(group).some(function (checkbox) {
            return checkbox.checked;
        });

        getAllCheckboxes(group).forEach(function (checkbox) {
            checkbox.checked = allChecked;
        });

        getAllButtons(group).forEach(function (button) {
            button.textContent = allChecked ? '전체해제' : '전체선택';
            button.classList.toggle('is-active', allChecked);
            button.disabled = !hasItems;
        });

        getDeleteButtons(group).forEach(function (button) {
            button.disabled = !hasCheckedItems;
        });
    }

    function setAllItems(group, checked) {
        getItemCheckboxes(group).forEach(function (checkbox) {
            checkbox.checked = checked;
        });

        updateAllControls(group);
    }

    function deleteSelectedItems(group) {
        var checkedItems = getItemCheckboxes(group).filter(function (checkbox) {
            return checkbox.checked;
        });

        if (!checkedItems.length) {
            alert('삭제할 항목을 선택해주세요.');
            return;
        }

        var itemIds = [];
        var fallbackRows = [];

        checkedItems.forEach(function (checkbox) {
            var itemId = checkbox.dataset.itemId;
            if (itemId) {
                if (itemIds.indexOf(itemId) === -1) {
                    itemIds.push(itemId);
                }
            } else {
                var row = checkbox.closest('tr');
                if (row && fallbackRows.indexOf(row) === -1) {
                    fallbackRows.push(row);
                }
            }
        });

        // 같은 item-id를 가진 PC/MO 행 모두 삭제
        itemIds.forEach(function (itemId) {
            group.querySelectorAll('tr[data-item-id="' + itemId + '"]').forEach(function (row) {
                row.remove();
            });
        });

        // data-item-id가 없는 예외 row는 자기 자신만 삭제
        fallbackRows.forEach(function (row) {
            row.remove();
        });

        updateAllControls(group);
    }

    document.addEventListener('change', function (e) {
        var target = e.target;
        var group = findGroup(target);

        if (!group) return;

        if (target.matches('input.js-check-all')) {
            setAllItems(group, target.checked);
            return;
        }

        if (target.matches('.js-check-item')) {
            var itemId = target.dataset.itemId;
            var isChecked = target.checked;

            if (itemId) {
                group.querySelectorAll('.js-check-item[data-item-id="' + itemId + '"]').forEach(function (checkbox) {
                    checkbox.checked = isChecked;
                });
            }

            updateAllControls(group);
        }
    });

    document.addEventListener('click', function (e) {
        var checkAllButton = e.target.closest('.js-check-all-btn');
        if (checkAllButton) {
            var groupForAll = findGroup(checkAllButton);
            if (!groupForAll) return;

            var nextState = !isAllChecked(groupForAll);
            setAllItems(groupForAll, nextState);
            return;
        }

        var deleteButton = e.target.closest('.js-delete-selected');
        if (deleteButton) {
            var groupForDelete = findGroup(deleteButton);
            if (!groupForDelete) return;

            deleteSelectedItems(groupForDelete);
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.apply-table-group').forEach(function (group) {
            updateAllControls(group);
        });
    });
})();
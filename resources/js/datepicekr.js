/* 기능: 데이트 피커 */
$(document).ready(function(){
    /* 데이트피커 */
    // 시작일과 종료일 선택 필드
    let startDateInput = $(".dates").eq(0);
    let endDateInput = $(".dates").eq(1);
    /* 날짜 유효성 검사 */
    const isValidDate = (dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && dateStr === date.toISOString().slice(0, 10);
    }
    // 공통 옵션
    let dateOptions = {
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd",
        showOtherMonths: true,// 날짜 형식 설정
        showMonthAfterYear: true, // 한국식 년도-월 표시
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], // 요일 한글화
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], // 월 한글화
        defaultDate: new Date(),
        beforeShow: function () {
            setTimeout(() => {
                formatYearOptions();
            }, 0);
        },
        onChangeMonthYear: function () {
            setTimeout(() => {
                formatYearOptions();
            }, 0);
        }
    };
    // 시작일 datepicker
    startDateInput.datepicker({
        ...dateOptions,
        onSelect: function(selectedDate) {
            // 시작일이 선택되면 종료일의 최소 날짜를 시작일로 설정
            endDateInput.datepicker("option", "minDate", selectedDate);
        }
    });
    // 종료일 datepicker
    endDateInput.datepicker({
        ...dateOptions,
        onSelect: function(selectedDate) {
            // 종료일이 선택되면 시작일의 최대 날짜를 종료일로 설정
            startDateInput.datepicker("option", "maxDate", selectedDate);
        }
    });

    // 입력 제한 설정 (직접 타이핑 or 붙여넣기 막기)
    [startDateInput, endDateInput].forEach($input => {
        $input.attr('readonly', true); // 직접 입력 불가 (마우스 클릭만 가능)
        $input.on('keydown paste input', (e) => e.preventDefault()); // 붙여넣기, 키 입력 차단
    });
})
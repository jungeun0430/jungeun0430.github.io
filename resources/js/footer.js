/* 기능: footer 실행함수입니다. */
const footer1 = [
    { value: '국민체육진흥공단',tag: 'a', href: 'http://www.kspo.or.kr/' },
    { value: '문화체육관광부',tag: 'a', href: 'http://www.mcst.go.kr/main.jsp' },
    { value: '경륜경정사업본부',tag: 'a', href: 'http://www.krace.or.kr/' },
    { value: 'KCYCLE 경륜',tag: 'a', href: 'http://www.kcycle.or.kr/' },
    { value: 'KBOAT 경정',tag: 'a', href: 'http://www.kboat.or.kr/' },
    { value: '서울올림픽파크텔',tag: 'a', href: 'https://www.parktel.co.kr/' },
    { value: '한국스포츠과학원',tag: 'a', href: 'http://www.sports.re.kr/' },
    { value: '서울올림픽기념관',tag: 'a', href: 'https://88olympic.kspo.or.kr/' },
    { value: '소마미술관',tag: 'a', href: 'https://soma.kspo.or.kr/' },
    { value: '올림픽공원',tag: 'a', href: 'https://www.ksponco.or.kr/olympicpark' },
    { value: '국민체력센터',tag: 'a', href: 'http://www.nfc.or.kr/' },
    { value: '국민권익위원회',tag: 'a', href: 'http://www.acrc.go.kr/acrc/index.do"' },
];
// 패밀리
const footer2 = [
    { value: '한국체육산업개발(주)',tag: 'a', href: 'http://www.ksponco.or.kr/' },
    { value: '올림픽공원스포츠센터',tag: 'a', href: 'https://www.ksponco.or.kr/sports/olparksports' },
    { value: '올림픽수영장',tag: 'a', href: 'https://www.ksponco.or.kr/sports/olparkswim' },
    { value: '올림픽테니스장',tag: 'a', href: 'https://www.ksponco.or.kr/sports/olparktennis' },
    { value: '올팍축구장',tag: 'a', href: 'https://www.ksponco.or.kr/sports/olparksoccer' },
    { value: '일산올림픽스포츠센터',tag: 'a', href: 'https://www.ksponco.or.kr/sports/ilsansports' },
    { value: '분당올림픽스포츠센터',tag: 'a', href: 'https://www.ksponco.or.kr/sports/bundangsports' },
    { value: '올림픽홀 평생교육원',tag: 'a', href: 'https://www.ksponco.or.kr/edu' },
    // { value: '대관예약시스템',tag: 'a', href: '"https://www2.ksponco.or.kr/culture/index.do' }, // as-is 운영 , to-be 운영
    { value: '대관예약시스템',tag: 'a', href: 'https://www.ksponco.or.kr/culture/index.do' }, // 테스트 운영
]
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomSelect(document.querySelector('.custom-select[data-options="familySite"]'), footer2, {
        up:true,
        preventSelectionOnLink: true, // 링크 이동의 역할만 할 경우 placeholder 변경 필요없음 지정 변수
        placeholder: '패밀리 사이트',
    });
    initializeCustomSelect(document.querySelector('.custom-select[data-options="relatedSite"]'), footer1, {
        up:true,
        preventSelectionOnLink: true,// 링크 이동의 역할만 할 경우 placeholder 변경 필요없음 지정 변수
        placeholder: '관련 사이트',
    });
});
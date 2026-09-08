type Experience = {
    date: string
    title: string
    project?: string
    award?: string
}

export const experiences: Experience[] = [
    {
        date: '2023.07 - 2024.07',
        title: 'CCIT IoT 융합 동아리',
    },
    {
        date: '2023.12',
        title: '제10회 JB valley 창업경진대회',
        project: '스마트 카트 장바구니 시스템',
        award: '최우수상',
    },
    {
        date: '2023.12',
        title: '2023-2학기 캡스톤디자인 경진대회',
        project: '시각장애인을 위한 버스 정류장 시스템',
        award: '최우수상',
    },
    {
        date: '2024.01',
        title: '중부권 학생창업 SPRINT',
        project: '토마토 숙도에 따른 수확 로봇 시스템 ‘Catch-up!’',
        award: '우수상',
    },
    {
        date: '2024.05',
        title: '창업아이디어 우체통 공모전',
        project: '토마토 숙도에 따른 수확 로봇 시스템 ‘Catch-up!’',
        award: '최우수상',
    },
    {
        date: '2025.05 - 2025.08',
        title: '(주)아이피나우 인턴',
        project:
            'AI 기반 업무 자동화 기능 개발 및 정부지원사업 데이터 관리 프로세스 개선',
    },
    {
        date: '2026.07 - 진행 중',
        title: '현대오토에버 모빌리티 SW 스쿨 4기(웹&앱)',
        project: '웹과 모바일 환경을 아우르는 풀스택 개발 교육 과정',
    },
]

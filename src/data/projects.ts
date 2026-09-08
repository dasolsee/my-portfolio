export type Project = {
    id: string
    title: string
    period: string
    summary: string
    role: string
    members: string
    award?: string
    featuresTitle: string
    features: string[]
    technologies: { name: string; color: string }[]
    github?: string
    readme?: string
}

// 확인 예정인 항목과 링크는 실제 정보 확인 후 수정한다.
export const projects: Project[] = [
    {
        id: 'smart-mirror',
        title: '스마트 미러',
        period: '2023.02 - 2023.05',
        summary: '일정과 날씨 등 생활 정보를 제공하는 음성 비서 스마트 미러를 기획했습니다.',
        role: '백엔드 개발',
        members: '백엔드 2명, 프론트엔드 1명, 하드웨어 1명',
        featuresTitle: '주요  구현 내용',
        features: [
            '사용자의 일정과 오늘의 날씨 안내',
            'Google Assistant 기반 음성 대화·번역',
            'Raspberry Pi 기반 스마트 미러 구성',
        ],
        technologies: [
            { name: 'Python', color: 'mysql' },
            { name: 'Java', color: 'java' },
            { name: 'MySQL', color: 'mysql' },
            { name: 'Raspberry Pi', color: 'java' },
            { name: 'Linux', color: 'jpa' },
        ],
    },
    {
        id: 'jangbogo',
        title: '장보고 (Jangbogo)',
        period: '2023.06 - 2023.09',
        summary: '소상공인의 재고 관리와 소비자의 동네 마트 가격 비교를 위한 앱입니다.',
        role: '백엔드 개발',
        members: '백엔드 2명, 프론트엔드 1명, 하드웨어 1명',
        award: '수상',
        featuresTitle: '주요 구현 내용',
        features: [
            '회원가입·로그인 및 회원·마켓 정보 수정',
            '재고 등록·조회·검색·삭제',
            '판매 물품 등록 및 목록 조회·검색',
        ],
        technologies: [
            { name: 'Python', color: 'mysql' },
            { name: 'Java', color: 'java' },
            { name: 'PostgreSQL', color: 'mysql' },
        ],
    },
    {
        id: 'tomato-robot',
        title: '스마트팜 토마토 수확 로봇 시스템',
        period: '2023.09 - 2024.04',
        summary: '토마토의 숙도와 줄기를 인식해 수확을 돕는 로봇 프로젝트입니다.',
        role: '백엔드 개발',
        members: '백엔드 2명, 프론트엔드 1명, 하드웨어 1명',
        award: '수상',
        featuresTitle: '주요 구현 내용',
        features: [
            '5단계 숙도 분류를 위한 토마토 데이터셋 라벨링',
            '숙도와 위치를 기준으로 수확 순서 알고리즘 설계',
            '스마트 팜 생태계 정보 구축'
        ],
        technologies: [
            { name: 'Python', color: 'mysql' },
            { name: 'Java', color: 'java' },
            { name: 'MySQL', color: 'mysql' },
            { name: 'YOLO', color: 'mysql' },
            { name: 'Roboflow', color: 'jpa' },
        ],
    },
    {
        id: 'bbs',
        title: 'BBS 시각장애인을 위한 버스 이용 시스템',
        period: '2023.09.12 - 2024.06.04',
        summary: '스마트 정류장과 앱을 연동해 시각장애인의 버스 승하차를 돕는 시스템입니다.',
        role: '백엔드 개발',
        members: '백엔드 2명, 프론트엔드 1명, 하드웨어 1명',
        award: '수상',
        featuresTitle: '주요 구현 내용',
        features: [
            '공공데이터 API를 연동한 버스·정류장 정보 조회',
            'SSE를 활용한 실시간 알림 및 서버 간 REST API 통신',
            'Docker를 활용한 AWS EC2 서버 배포',
        ],
        technologies: [
            { name: 'Python', color: 'mysql' },
            { name: 'Java', color: 'java' },
            { name: 'Spring Boot', color: 'spring' },
            { name: 'Spring Data JPA', color: 'jpa' },
            { name: 'MySQL', color: 'mysql' },
            { name: 'Docker', color: 'mysql' },
            { name: 'AWS EC2', color: 'mysql' },
        ],
        github: 'https://github.com/dasolsee/blind-bus-system',
    },
    {
        id: 'my-portfolio',
        title: '개인 포트폴리오 웹사이트',
        period: '2026.09 - 진행 중',
        summary: '개발 경험과 프로젝트를 소개하고 문제 해결 과정을 기록하는 개인 포트폴리오입니다.',
        role: '프론트엔드 개발, Supabase 연동',
        members: '1명 (개인 프로젝트)',
        featuresTitle: '주요 구현 내용',
        features: [
            '소개·경험·기술·프로젝트를 담은 반응형 페이지 구현',
            'React Router를 활용한 페이지 이동 및 기록 상세 화면 구현',
            'Supabase 기반 관리자 인증, 기록 작성·조회·수정 및 해결 상태 관리',
        ],
        technologies: [
            { name: 'React', color: 'mysql' },
            { name: 'TypeScript', color: 'mysql' },
            { name: 'CSS Modules', color: 'jpa' },
            { name: 'React Router', color: 'java' },
            { name: 'Vite', color: 'jpa' },
            { name: 'Supabase', color: 'spring' },
        ],
        github: 'https://github.com/dasolsee/my-portfolio',
    },
]

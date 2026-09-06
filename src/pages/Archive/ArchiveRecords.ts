// 기록 하나가 어떤 정보를 가져야 하는지 정한다.
export type ArchiveRecord = {
    id: number
    title: string
    date: string
    resolved: boolean
    problem: string
    attempts: string[]
    solution: string
    learned: string
}

// 목록과 상세 페이지에서 같은 기록을 불러와 사용한다.
// 내용은 이번 포트폴리오 작업에서 겪은 일을 바탕으로 정리한 초안이다.
export const archiveRecords: ArchiveRecord[] = [
    {
        id: 1,
        title: 'Vite 내부 파일에 CSS를 잘못 붙여 넣어 발생한 실행 오류 해결',
        date: '2026-09-05',
        resolved: true,
        problem:
            '개발 서버를 실행하자 Unexpected token 오류가 발생했다. 오류에 표시된 Vite 내부 JavaScript 파일의 첫 줄에는 CSS 코드가 들어 있었다.',
        attempts: [
            '처음에는 Node.js 버전이나 npm 실행 환경의 문제라고 생각했다.',
            '오류 메시지의 파일 경로와 첫 줄을 확인하면서 node_modules 안의 파일에 CSS가 잘못 들어간 것을 확인했다.',
        ],
        solution:
            '도움을 받아 npm ci로 의존성을 다시 설치했다. 손상된 Vite 파일이 정상 코드로 복구됐고 lint와 빌드 검사를 통과했다.',
        learned:
            '오류를 확인할 때는 메시지뿐 아니라 파일 경로도 함께 읽어야 한다. 직접 작성하는 src와 설치된 패키지가 있는 node_modules를 구분하고, 붙여 넣기 전에 열린 파일의 경로를 확인하기로 했다.',
    },
    {
        id: 2,
        title: 'SVG 아이콘 색상이 CSS의 글자색을 따라 바뀌지 않는 이유',
        date: '2026-09-05',
        resolved: true,
        problem:
            'Contact 카드의 아이콘을 파란색으로 맞추려 했지만, 부모 요소에 color를 지정해도 일부 SVG 아이콘이 검은색으로 표시됐다.',
        attempts: [
            '아이콘을 감싼 요소에 파란색을 지정했지만 이미지의 색상은 바뀌지 않았다.',
            'SVG 파일을 확인해 내부의 fill 값과 img 태그로 불러오는 방식을 살펴봤다.',
        ],
        solution:
            '파란색이 적용된 SVG 파일로 교체하고 GitHub, 전화, 이메일 아이콘의 fill 값을 #4F76C4로 통일했다.',
        learned:
            'img로 불러온 SVG는 부모 요소의 글자색을 그대로 상속받지 않는다. 아이콘의 색상이 바뀌지 않을 때는 SVG 내부의 색상 값과 불러오는 방식도 확인해야 한다.',
    },
    {
        id: 3,
        title: 'CSS Module 클래스를 연결해 프로젝트 이름 강조하기',
        date: '2026-09-05',
        resolved: true,
        problem:
            'Experience의 프로젝트 이름을 노란색으로 강조하려고 CSS를 작성했지만 화면에 배경색이 적용되지 않았다.',
        attempts: [
            'CSS 파일에 projectName 클래스와 배경색이 작성돼 있는지 확인했다.',
            'TSX를 확인해 프로젝트 이름을 표시하는 h3에 클래스 연결이 빠져 있는 것을 발견했다.',
        ],
        solution:
            'h3에 className={styles.projectName}을 연결했다. 배경색과 함께 글꼴도 바뀌어, 기존 글자 모양을 유지하도록 해당 클래스의 font 선언을 제거했다.',
        learned:
            'CSS Module은 클래스를 정의한 뒤 JSX 요소에 연결해야 적용된다. font 단축 속성은 글자 크기뿐 아니라 두께와 글꼴도 함께 바꾼다는 점을 배웠다.',
    },
    {
        id: 4,
        title: 'Node.js 버전 차이로 발생한 패키지 설치 경고 해결',
        date: '2026-09-04',
        resolved: true,
        problem:
            '다른 컴퓨터에서 프로젝트를 설치하던 중 EBADENGINE 경고가 발생했다. 당시 터미널에서 사용하는 Node.js는 16 버전이었다.',
        attempts: [
            '설치 로그의 current와 required 항목을 비교했다.',
            '설치가 완료되더라도 현재 Node.js 버전이 프로젝트 패키지의 요구 조건을 충족하지 못할 수 있다는 것을 확인했다.',
        ],
        solution:
            'Node.js를 업데이트하고 터미널을 다시 열어 버전을 확인했다. 이후 로컬 개발 서버를 실행해 화면이 열리는 것을 확인했다.',
        learned:
            '같은 프로젝트라도 컴퓨터에 설치된 실행 환경이 다르면 문제가 생길 수 있다. 새 환경에서는 패키지 설치 결과와 함께 Node.js 버전도 확인해야 한다.',
    },
]
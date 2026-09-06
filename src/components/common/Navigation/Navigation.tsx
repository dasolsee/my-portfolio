import styles from './Navigation.module.css'

function Navigation() {
    const navigationItems = [
        {
            id: 'about',
            label: 'About',
        },
        {
            id: 'experience',
            label: 'Experience',
        },
        {
            id: 'skills',
            label: 'Skills',
        },
        {
            id: 'projects',
            label: 'Projects',
        },
        {
            id: 'contact',
            label: 'Contact',
        },
    ]

    return (
        <nav aria-label="메인 메뉴">
            {/* navigationItems를 map으로 순회하여 같은 구조의 메뉴를 반복 렌더링 */}
            <ul className={styles.list}>
                {navigationItems.map((item) => (
                    // React가 각 메뉴 항목을 구분할 수 있도록 고유한 id를 key로 사용한다.
                    <li key={item.id}>
                        {/* /는 홈 주소, # 뒤의 값은 이동할 섹션의 id를 뜻한다. */}
                        <a href={`/#${item.id}`}>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Navigation
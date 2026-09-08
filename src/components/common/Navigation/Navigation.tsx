import { useEffect, useRef } from 'react'
import styles from './Navigation.module.css'
import { Link, useLocation } from 'react-router-dom'
import useActiveSection from '../../../hooks/useActiveSection'

const navigationItems = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
]

const sectionIds = navigationItems.map((item) => item.id)

function Navigation() {
    const { pathname } = useLocation()
    const activeSection = useActiveSection(sectionIds)
    const navigationRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (pathname !== '/' || !activeSection || !navigationRef.current) {
            return
        }

        const activeLink = navigationRef.current.querySelector<HTMLElement>(
            `[data-section="${activeSection}"]`
        )
        const scrollContainer = navigationRef.current.parentElement

        if (
            !activeLink ||
            !scrollContainer ||
            scrollContainer.scrollWidth <= scrollContainer.clientWidth
        ) {
            return
        }

        const containerRect = scrollContainer.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        const linkCenter = linkRect.left + linkRect.width / 2
        const containerCenter = containerRect.left + containerRect.width / 2

        scrollContainer.scrollTo({
            left: scrollContainer.scrollLeft + linkCenter - containerCenter,
            behavior: 'smooth',
        })
    }, [activeSection, pathname])

    return (
        <nav ref={navigationRef} aria-label="메인 메뉴">
            {/* navigationItems를 map으로 순회하여 같은 구조의 메뉴를 반복 렌더링 */}
            <ul className={styles.list}>
                {navigationItems.map((item) => (
                    // React가 각 메뉴 항목을 구분할 수 있도록 고유한 id를 key로 사용한다.
                    <li key={item.id}>
                        {/* /는 홈 주소, # 뒤의 값은 이동할 섹션의 id를 뜻한다. */}
                        <Link
                            to={`/#${item.id}`}
                            data-section={item.id}
                            aria-current={
                                pathname === '/' && activeSection === item.id
                                    ? 'location'
                                    : undefined
                            }
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Navigation

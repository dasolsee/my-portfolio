import Navigation from '../Navigation/Navigation.tsx'
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
    const { pathname } = useLocation()
    return (
        <header className={styles.header}>
                <div className={`container ${styles.inner}`}>
                    {/*브라우저 파비콘 이미지 앵무새를 헤더 로고에도 사용한당*/}
                    <Link className={styles.logo} to="/">
                        <img src="/favicon.svg" alt=""/>
                        <span>Portfolio</span>
                    </Link>

                    {/*오른쪽 메뉴바인 Navigation과 Archive를 하나로 묶어준다*/}
                <div className={styles.menu}>
                    <Navigation />
                <Link
                    to="/archive"
                    aria-current={
                        pathname === '/archive' || pathname.startsWith('/archive/')
                            ? 'page'
                            : undefined
                    }
                >Archive</Link>
                </div>
            </div>
        </header>
    )
}

export default Header;

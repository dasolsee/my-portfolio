import Navigation from '../Navigation/Navigation.tsx'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
    return (
        <header className={styles.header}>
                <div className={`container ${styles.inner}`}>
                <Link className={styles.logo} to = "/">Portfolio</Link>

                    {/*오른쪽 메뉴바인 Navigation과 Archive를 하나로 묶어준다*/}
                <div className={styles.menu}>
                    <Navigation />
                <Link to ="/archive">Archive</Link>
                </div>
            </div>
        </header>
    )
}

export default Header;
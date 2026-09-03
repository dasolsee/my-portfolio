import Navigation from '../Navigation/Navigation.tsx'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <header>
            <div className="container">
                <Link to="/">Portfolio</Link>
                <Navigation />
                <Link to="/archive">Archive</Link>
            </div>
        </header>
    )
}

export default Header;
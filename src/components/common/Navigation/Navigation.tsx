import {navigationItems} from '../../../data/navigation'

function Navigation() {
    return(
        <nav aria-label="메인 메뉴">
            <ul>
                {navigationItems.map((item) => (
                    <li key={item.id}>
                    <a href={`#${item.id}`}>
                    {item.label}</a></li>
                ))}
            </ul>
        </nav>
    )
}

export default Navigation;
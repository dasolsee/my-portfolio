function Navigation() {
    const navigationItems = [
        {
            id: 'about',
            label: 'About',
        },
        {
            id: 'experience',
            label:'Experience',
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
        }
    ]

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
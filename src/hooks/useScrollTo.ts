// React Router로 페이지를 이동할 때 이전 스크롤 위치가 남지 않도록 조정한다.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function useScrollTo() {
    const { pathname, hash } = useLocation()
    useEffect(() => {
        // # 뒤에 섹션 주소가 있으면 해당 id를 가진 섹션으로 이동한다.
        if (hash) {
            const sectionId = hash.replace('#', '')
            const section = document.getElementById(sectionId)

            if (section) {
                section.scrollIntoView()
            }

            return
        }

        // 섹션 주소가 없는 새로운 페이지는 맨 위에서 시작한다.
        window.scrollTo({
            top: 0,
            left: 0,
        })
    }, [pathname, hash])
}

export default useScrollTo

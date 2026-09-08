// 주소에 따라 화면을 전환하는 React Router 기능을 불러온다.
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Archive from './pages/Archive/Archive'
import ArchiveDetail from './pages/Archive/ArchiveDetail'
import ArchiveWrite from './pages/Archive/ArchiveWrite'
import ArchiveEdit from './pages/Archive/ArchiveEdit'
import useScrollTo from './hooks/useScrollTo'

// 페이지 주소가 변경될 때 스크롤 위치를 조정한다.
// 화면을 그리지 않는 기능용 컴포넌트이므로 별도의 함수로 분리한다.
function ScrollToTop() {
    useScrollTo()

    return null
}

function App() {
    // BrowserRouter는 브라우저 주소 변경을 감지하고 라우팅 기능을 제공한다.
    return (
        <BrowserRouter>
            {/* useLocation은 BrowserRouter 안에서만 사용할 수 있다. */}
            <ScrollToTop />
            {/* Routes는 현재 주소에 맞는 Route를 찾아 해당 화면을 표시한다. */}
            <Routes>
                {/* 기본 주소에서는 홈 화면을 보여줌. */}
                <Route path="/" element={<Home />} />

                {/* /archive 주소에서는 기록 목록을 보여줌. */}
                <Route path="/archive" element={<Archive />} />

                {/* 문제 해결 기록 작성 페이지 */}
                <Route path="/archive/new" element={<ArchiveWrite />} />

                {/* 기존 문제 해결 기록 수정 페이지 */}
                <Route path="/archive/:id/edit" element={<ArchiveEdit />} />

                {/* :id는 기록 번호가 들어가는 자리이며 상세 페이지에서 useParams로 읽는다. */}
                <Route path="/archive/:id" element={<ArchiveDetail />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

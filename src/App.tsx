// 주소에 따라 화면을 전환하는 React Router 기능을 불러온다.
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Archive from './pages/Archive/Archive'
import ArchiveDetail from './pages/Archive/ArchiveDetail'

function App() {
    // BrowserRouter는 브라우저 주소 변경을 감지하고 라우팅 기능을 제공한다.
    return (
        <BrowserRouter>
            {/* Routes는 현재 주소에 맞는 Route를 찾아 해당 화면을 표시한다. */}
            <Routes>
                {/* 기본 주소에서는 홈 화면을 보여줌. */}
                <Route path="/" element={<Home />} />

                {/* /archive 주소에서는 기록 목록을 보여줌. */}
                <Route path="/archive" element={<Archive />} />

                {/* :id는 기록 번호가 들어가는 자리이며 상세 페이지에서 useParams로 읽는다. */}
                <Route path="/archive/:id" element={<ArchiveDetail />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Archive from "./pages/Archive/Archive.tsx";
import Home from "./pages/Home/Home.tsx";

function App() {
  return (
      <BrowserRouter> {/*브라우저 URL을 리액터라우터가 감지할수 있게 해줌*/}
        <Routes>
          <Route path= "/" element={<Home />} /> {/*주소가 기본 /일때 홈보여주기*/}
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App

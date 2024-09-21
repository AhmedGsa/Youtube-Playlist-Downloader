import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Videos from "./pages/Videos"

function App(): JSX.Element {

    return (
      <BrowserRouter>
		<Routes>
		  <Route path="/" element={<Home />} />
		  <Route path="/videos" element={<Videos />} />
		</Routes>
	  </BrowserRouter>
    )
}

export default App

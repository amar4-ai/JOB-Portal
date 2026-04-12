import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ApplyJob from "./pages/ApplyJob"
import Applications from "./pages/Applications"

export default function App() {
  return (
    <>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/appy-job/:id" element={<ApplyJob />} />
      <Route path="/applications" element={<Applications />} />
    </Routes>
     
    </>
  )
}
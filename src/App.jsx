import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './page/Home'
import PrintPage from './page/PrintPage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './page/Login'
import ProtectedRoute from './component/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)
  const [login, setLogin] = useState(false);


  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/home' element={<Home />} />
            <Route path='/struk' element={<PrintPage />} />
          </Route>

        </Routes>
      </Router >

      {/* <PrintPage /> */}
    </>
  )
}

export default App

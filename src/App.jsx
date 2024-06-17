import AdminDash from './pages/Admin/AdminDash'
import UserDash from './pages/User/UserDash'
import Login from './pages/Login/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/admindash' element={<AdminDash/>}/>
        <Route path='/userdash' element={<UserDash/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

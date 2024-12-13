import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ProfilePage from './pages/Profile';
import CallbackPage from './pages/Callback';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/profile' element={<ProfilePage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/signup' element={<SignupPage />}/>
          <Route path='/auth/callback' element={<CallbackPage />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;

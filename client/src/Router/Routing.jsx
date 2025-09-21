import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import Home from '../components/Home'
import About from '../pages/About'
import Testimonial from '../pages/Testimonial'
import Service from '../pages/Service'
import Blog from '../pages/Blog'
import Contact from '../pages/Contact'
import ClientSignUp from '../Auth/client/Registation'
import Login from '../Auth/client/login'
import UserDashboard from '../Auth/client/dashboard'
import CoachLogin from '../Auth/coach/login'

import CoachDashboard from '../Auth/coach/Dashboard'
import OnboardingclientPage from '../Auth/coach/Addclient'
import Onboarding from '../Auth/coach/Onboarding'
import CoachProfile from '../Auth/coach/profile'
import ClientDetails from '../Auth/coach/ClientDetails'
import BlogSingle from '../pages/Blogsingle'
import ProtectedRoutes from './Protectrouting'
import Error from '../pages/Error'
import ClientForgetPassword from '../Auth/client/client_forgotpassword'
import Client_ResetPassword from '../Auth/client/Client_resetpassword'
import CoachForgetPassword from '../Auth/coach/coach_forgotpassword'
import Coach_ResetPassword from '../Auth/coach/Coach_resetpassword'
import CoachSetPassword from '../Auth/coach/changepassword'
const Routing = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/testimonial' element={<Testimonial />} />
        <Route path='/services' element={<Service />} />
        <Route path="/error" element={<Error />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/blog' element={<Blog />} />
          <Route path="/blog/:id" element={<BlogSingle />} />
        </Route>

        <Route path='/contact' element={<Contact />} />
        <Route path='/signup' element={<ClientSignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/client/dashboard' element={<UserDashboard />} />
        <Route path='/client/forgetpassword' element={<ClientForgetPassword/>} />
        <Route path="/resetpassword/:token" element={<Client_ResetPassword/>}/>
        <Route path='/coach/login' element={<CoachLogin />} />
        <Route path='/coach/dashboard' element={<CoachDashboard />} />
        <Route path='/coach/client/onboarding' element={<OnboardingclientPage />} />
        <Route path='/coach/onboarding' element={<Onboarding />} />
        <Route path='/coach/profile' element={<CoachProfile />} />
        <Route path='/coach/clients' element={<ClientDetails />} />
        <Route path='/coach/forgetpassword' element={<CoachForgetPassword/>} />
        <Route path="/resetpassword/:token" element={<Coach_ResetPassword/>}/>
        <Route path="/coach/changepassword"element={<CoachSetPassword/>}/>

      </Routes>
      <Footer />
    </Router>
  )
}

export default Routing
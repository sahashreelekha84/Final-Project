import React from 'react'
import Banner from '../pages/Banner'
import About from '../pages/About'
import Testimonial from '../pages/Testimonial'
import Service from '../pages/Service'
// import Blog from '../pages/Blog'

const Home = () => {
  return (
    <div>
        <Banner/>
        <About/>
        <Testimonial/>
        <Service/>
        {/* <Blog/> */}
        </div>
  )
}

export default Home
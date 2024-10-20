// tech stack: React.js with Tailwind CSS

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AddBooking from "./pages/AddBooking";
import Track from "./pages/Track";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Truck from "./pages/Truck";
import Vihicles from "./pages/Vehicles";
import CompanyContextProvider from "./Context/CompanyContext";
import SimpleBooking from "./pages/SimpleBooking";
import ServicesPage from "./pages/ServicesPage";

export default function App() {
  return (
    <main class="bg-primary text-tertiary">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={ <Home/> }/>
          <Route path="/booking" element={ <AddBooking/> }/>
          <Route path="/track" element={ <Track/> }/>
          <Route path="/about" element={ <About/> }/>
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cart" element={ <Cart/> }/>
          <Route path="/login" element={ <Login/> }/>
          <Route path="/contact" element={ <Contact/> }/>
          <Route path="/truck" element={ <Truck/> }>
            <Route path=":truckID" element={ <Truck/> }/>
          </Route>
          <Route path="/vehicles" element={ <Vihicles/> }/>

        </Routes>
        <Footer/>
      </BrowserRouter>

    </main>
    
  )
}

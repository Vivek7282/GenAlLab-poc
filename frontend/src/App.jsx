import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./pages/Homepage";
export default function App() {
  return (
    <>
          <BrowserRouter>
          <Routes>
          <Route
              path="/"
              element={
               
                  <HomePage />
              
              }
            />
          </Routes>
          </BrowserRouter>
    </>
    
  )
}

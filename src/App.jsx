import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Starter from './components/Starter';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Starter/>}></Route>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App

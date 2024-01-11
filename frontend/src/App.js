import './App.css';
import HomePage from "./components/pages/HomePage";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";

function App() {
  return (
      <Routes>
        <Route path='/' element= {<HomePage/>}></Route>
        <Route path='/auth' element={<LoginPage/>}></Route>
      </Routes>
  );
}

export default App;

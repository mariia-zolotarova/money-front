import { useQuery, gql } from '@apollo/client';
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import {Route, Routes} from "react-router-dom";
import Categories from "./pages/Categories/Categories";
import Charts from "./pages/Charts/Charts";
import History from "./pages/History/History";
import Person from "./pages/Person/Person";
import Footer from "./components/Footer/Footer";



export default  function App() {

  return (
    <>
        <Header></Header>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/categories' element={<Categories/>}></Route>
            <Route path='/charts' element={<Charts />}></Route>
            <Route path='/history' element={<History/>}></Route>
            <Route path='/person' element={<Person/>}></Route>
            <Route path="*" element={<h1>404</h1>}></Route>
        </Routes>
        <Footer></Footer>
    </>
  );
}



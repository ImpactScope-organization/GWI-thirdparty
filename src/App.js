
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Reports from "./Pages/Reports";
import Header from "./Components/Shared/Header";
import { useStepsContext } from "./Context/StateContext";
import Login from "./Components/Shared/Login";
import { useEffect } from "react";


function App() {
  const {openLoginModal, setOpenLoginModal}  = useStepsContext()

  useEffect(()=>{

    setOpenLoginModal(!openLoginModal)


  }, [])

  return (
    <div className="App">
      <Header />
       <ToastContainer position="top-right" autoClose={3000} />
      {openLoginModal && <Login />}
      <Routes>
        <Route path="/" element={<Reports />}></Route>
      </Routes>
    </div>
  );
}

export default App;

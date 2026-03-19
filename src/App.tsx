import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Rendezvous from "./pages/Rendezvous";
import Admin from "./pages/Admin";
import Catalogue from "./pages/catalogue";
import Compta from "./pages/compta"
import ChangeCatalogue from "./pages/changeCatalogue";

const App: React.FC = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rendezvous" element={<Rendezvous />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/compta" element={<Compta />} />
        <Route path="/change-catalogue" element={<ChangeCatalogue />} />
        <Route path="/admin-vps-spa" element={<ChangeCatalogue />} />
      </Routes>
    </>
  );
};

export default App;





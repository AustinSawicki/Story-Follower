import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = ({ children }) => {
  return (
    <div className="bg-theme min-h-screen">
      <Navbar />
      <div>
        {children}
      </div>
      <Footer/>
    </div>
  );
};

export default Layout;
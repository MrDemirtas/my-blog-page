import { useEffect, useState } from "react";

import Footer from "./components/Footer";
import Header from "./components/Header";
import { getPage } from "./helper.jsx";

export default function App() {
  const [route, setRoute] = useState(location.hash.substring(1) || "/");
  
  useEffect(() => {
    window.addEventListener("hashchange", () => setRoute(location.hash.substring(1)));
  }, []);

  return (
    <>
      <Header setRoute={setRoute} />
      {getPage(route)}
      <Footer />
    </>
  )
}

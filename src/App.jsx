import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/home";
import Aboutpage from "./pages/Aboutpage";
import Servicespage from "./pages/Servicespage";
import Contactpage from "./pages/Contactpage";
import ContentPage from "./Adminpages/ContentPage";
import PopupBanner from "./components/PopupBanner";

function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    if (!hash && !state?.scrollTo) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [pathname, hash, state]);

  return null;
}

function App() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      {pathname !== "/admin" && <PopupBanner />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/services" element={<Servicespage />} />
        <Route path="/contact" element={<Contactpage />} />
         <Route
          path="/admin"
          element={<ContentPage />}
        />
      </Routes>
    </>
  );
}

export default App;
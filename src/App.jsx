import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import RestaurantList from "./pages/RestaurantList.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import GiftList from "./pages/GiftList.jsx";
import GiftDetail from "./pages/GiftDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      <Route path="/gifts" element={<GiftList />} />
      <Route path="/gifts/:id" element={<GiftDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

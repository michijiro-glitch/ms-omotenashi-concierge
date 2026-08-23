import { Navigate, Route, Routes } from "react-router-dom";
import GiftDetail from "./pages/GiftDetail.jsx";
import GiftEdit from "./pages/GiftEdit.jsx";
import GiftList from "./pages/GiftList.jsx";
import About from "./pages/About.jsx";
import EditHub from "./pages/EditHub.jsx";
import Home from "./pages/Home.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import RestaurantEdit from "./pages/RestaurantEdit.jsx";
import RestaurantList from "./pages/RestaurantList.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/edit" element={<EditHub />} />
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurants/new" element={<RestaurantEdit />} />
      <Route path="/restaurants/:id/edit" element={<RestaurantEdit />} />
      <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      <Route path="/gifts" element={<GiftList />} />
      <Route path="/gifts/new" element={<GiftEdit />} />
      <Route path="/gifts/:id/edit" element={<GiftEdit />} />
      <Route path="/gifts/:id" element={<GiftDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

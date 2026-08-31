import { Navigate, Route, Routes, useParams } from "react-router-dom";
import GiftDetail from "./pages/GiftDetail.jsx";
import GiftEdit from "./pages/GiftEdit.jsx";
import GiftList from "./pages/GiftList.jsx";
import About from "./pages/About.jsx";
import ChoiceDetail from "./pages/ChoiceDetail.jsx";
import ChoiceList from "./pages/ChoiceList.jsx";
import EditHub from "./pages/EditHub.jsx";
import Home from "./pages/Home.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import RestaurantEdit from "./pages/RestaurantEdit.jsx";
import RestaurantList from "./pages/RestaurantList.jsx";

function LegacyEditRedirect({ to }) {
  const { id } = useParams();
  return <Navigate to={`${to}/${id}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/choice" element={<ChoiceList />} />
      <Route path="/choice/:slug" element={<ChoiceDetail />} />
      <Route path="/edit" element={<EditHub />} />
      <Route path="/edit/restaurants/new" element={<RestaurantEdit />} />
      <Route path="/edit/restaurants/:id" element={<RestaurantEdit />} />
      <Route path="/edit/gifts/new" element={<GiftEdit />} />
      <Route path="/edit/gifts/:id" element={<GiftEdit />} />
      <Route path="/restaurants/new" element={<Navigate to="/edit/restaurants/new" replace />} />
      <Route path="/restaurants/:id/edit" element={<LegacyEditRedirect to="/edit/restaurants" />} />
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      <Route path="/gifts/new" element={<Navigate to="/edit/gifts/new" replace />} />
      <Route path="/gifts/:id/edit" element={<LegacyEditRedirect to="/edit/gifts" />} />
      <Route path="/gifts" element={<GiftList />} />
      <Route path="/gifts/:id" element={<GiftDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

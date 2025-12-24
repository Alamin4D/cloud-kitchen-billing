import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CorporateListPage from "./pages/CorporateListPage";
import EventListPage from "./pages/EventListPage";
import CorporateFormPage from "./pages/CorporateFormPage";
import EventFormPage from "./pages/EventFormPage";
import BillDetailsPage from "./pages/BillDetailsPage";
import NotFound from "./pages/NotFound";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/corporate" replace />} />

        <Route path="/corporate" element={<CorporateListPage />} />
        <Route path="/corporate/new" element={<CorporateFormPage mode="create" />} />
        <Route path="/corporate/:id" element={<BillDetailsPage type="corporate" />} />
        <Route path="/corporate/:id/edit" element={<CorporateFormPage mode="edit" />} />

        <Route path="/event" element={<EventListPage />} />
        <Route path="/event/new" element={<EventFormPage mode="create" />} />
        <Route path="/event/:id" element={<BillDetailsPage type="event" />} />
        <Route path="/event/:id/edit" element={<EventFormPage mode="edit" />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
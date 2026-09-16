import { BrowserRouter, Route, Routes } from "react-router-dom";

import { BottomNavigation } from "./components/layout/BottomNavigation/BottomNavigation";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Expenses } from "./pages/expenses/Expenses";
import { Summary } from "./pages/summary/Summary";
import { Settings } from "./pages/settings/Settings";
import { Categories } from "./pages/categories/Categories";

function App() {
  return (
    <BrowserRouter basename="/spese-app">
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/spese" element={<Expenses />} />
          <Route path="/riepilogo" element={<Summary />} />
          <Route path="/categorie" element={<Categories />} />
          <Route path="/impostazioni" element={<Settings />} />
        </Routes>

        <BottomNavigation />
      </div>
    </BrowserRouter>
  );
}

export default App;

import {
  Home,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./BottomNavigation.css";

export function BottomNavigation() {
  return (
    <nav className="bottom-navigation">
      <NavLink
        to="/"
        className="bottom-navigation-item"
      >
        <Home size={21} />

        <span>Home</span>
      </NavLink>

      <NavLink
        to="/spese"
        className="bottom-navigation-item"
      >
        <Receipt size={21} />

        <span>Spese</span>
      </NavLink>

      <NavLink
        to="/riepilogo"
        className="bottom-navigation-item"
      >
        <BarChart3 size={21} />

        <span>Riepilogo</span>
      </NavLink>

      <NavLink
        to="/impostazioni"
        className="bottom-navigation-item"
      >
        <Settings size={21} />

        <span>Impostazioni</span>
      </NavLink>
    </nav>
  );
}

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  MapPin,
  Car,
  Briefcase,
  Gift,
  TrendingUp,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  UserRoundPen,
  UserStar,
  ClipboardMinus,
  ShieldHalf,
  ReceiptText,
  Flag,
  MessagesSquare,
  UsersRound,
  Orbit,
  Medal,
} from "lucide-react";
import type { NavItem } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setRouteName } from "../../rtkquery/slice/globaldataSlice";
import type { RootState } from "../../rtkquery/store";

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const dispatch = useDispatch();

  const routeName = useSelector(
    (state: RootState) => state.globaldata.routeName,
  );

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
    dispatch(setRouteName(id));
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "dashboard":
        return <Home size={20} />;
      case "users":
        return <UsersRound size={20} />;
      case "rides":
        return <MapPin size={20} />;
      case "drivers":
        return <Car size={20} />;
      case "business":
        return <Briefcase size={20} />;
      case "PlanExtraction":
        return <Orbit size={20} />;
      case "subcription":
        return <Medal size={20} />;

      case "chat":
        return <MessagesSquare size={20} />;
      case "referrals":
        return <Gift size={20} />;
      case "financial-analytics":
        return <TrendingUp size={20} />;
      case "notifications":
        return <Bell size={20} />;
      case "ReportShowPage":
        return <Flag size={20} />;
      case "settings":
        return <Settings size={20} />;
      case "editprofile":
        return <UserRoundPen size={20} />;
      case "admin":
        return <UserStar size={20} />;
      case "about":
        return <ClipboardMinus size={20} />;
      case "privacy":
        return <ShieldHalf size={20} />;
      case "terms":
        return <ReceiptText size={20} />;
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 bg-[#053F53] fixed left-0 top-0 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <img
          src="/logomain.png"
          alt="Logo"
          className="w-60 h-auto object-contain"
        />
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-4 pb-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            if (item.children?.length) {
              return (
                <li key={item.id}>
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 rounded-lg transition ${
                      routeName === item.id
                        ? "bg-[#0C243D] text-white"
                        : "text-[#E7E9EC] hover:bg-[#0C243D]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(item.id)}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        openDropdowns[item.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdowns[item.id] && (
                    <ul className="ml-10 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <NavLink
                            to={child.path ?? "#"}
                            onClick={() => dispatch(setRouteName(child.id))}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-md text-sm transition ${
                                routeName === child.id || isActive
                                  ? "bg-[#0C243D] text-white"
                                  : "text-gray-400 hover:text-white hover:bg-[#0C243D]"
                              }`
                            }
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(child.id)}
                              <span className="font-medium">{child.label}</span>
                            </div>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            // Single items (no children)
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path ?? "#"}
                  onClick={() => dispatch(setRouteName(item.id))}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      routeName === item.id || isActive
                        ? "bg-[#0C243D] text-white"
                        : "text-[#E7E9EC] hover:bg-[#0C243D]"
                    }`
                  }
                >
                  {getIcon(item.id)}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-300 flex items-center gap-3">
        <LogOut size={20} color="#fff" />
        <span className="text-white">Log Out</span>
      </div>
    </aside>
  );
};

export default Sidebar;

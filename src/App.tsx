import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./components/mainPage/DashboardPage";
import ChatPage from "./components/chat/ChatPage";
import UsersPage from "./components/mainPage/UsersPage";
import RidesPage from "./components/mainPage/RidesPage";
import DriverPage from "./components/mainPage/DiverPage";
import FinanceAnalysis from "./components/mainPage/FinanceAnalysis";
import NotificationPage from "./components/mainPage/NotificationPage";
import ReportShowPage from "./components/mainPage/ReportShowPage";
import EditProfile from "./components/setting/EditProfile";
import AboutUs from "./components/setting/AboutUs";
import PrivacyPolicy from "./components/setting/PrivacyPolicy";
import TermsCondition from "./components/setting/TermsCondition";
import Admin from "./components/setting/Admin";
import PlanExpiration from "./components/mainPage/PlanExtraction";
import NotificationShow from "./components/mainPage/NotificationShow";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout route */}
        <Route path="/" element={<Layout />}>
          {/* Default route */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Pages */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/rides" element={<RidesPage />} />
          <Route path="/drivers" element={<DriverPage />} />
          <Route path="/financial-analytics" element={<FinanceAnalysis />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/ReportShowPage" element={<ReportShowPage />} />
          <Route path="/PlanExtraction" element={<PlanExpiration />} />
          <Route path="/NotificationShow" element={<NotificationShow />} />

          <Route path="/settings/editprofile" element={<EditProfile />} />
          <Route path="/settings/admin" element={<Admin />} />
          <Route path="/settings/about" element={<AboutUs />} />
          <Route path="/settings/privacy" element={<PrivacyPolicy />} />
          <Route path="/settings/terms" element={<TermsCondition />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

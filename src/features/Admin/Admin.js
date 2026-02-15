import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminSidebar from "./AdminAreaSidebar";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import { useMyContext } from "../../store/ContextApi";
import AuditLogsDetails from "./AuditLogsDetails";
import AdminAuditLogs from "./AdminAuditLogs";
import RoomList from "../RunningRoom/Room/RoomList.tsx";
import RoomDetails from "../RunningRoom/Room/RoomDetails.tsx";
import CreateRoom from "../RunningRoom/Room/CreateRoom.tsx";
import BuildingsPage from "../RunningRoom/Building/BuildingsPage.tsx";
import MenusPage from "../RunningRoom/Kitchen/MenusPage.tsx";
import BedOccupancyDashboard from "../RunningRoom/Bookings/BedOccupancyDashboard.tsx";

const Admin = () => {
  // Access the openSidebar hook using the useMyContext hook from the ContextProvider
  const { openSidebar } = useMyContext();
  return (
    <div className="flex">
      <AdminSidebar />
      <div
        className={`transition-all overflow-hidden flex-1 duration-150 w-full ${openSidebar ? "lg:ml-52 ml-12" : "ml-12"
          }`}
      >
        <Routes>
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="audit-logs/:noteId" element={<AuditLogsDetails />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:userId" element={<UserDetails />} />
          <Route path="rooms" element={<RoomList />} />
          <Route path="rooms/new" element={<CreateRoom />} />
          <Route path="rooms/edit/:roomId" element={<RoomDetails />} />

          <Route path="buildings" element={<BuildingsPage />} />

          <Route path="menu" element={<MenusPage />} />

          <Route path="bookings" element={<BedOccupancyDashboard />} />


          {/* Add other routes as necessary */}
        </Routes>
      </div>
    </div>
  );
};

export default Admin;

import React, { useEffect, useState } from "react";
import api from "../../../services/api.js";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Errors from "../../Errors.js";
import { IoMdAdd } from "react-icons/io";
import { FiRefreshCw } from "react-icons/fi";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

// ---- Types ----
interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  ac: boolean;
  capacity: number;
  floor: number;
  buildingId: string;
  buildingName?: string; // optional, will be mapped
  description?: string;
  crewType: string;
  roomCategory: string;
  beds: number;
  attachment: string;
  status: string;
  tenantId?: string;
}

interface Building {
  id: string;
  buildingName: string;
}

// Helper: format enum values
const formatEnum = (value?: string) => {
  if (!value) return "-";
  const s = value.replace(/_/g, " ").toLowerCase();
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
};

// --- Columns ---
const getColumns = (): GridColDef[] => [
  {
    field: "roomNumber",
    headerName: "Room No.",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => <span>{params.row.roomNumber}</span>,
  },
  {
    field: "roomType",
    headerName: "Type",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => <span>{formatEnum(params.row.roomType)}</span>,
  },
  {
    field: "ac",
    headerName: "AC",
    minWidth: 50,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => <span>{params.row.ac ? "Yes" : "No"}</span>,
  },
  {
    field: "capacity",
    headerName: "Capacity",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <MdOutlinePeopleAlt className="text-slate-700 text-lg" />
        <span>{params.row.capacity}</span>
      </div>
    ),
  },
  {
    field: "floor",
    headerName: "Floor",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "buildingName",
    headerName: "Building",
    minWidth: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "crewType",
    headerName: "Crew Type",
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => <span>{formatEnum(params.row.crewType)}</span>,
  },
  {
    field: "roomCategory",
    headerName: "Category",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => <span>{formatEnum(params.row.roomCategory)}</span>,
  },
  {
    field: "beds",
    headerName: "Beds",
    minWidth: 50,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "attachment",
    headerName: "Attachment",
    minWidth: 80,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <Tooltip title={`Room is ${formatEnum(params.row.status)}`} arrow>
        <span
          className={`px-2 py-1 rounded-md ${params.row.status === "AVAILABLE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {formatEnum(params.row.status)}
        </span>
      </Tooltip>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    width: 100,
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: (params) => (
      <Link
        to={`/admin/rooms/edit/${params.row.id}`}
        className="h-full flex items-center justify-center"
      >
        <button className="bg-btnColor text-white px-4 flex justify-center items-center h-9 rounded-md">
          View
        </button>
      </Link>
    ),
  },
];

// --- Component ---
const RoomList: React.FC = () => {
  const location = useLocation();
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await api.get<Building[]>("/buildings");
        setBuildings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (buildings.length === 0) return; // wait until buildings are loaded

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await api.get<Room[]>("/rooms");
        const roomData = res.data.map((r) => {
          const building = buildings.find((b) => b.id === r.buildingId);
          return { ...r, buildingName: building?.buildingName || "-" };
        });
        setRooms(roomData);
        setAllRooms(roomData);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch rooms");
        toast.error("Error fetching rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [buildings]);

  // --- Filter ---
  const handleSearch = (text: string) => {
    setSearchText(text);
    setRooms(allRooms.filter((r) => r.roomNumber.toLowerCase().includes(text.toLowerCase())));
  };

  if (error) return <Errors message={error} />;

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">All Rooms</h1>
      </div>

      <div className="mb-4 w-full max-w-sm mx-auto flex gap-2">
        <input
          type="text"
          placeholder="Search by room number..."
          className="border p-2 rounded w-full"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button
          title="Refresh"
          className="bg-gray-200 text-gray-800 px-4 rounded hover:bg-gray-300"
          onClick={() => handleSearch("")}
        >
          <FiRefreshCw className="h-5 w-5" />
        </button>
        <Link to="/admin/rooms/new" className="ml-auto">
          <button
            title="Add new room"
            className="bg-btnColor text-white px-4 flex justify-center items-center h-11 rounded-md"
          >
            <IoMdAdd className="h-5 w-5" />
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto w-full mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-72">
            <Blocks height="70" width="70" color="#4fa94d" ariaLabel="blocks-loading" visible />
            <span>Please wait...</span>
          </div>
        ) : (
          <DataGrid
            className="w-fit mx-auto"
            rows={rooms}
            columns={getColumns()}
            initialState={{
              pagination: { paginationModel: { pageSize: 6 } },
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[6, 10, 20]}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5", // optional: header bg
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold", // make all header text bold
                color: "black", // optional: header text color
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RoomList;

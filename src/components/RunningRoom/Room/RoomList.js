import React, { useEffect, useState } from "react";
import api from "../../../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Errors from "../../Errors.js";
import { IoMdAdd } from "react-icons/io";
import { FiRefreshCw } from "react-icons/fi"; // Feather icons
import { MdOutlinePeopleAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";



// Helper: format enum values
const formatEnum = (value) => {
    if (!value) return "-";
    const s = String(value).replace(/_/g, " ").toLowerCase();
    return s.replace(/\b\w/g, (c) => c.toUpperCase());
};

// Columns for DataGrid
const roomListColumns = [
    {
        field: "roomNumber",
        headerName: "Room No.",
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.roomNumber}</span>
            </div>
        ),
    },
    {
        field: "roomType",
        headerName: "Type",
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{formatEnum(params.row.roomType)}</span>
            </div>
        ),
    },
    {
        field: "ac",
        headerName: "AC",
        minWidth: 10,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.ac ? "Yes" : "No"}</span>
            </div>
        ),
    },
    {
        field: "capacity",
        headerName: "Capacity",
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
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
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.floor}</span>
            </div>
        ),
    },
    {
        field: "building",
        headerName: "Building",
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.building || "-"}</span>
            </div>
        ),
    },
    {
        field: "crewType",
        headerName: "Crew Type",
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.crewType ? formatEnum(params.row.crewType) : "-"}</span>
            </div>
        ),
    },
    {
        field: "category",
        headerName: "Category",
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.category ? formatEnum(params.row.category) : "-"}</span>
            </div>
        ),
    },
    {
        field: "beds",
        headerName: "Beds",
        minWidth: 50,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.beds}</span>
            </div>
        ),
    },
    {
        field: "attachment",
        headerName: "Attachment",
        minWidth: 10,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <span>{params.row.attachment}</span>
            </div>
        ),
    },
    {
        field: "status",
        headerName: "Status",
        minWidth: 100,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
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
        editable: false,
        sortable: false,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <Link
                to={`/admin/rooms/edit/${params.id}`}
                className="h-full flex items-center justify-center"
            >
                <button className="bg-btnColor text-white px-4 flex justify-center items-center h-9 rounded-md">
                    View
                </button>
            </Link>
        ),
    },
];

const RoomList = () => {
    const location = useLocation();
    const [allRooms, setAllRooms] = useState([]); // full original list
    const [rooms, setRooms] = useState([]);       // filtered/displayed
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchRooms = async () => {
            try {
                const response = await api.get("/rooms"); // adjust endpoint
                const roomsData = Array.isArray(response.data) ? response.data : [];
                setRooms(roomsData);
                setAllRooms(roomsData);
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to fetch rooms");
                toast.error("Error fetching rooms");
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [location.key]);

    // Prepare rows for DataGrid
    const rows = rooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        ac: room.ac,
        capacity: room.capacity,
        floor: room.floor,
        building: room.buildingName,
        discription: room.description,
        crewType: room.crewType,
        category: room.roomCategory,
        attachment: room.attachment,
        beds: room.beds,
        status: room.status,
        tenantId: room.tenantId
    }));

    if (error) return <Errors message={error} />;

    return (
        <div className="p-4">
            <div className="py-4">
                <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
                    All Rooms
                </h1>
            </div>

            {/* Search bar */}
            <div className="mb-4 w-full max-w-sm mx-auto flex gap-2">
                <input
                    type="text"
                    placeholder="Search by room number..."
                    className="border p-2 rounded w-full"
                    value={searchText}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchText(value);
                        setRooms(
                            allRooms.filter((r) =>
                                r.roomNumber.toLowerCase().includes(value.toLowerCase())
                            )
                        );
                    }}
                />

                <button
                    title="Refresh"
                    className="bg-gray-200 text-gray-800 px-4 rounded hover:bg-gray-300"
                    onClick={() => {
                        setSearchText("");
                        setRooms(allRooms); // reset to original full list
                    }}
                >
                    <FiRefreshCw className="h-5 w-5" />
                </button>
                <Link to="/admin/rooms/new" className="ml-auto">
                    <button
                        title="Add new room"
                        className="bg-btnColor text-white px-4 flex justify-center items-center h-11 rounded-md">
                        <IoMdAdd className="h-5 w-5" />
                    </button>
                </Link>

            </div>

            {/* DataGrid */}
            <div className="overflow-x-auto w-full mx-auto">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-72">
                        <Blocks
                            height="70"
                            width="70"
                            color="#4fa94d"
                            ariaLabel="blocks-loading"
                            visible={true}
                        />
                        <span>Please wait...</span>
                    </div>
                ) : (
                    <DataGrid
                        className="w-fit mx-auto"
                        rows={rows}
                        columns={roomListColumns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 6 } },
                        }}
                        disableRowSelectionOnClick
                        pageSizeOptions={[6, 10, 20]}
                        sortingOrder={["asc", "desc"]}
                        disableColumnResize
                        sx={{
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: "bold",
                                color: "black",
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default RoomList;

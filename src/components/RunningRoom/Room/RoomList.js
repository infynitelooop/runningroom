import React, { useEffect, useState } from "react";
import api from "../../../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { Blocks } from "react-loader-spinner";
import Errors from "../../Errors.js";
import { FaDoorOpen } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi"; // Feather icons
import { MdOutlineCategory, MdOutlinePeopleAlt } from "react-icons/md";
import { BiSolidUserCheck } from "react-icons/bi";
import { Link } from "react-router-dom";

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
        headerName: "Room Number",
        minWidth: 180,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <FaDoorOpen className="text-slate-700 text-lg" />
                <span>{params.row.roomNumber}</span>
            </div>
        ),
    },
    {
        field: "roomType",
        headerName: "Room Type",
        minWidth: 180,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <MdOutlineCategory className="text-slate-700 text-lg" />
                <span>{formatEnum(params.row.roomType)}</span>
            </div>
        ),
    },
    {
        field: "capacity",
        headerName: "Capacity",
        minWidth: 140,
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
        field: "status",
        headerName: "Status",
        minWidth: 160,
        headerAlign: "center",
        align: "center",
        sortable: true,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <span
                className={`px-2 py-1 rounded-md ${params.row.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
            >
                {formatEnum(params.row.status)}
            </span>
        ),
    },
    {
        field: "tenantId",
        headerName: "Tenant ID",
        minWidth: 200,
        headerAlign: "center",
        align: "center",
        sortable: false,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-1">
                <BiSolidUserCheck className="text-slate-700 text-lg" />
                <span>{params.row.tenantId || "-"}</span>
            </div>
        ),
    },
    {
        field: "action",
        headerName: "Action",
        width: 180,
        headerAlign: "center",
        align: "center",
        editable: false,
        sortable: false,
        headerClassName: "text-black font-semibold border",
        cellClassName: "text-slate-700 font-normal border",
        renderCell: (params) => (
            <Link
                to={`/admin/rooms/${params.id}`}
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
    }, []);

    // Prepare rows for DataGrid
    const rows = rooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        capacity: room.capacity,
        status: room.status,
        tenantId: room.tenantId,
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
                    className="bg-gray-200 text-gray-800 px-4 rounded hover:bg-gray-300"
                    onClick={() => {
                        setSearchText("");
                        setRooms(allRooms); // reset to original full list
                    }}
                >
                    <FiRefreshCw className="h-5 w-5" />
                </button>


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
                    />
                )}
            </div>
        </div>
    );
};

export default RoomList;

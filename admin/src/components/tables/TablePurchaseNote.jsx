import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../style/TableThree.css";

const TablePurchaseNote = () => {
    const [notes, setNotes] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allPurchasenote");
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch orders");
            }

            setNotes(data);
            setFilteredOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const handleViewOrder = (noteId) => {
        navigate(`/purchase-detail/${noteId}`);
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Are you sure you want to delete this purchase note?")) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/deletePurchase/${noteId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("✅ Purchase note deleted successfully");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                fetchNotes(); // Refresh the list
            } else {
                alert(result.message || "Failed to delete purchase note.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Server error while deleting purchase note.");
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = notes.filter((note) =>
            note.noteId.toString().toLowerCase().includes(query)
        );

        setFilteredOrders(filteredData);
    };

    return (
        <div className="table-container">
            <h4 className="table-title">Purchase Notes</h4>

            <input
                type="text"
                placeholder="Search by Supplier ID..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Note ID</th>
                        <th>Date</th>
                        <th>Supplier</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="loading-text text-center">Loading orders...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="5" className="error-text text-center">{error}</td>
                        </tr>
                    ) : filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-data text-center">No issued orders found</td>
                        </tr>
                    ) : (
                        filteredOrders.map((note) => (
                            <tr key={note.noteId}>
                                <td>{note.noteId}</td>
                                <td>{formatDate(note.date)}</td>
                                <td>{note.supId}</td>
                                <td>{note.total}</td>
                                <td className="action-buttons">
                                    <button
                                        className="view-btn"
                                        onClick={() => handleViewOrder(note.noteId)}
                                    >
                                        👁️
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteNote(note.noteId)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablePurchaseNote;

import React, { useEffect, useState } from "react";
import { Table, Button, Badge } from "reactstrap";
import Swal from "sweetalert2";

const ReceivedCheques = () => {
    const [cheques, setCheques] = useState([]);

    const fetchCheques = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/cheques/received");
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setCheques(data.cheques || []);
            } else {
                console.error("Error fetching cheques");
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchCheques();
    }, []);

    const updateChequeStatus = async (chequeId, newStatus) => {
        const confirm = await Swal.fire({
            title: `Mark cheque as ${newStatus}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#0a1d37',
            cancelButtonColor: '#aaa',
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/cheques/update-status/${chequeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus })
            });

            const result = await res.json();

            if (res.ok && result.success) {
                Swal.fire("Updated!", `Cheque marked as ${newStatus}`, "success");
                fetchCheques(); // Refresh list
            } else {
                Swal.fire("Failed", result.message || "Could not update status", "error");
            }
        } catch (err) {
            console.error("Error updating cheque:", err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    return (
        <div className="p-3">
            <h5>Received Cheques</h5>
            <Table bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Cheque No</th>
                    <th>Bank</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cheques.length > 0 ? (
                    cheques.map((cheque, index) => (
                        <tr key={cheque.id}>
                            <td>{index + 1}</td>
                            <td>{cheque.orID}</td>
                            <td>{cheque.amount}</td>
                            <td>{cheque.chequeNumber}</td>
                            <td>{cheque.bank}-{cheque.branch}</td>
                            <td>{cheque.customerName}</td>
                            <td>{new Date(cheque.date).toLocaleDateString()}</td>
                            <td>
                                <Badge color={
                                    cheque.status === "received"
                                        ? "info"
                                        : cheque.status === "cashed"
                                            ? "success"
                                            : "danger"
                                }>
                                    {cheque.status}
                                </Badge>
                            </td>
                            <td>
                                {cheque.status === "received" && (
                                    <>
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() => updateChequeStatus(cheque.id, "cashed")}
                                        >
                                            Cash In
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            color="danger"
                                            onClick={() => updateChequeStatus(cheque.id, "returned")}
                                        >
                                            Return
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center">No received cheques found.</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default ReceivedCheques;

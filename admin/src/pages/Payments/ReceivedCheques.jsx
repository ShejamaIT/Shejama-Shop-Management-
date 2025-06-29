import React, { useEffect, useState } from "react";
import {
    Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input
} from "reactstrap";
import Swal from "sweetalert2";

const ReceivedCheques = () => {
    const [cheques, setCheques] = useState([]);
    const [showHandoverModal, setShowHandoverModal] = useState(false);
    const [handoverData, setHandoverData] = useState({
        chequeId: null,
        chequeNumber: '',
        givenName: '',
        givenDate: '',
        purpose: ''
    });

    const fetchCheques = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/cheques/received");
            const data = await response.json();
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

    const updateChequeStatus = async (chequeId, newStatus, extraData = {}) => {
        const confirm = await Swal.fire({
            title: `Mark cheque as ${newStatus}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#0a1d37',
            cancelButtonColor: '#aaa',
        });

        if (!confirm.isConfirmed) return;
        console.log(JSON.stringify({ status: newStatus, ...extraData }));

        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/cheques/update-status/${chequeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus, ...extraData })
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

    const handleHandoverSubmit = async () => {
        const { chequeId, givenName, givenDate, purpose } = handoverData;

        if (!givenName || !givenDate || !purpose) {
            return Swal.fire("Validation", "All fields are required", "warning");
        }

        await updateChequeStatus(chequeId, "handover", { givenName, givenDate, purpose });
        setShowHandoverModal(false);
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
                    <th>Actions / Info</th>
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
                                {cheque.status === "received" ? (
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
                                        </Button>{" "}
                                        <Button
                                            size="sm"
                                            color="info"
                                            onClick={() => {
                                                setHandoverData({
                                                    chequeId: cheque.id,
                                                    chequeNumber: cheque.chequeNumber,
                                                    givenName: '',
                                                    givenDate: '',
                                                    purpose: ''
                                                });
                                                setShowHandoverModal(true);
                                            }}
                                        >
                                            Handover
                                        </Button>
                                    </>
                                ) : cheque.status === "handover" ? (
                                    <div style={{ fontSize: "0.85rem" }}>
                                        <strong>Given To:</strong> {cheque.givenName}<br />
                                        <strong>Date:</strong> {new Date(cheque.givenDate).toLocaleDateString()}<br />
                                        <strong>Purpose:</strong> {cheque.purpose}
                                    </div>
                                ) : (
                                    <span className="text-muted text-capitalize">{cheque.status}</span>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center">No received cheques found.</td>
                    </tr>
                )}
                </tbody>
            </Table>

            {/* Handover Modal */}
            <Modal isOpen={showHandoverModal} toggle={() => setShowHandoverModal(false)}>
                <ModalHeader toggle={() => setShowHandoverModal(false)}>
                    Handover Cheque
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Cheque Number</Label>
                            <Input type="text" value={handoverData.chequeNumber} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label>Given To (Name)</Label>
                            <Input
                                type="text"
                                name="givenName"
                                value={handoverData.givenName}
                                onChange={(e) => setHandoverData({ ...handoverData, givenName: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Given Date</Label>
                            <Input
                                type="date"
                                name="givenDate"
                                value={handoverData.givenDate}
                                onChange={(e) => setHandoverData({ ...handoverData, givenDate: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Purpose</Label>
                            <Input
                                type="textarea"
                                name="purpose"
                                value={handoverData.purpose}
                                onChange={(e) => setHandoverData({ ...handoverData, purpose: e.target.value })}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleHandoverSubmit}>
                        Submit
                    </Button>
                    <Button color="secondary" onClick={() => setShowHandoverModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default ReceivedCheques;

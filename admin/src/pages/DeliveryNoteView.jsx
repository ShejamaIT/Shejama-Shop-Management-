import React from "react";
import "../style/deliveryRecipt.css";

const DeliveryNoteView = ({ receiptData, setShowDeliveryView }) => {
    const { orders, vehicleId, driverName, hire, balanceToCollect, selectedDeliveryDate } = receiptData;
    const currentDateTime = new Date().toLocaleString();
    const Dhire = Number(hire || 0);

    const handlePrint = () => {
        const printWindow = window.open('', '_blank', 'width=400,height=600');

        if (printWindow) {
            const formattedOrders = orders.map(order => `
                <tr>
                    <td>${order.orderId}</td>
                    <td>Rs. ${order.total.toFixed(2)}</td>
                    <td>Rs. ${order.advance.toFixed(2)}</td>
                    <td>Rs. ${order.balance.toFixed(2)}</td>
                </tr>
            `).join("");

            const customerDetails = orders.map(order => `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.customerName}</td>
                    <td>${order.address}</td>
                    <td>${order.contact1}</td>
                    <td>${order.contact2}</td>
                </tr>
            `).join("");

            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Delivery Note</title>
                        <style>
                            @media print {
                                body {
                                    width: 80mm;
                                    margin: 0;
                                    font-family: monospace;
                                    font-size: 11px;
                                    color: #000;
                                }
                                h4, h5 {
                                    text-align: center;
                                    margin: 2px 0;
                                }
                                p {
                                    margin: 2px 0;
                                }
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin: 6px 0;
                                }
                                th, td {
                                    border: 1px dashed #000;
                                    padding: 4px;
                                    text-align: center;
                                }
                                hr {
                                    border: none;
                                    border-top: 1px dashed #000;
                                    margin: 6px 0;
                                }
                                .footer-note {
                                    text-align: center;
                                    margin-top: 10px;
                                    font-size: 10px;
                                }
                            }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        <h4>Shejama Groups</h4>
                        <h5>No.75, Sri Premarathana Mw, Moratumulla</h5>
                        <h5>071 3 608 108 / 077 3 608 108</h5>
                        <hr />

                        <p><strong>Date:</strong> ${selectedDeliveryDate || currentDateTime}</p>
                        <p><strong>Vehicle ID:</strong> ${vehicleId}</p>
                        <p><strong>Driver:</strong> ${driverName}</p>
                        <p><strong>Hire:</strong> Rs. ${Dhire.toFixed(2)}</p>

                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Total</th>
                                    <th>Advance</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${formattedOrders}
                            </tbody>
                        </table>

                        <p><strong>Total Balance to Collect:</strong> Rs. ${balanceToCollect.toFixed(2)}</p>

                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Contact 1</th>
                                    <th>Contact 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customerDetails}
                            </tbody>
                        </table>

                        <div class="footer-note">
                            <p>Thank you for your trust!</p>
                            <p>--- Shejama Group ---</p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const handleClose = () => {
        setShowDeliveryView(false);
        setTimeout(() => window.location.reload(), 500);
    };

    return (
        <div className="modal-overlay">
            <div className="receipt-modal">
                <h4 className="text-center">Preview Delivery Note</h4>
                <div className="modal-buttons">
                    <button onClick={handlePrint} className="print-btn">Print</button>
                    <button onClick={handleClose} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryNoteView;

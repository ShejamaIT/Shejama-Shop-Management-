import React, { useRef } from "react";
import "../style/receiptView.css";

const ReceiptView = ({ receiptData, setShowReceiptView }) => {
    const currentDateTime = new Date().toLocaleString();
    const receiptRef = useRef(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    const printReceipt = () => {
        const printContent = receiptRef.current.innerHTML;
        const printWindow = window.open('', '_blank', 'width=400,height=600');

        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Receipt - ${receiptData.orID}</title>
                        <style>
                            @media print {
                                body {
                                    width: 80mm;
                                    margin: 0;
                                    font-family: monospace;
                                    font-size: 15px; /* Increased from 11px */
                                    color: #000;
                                }

                                h3, h5 {
                                    text-align: center;
                                    margin: 2px 0;
                                    font-size: 17px; /* Increased */
                                }

                                p {
                                    margin: 2px 0;
                                    font-size: 15px; /* Increased */
                                }

                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-top: 8px;
                                    font-size: 15px; /* Increased */
                                }

                                th, td {
                                    border: 1px dashed #000;
                                    padding: 6px; /* Slightly increased padding */
                                    text-align: center;
                                }

                                th {
                                    background-color: #f0f0f0;
                                }

                                .receipt-summary {
                                    margin-top: 8px;
                                    border-top: 1px dashed #000;
                                    padding-top: 8px;
                                    font-size: 15px; /* Increased */
                                }

                                hr {
                                    border: none;
                                    border-top: 1px dashed #000;
                                    margin: 6px 0;
                                }

                                .footer-note {
                                    text-align: center;
                                    margin-top: 10px;
                                    font-size: 13px; /* Increased */
                                }
                            }
                        </style>
                    </head>
                    <body onload="window.print(); window.close();">
                        ${printContent}
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <div className="modal-overlay">
            <div
                className="receipt-modal"
                ref={receiptRef}
                style={{ fontSize: "15px", fontFamily: "monospace" }} // Increased font size for on-screen
            >
                <h3 style={{ fontSize: "19px" }}>Shejama Group</h3>
                <h5 style={{ fontSize: "17px" }}>No.75, Sri Premarathana Mw, Moratumulla</h5>
                <h5 style={{ fontSize: "17px" }}>071 3 608 108 / 077 3 608 108</h5>
                <hr />

                <p><strong>Order ID:</strong> #{receiptData.orID}</p>
                <p><strong>Order Date:</strong> {formatDate(receiptData.orderDate)}</p>
                <p><strong>Print Date:</strong> {currentDateTime}</p>
                <p><strong>Salesperson:</strong> {receiptData.salesperson}</p>
                <p><strong>Delivery:</strong> {receiptData.delStatus}</p>
                <p><strong>Payment:</strong> {receiptData.balance === 0 ? "Settled" : receiptData.payStatus}</p>

                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Discount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receiptData.items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>Rs. {item.unitPrice.toFixed(2)}</td>
                                <td>Rs. {item.discount.toFixed(2)}</td>
                                <td>Rs. {(item.quantity * (item.unitPrice - item.discount)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="receipt-summary">
                    <p><strong>Net Total:</strong> Rs. {receiptData.total.toFixed(2)}</p>
                    <p><strong>Discount:</strong> Rs. {receiptData.discount.toFixed(2)}</p>
                    <p><strong>Delivery Price:</strong> Rs. {receiptData.delPrice.toFixed(2)}</p>
                    <p><strong>Advance:</strong> Rs. {receiptData.advance.toFixed(2)}</p>
                    <p><strong>Balance:</strong> Rs. {receiptData.balance.toFixed(2)}</p>
                </div>

                <div className="footer-note" style={{ fontSize: "13px" }}>
                    <p>Thank you for your business!</p>
                    <p>--- Shejama Group ---</p>
                </div>
            </div>

            <div className="modal-buttons">
                <button onClick={printReceipt} className="print-btn">Print</button>
                <button onClick={() => setShowReceiptView(false)} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default ReceiptView;

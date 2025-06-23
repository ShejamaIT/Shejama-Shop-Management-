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
                                    font-size: 15px;
                                    color: #000;
                                }

                                h3, h5 {
                                    text-align: center;
                                    margin: 2px 0;
                                    font-size: 17px;
                                }

                                h3.underline {
                                    border-bottom: 1px solid #000;
                                    padding-bottom: 3px;
                                    margin-bottom: 6px;
                                }

                                p {
                                    margin: 2px 0;
                                    font-size: 15px;
                                }

                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin-top: 8px;
                                    font-size: 15px;
                                }

                                th {
                                    background-color: #f0f0f0;
                                }

                                th, td {
                                    border: 1px dashed #000;
                                    padding: 6px;
                                    text-align: center;
                                }

                                .receipt-summary {
                                    margin-top: 8px;
                                    border-top: 1px dashed #000;
                                    padding-top: 8px;
                                    font-size: 15px;
                                }

                                .receipt-summary p {
                                    display: flex;
                                    justify-content: space-between;
                                    font-size: 11px !important;
                                    margin: 2px 0 !important;
                                }

                                hr {
                                    border: none;
                                    border-top: 1px dashed #000;
                                    margin: 6px 0;
                                }

                                .footer-note {
                                    text-align: center;
                                    margin-top: 10px;
                                    font-size: 13px;
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
            <div className="receipt-modal" ref={receiptRef} style={{ fontSize: "15px", fontFamily: "monospace" }}>
                <h3 className="underline" style={{ fontSize: "19px" }}>Cash Receipt</h3>
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
                                <td className="text-left">{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>Rs. {item.unitPrice.toFixed(2)}</td>
                                <td>Rs. {item.discount.toFixed(2)}</td>
                                <td>Rs. {(item.quantity * (item.unitPrice - item.discount)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="receipt-summary">
                    <p><span><strong>Gross Total:</strong></span><span>Rs. {receiptData.subtotal.toFixed(2)}</span></p>
                    <p><span><strong>Delivery Price:</strong></span><span>Rs. {receiptData.delPrice.toFixed(2)}</span></p>
                    <p><span><strong>Special Discount:</strong></span><span>Rs. {receiptData.discount.toFixed(2)}</span></p>
                    <p><span><strong>Net Total:</strong></span><span>Rs. {receiptData.total.toFixed(2)}</span></p>
                    <p><span><strong>Advance:</strong></span><span>Rs. {receiptData.advance.toFixed(2)}</span></p>
                    <p><span><strong>Balance:</strong></span><span>Rs. {receiptData.balance.toFixed(2)}</span></p>
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

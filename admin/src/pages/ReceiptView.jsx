import React, { useRef } from "react";
import "../style/receiptView.css";

const ReceiptView = ({ receiptData, setShowReceiptView }) => {
    const currentDateTime = new Date().toLocaleString();
    const receiptRef = useRef(null);
    const fullInvoiceRef = useRef(null);
    console.log(receiptData);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    const getHeading = () => {
        console.log(receiptData);
        return receiptData.balance === 0 ? "Cash Bill" : "Invoice";
    };


    const printContentInWindow = (content, styles, title = "Print") => {
        const printWindow = window.open('', '_blank', 'width=800,height=1000');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${title}</title>
                        <style>${styles}</style>
                    </head>
                    <body onload="window.print(); window.close();">
                        ${content}
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const printReceiptView = () => {
        const styles = `
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
        `;
        printContentInWindow(receiptRef.current.innerHTML, styles, `Receipt - ${receiptData.orID}`);
    };

    const printFullInvoice = () => {
        const styles = `
            @media print {
                body {
                    margin: 30px;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    color: #333;
                }
                h2 {
                    color: #007bff;
                    text-align: center;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 15px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #999;
                    padding: 8px;
                    text-align: left;
                }
                .totals {
                    margin-top: 15px;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                }
                .totals p {
                    display: flex;
                    justify-content: space-between;
                }
                .footer-note {
                    margin-top: 20px;
                    text-align: center;
                    font-style: italic;
                    color: #666;
                }
            }
        `;
        printContentInWindow(fullInvoiceRef.current.innerHTML, styles, `Invoice - ${receiptData.orID}`);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* 🧾 Receipt View (POS style) */}
                <div
                    className="receipt-modal"
                    ref={receiptRef}
                    style={{ fontSize: "15px", fontFamily: "monospace" }}
                >
                    <h3 className="underline" style={{ fontSize: "19px" }}>{getHeading()}</h3>
                    <h3 style={{ fontSize: "19px" }}>Shejama Group</h3>
                    <h5 style={{ fontSize: "17px" }}>No.75, Sri Premarathana Mw, Moratumulla</h5>
                    <h5 style={{ fontSize: "17px" }}>071 3 608 108 / 077 3 608 108</h5>
                    <hr />

                    <p><strong>Order ID:</strong> #{receiptData.orID}</p>
                    <p><strong>Customer Name: </strong>{receiptData.customerName}</p>
                    <p><strong>Contact Number: </strong>{receiptData.contact1}</p>
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
                        <p><span><strong>Gross Total:</strong></span><span>Rs. {receiptData.subtotal.toFixed(2)}</span></p>
                        <p><span><strong>Delivery Price:</strong></span><span>Rs. {receiptData.delPrice.toFixed(2)}</span></p>
                        <p><span><strong>Special Discount:</strong></span><span>Rs. {receiptData.discount.toFixed(2)}</span></p>
                        <p><span><strong>Net Total:</strong></span><span>Rs. {receiptData.total.toFixed(2)}</span></p>
                        <p><span><strong>Advance:</strong></span><span>Rs. {receiptData.advance.toFixed(2)}</span></p>
                        <p><span><strong>Balance:</strong></span><span>Rs. {receiptData.balance.toFixed(2)}</span></p>
                    </div>

                    <div className="footer-note">
                        <p>Thank you for your business!</p>
                        <p>--- Shejama Group ---</p>
                    </div>
                </div>

                {/* 🎨 Full Invoice View (Hidden for printing) */}
                <div ref={fullInvoiceRef} style={{ display: "none" }}>
                    <div className="invoice-header">
                        <h2>{getHeading()}</h2>
                        <p><strong>Shejama Group</strong><br />
                            No.75, Sri Premarathana Mw, Moratumulla<br />
                            071 3 608 108 / 077 3 608 108</p>
                        <p><strong>Order ID:</strong> #{receiptData.orID}</p>
                        <p><strong>Customer:</strong> {receiptData.customerName}</p>
                        <p><strong>Phone:</strong> {receiptData.contact1}{receiptData.contact2 ? ` / ${receiptData.contact2}` : ""}</p>
                        <p><strong>Address:</strong> {receiptData.address}</p>
                        <p><strong>Date:</strong> {formatDate(receiptData.orderDate)}</p>
                        <p><strong>Salesperson:</strong> {receiptData.salesperson}</p>
                        <p><strong>Delivery:</strong> {receiptData.delStatus}</p>
                        <p><strong>Payment:</strong> {receiptData.balance === 0 ? "Settled" : receiptData.payStatus}</p>
                    </div>

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

                    <div className="totals">
                        <p><strong>Gross Total:</strong> Rs. {receiptData.subtotal.toFixed(2)}</p>
                        <p><strong>Delivery Price:</strong> Rs. {receiptData.delPrice.toFixed(2)}</p>
                        <p><strong>Special Discount:</strong> Rs. {receiptData.discount.toFixed(2)}</p>
                        <p><strong>Net Total:</strong> Rs. {receiptData.total.toFixed(2)}</p>
                        <p><strong>Advance:</strong> Rs. {receiptData.advance.toFixed(2)}</p>
                        <p><strong>Balance:</strong> Rs. {receiptData.balance.toFixed(2)}</p>
                    </div>

                    <div className="footer-note">
                        <p>Thank you for your business!</p>
                        <p>--- Shejama Group ---</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="modal-buttons">
                    <button onClick={printReceiptView} className="print-btn">Print Receipt View</button>
                    <button onClick={printFullInvoice} className="print-btn">Print Full Invoice</button>
                    <button onClick={() => setShowReceiptView(false)} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptView;

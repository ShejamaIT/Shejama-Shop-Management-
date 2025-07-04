import React, { useRef } from "react";
import "../style/deliveryRecipt.css";

const DeliveryNoteView = ({ receiptData, setShowDeliveryView }) => {
    const {
        order: orders,
        vehicleId,
        driverName,
        hire,
        balanceToCollect,
        selectedDeliveryDate,
    } = receiptData;

    const receiptRef = useRef(null);
    const Dhire = Number(hire || 0);
    const currentDateTime = new Date().toLocaleString();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const printDeliveryNote = () => {
        if (!receiptRef.current) return;

        const printContent = receiptRef.current.innerHTML;
        const printWindow = window.open("", "_blank", "width=400,height=600");

        if (printWindow) {
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
                          font-size: 15px;
                          color: #000;
                        }
                        h3 {
                          text-align: center;
                          margin: 4px 0;
                          font-size: 17px;
                          border-bottom: 1px solid #000;
                          padding-bottom: 4px;
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
                        .balance-row {
                          display: flex;
                          justify-content: space-between;
                          margin: 4px 0;
                          font-size: 15px;
                        }
                        hr {
                          border: none;
                          border-top: 1px dashed #000;
                          margin: 6px 0;
                        }
                        .footer-note {
                          text-align: center;
                          font-size: 13px;
                          margin-top: 10px;
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

    const handleClose = () => {
        setShowDeliveryView(false);
        setTimeout(() => window.location.reload(), 500);
    };

    return (
        <div className="modal-overlay">
            <div className="receipt-modal" ref={receiptRef}>
                <h3>Shejama Group - Delivery Note</h3>
                <hr />
                <p><strong>Print Date & Time:</strong> {currentDateTime}</p>

                <div className="info-row">
                    <p><strong>Delivery Date:</strong> {formatDate(selectedDeliveryDate)}</p>
                    <p><strong>Vehicle ID:</strong> {vehicleId}</p>
                </div>
                <div className="info-row">
                    <p><strong>Driver Name:</strong> {driverName}</p>
                    <p><strong>Hire:</strong> Rs. {Dhire.toFixed(2)}</p>
                </div>

                {/* Order summary table */}
                <h4>Order Summary</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx) => (
                            <tr key={idx}>
                                <td>{order.orderId}</td>
                                <td>{order.customerName}</td>
                                
                                <td>Rs. {Number(order.balance).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                  <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Address</th>
                            <th>Contact 1</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx) => (
                            <tr key={idx}>
                                <td>{order.orderId}</td>
                               <td>{order.address}</td>
                                <td>{order.contact1 / order.contact2}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Items table */}
                <h4>Stock Details</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Item ID</th>
                            <th>Stock ID</th>
                            <th>Batch ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.flatMap((order, idx) =>
                            (order.selectedItem || []).map((item, itemIdx) => (
                                <tr key={`${idx}-${itemIdx}`}>
                                    <td>{order.orderId}</td>
                                    <td>{item.I_Id}</td>
                                    <td>{item.stock_Id}</td>
                                    <td>{item.pc_Id}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="balance-row">
                    <strong>Total Balance to Collect:</strong>
                    <span>Rs. {Number(balanceToCollect).toFixed(2)}</span>
                </div>

                <div className="footer-note">
                    <p>Thank you for your trust!</p>
                    <p>--- Shejama Group ---</p>
                </div>
            </div>

            <div className="modal-buttons no-print">
                <button onClick={printDeliveryNote} className="print-btn">Print</button>
                <button onClick={handleClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default DeliveryNoteView;

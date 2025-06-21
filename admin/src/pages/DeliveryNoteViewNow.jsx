import React, { useRef } from "react";
import "../style/deliveryRecipt.css";

const DeliveryNoteViewNow = ({ receiptData, setShowDeliveryView }) => {
  const {
    order,
    vehicleId,
    driverName,
    hire,
    balanceToCollect,
    selectedDeliveryDate,
  } = receiptData;

  const receiptRef = useRef(null);
  const Dhire = Number(hire);
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
            <title>Delivery Note - ${order.orderId}</title>
            <style>
              @media print {
                body {
                  width: 80mm;
                  margin: 0;
                  font-family: monospace;
                  font-size: 15px;
                  color: #000;
                }
                h3, h4, h5 {
                  text-align: center;
                  margin: 4px 0;
                  font-weight: bold;
                  font-size: 17px;
                }
                p, table {
                  font-size: 15px;
                  margin: 4px 0;
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
                th {
                  background-color: #f0f0f0;
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
              .no-print {
                display: none;
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
  };

  return (
    <div className="modal-overlay">
      <div
        className="receipt-modal"
        ref={receiptRef}
        style={{ fontSize: "15px", fontFamily: "monospace" }}
      >
        <h3 style={{ fontSize: "19px" }}>Shejama Group</h3>
        <h5 style={{ fontSize: "17px" }}>No.75, Sri Premarathana Mw, Moratumulla</h5>
        <h5 style={{ fontSize: "17px" }}>071 3 608 108 / 077 3 608 108</h5>
        <hr />

        <p><strong>Date:</strong> {formatDate(selectedDeliveryDate) || currentDateTime}</p>
        <p><strong>Vehicle ID:</strong> {vehicleId}</p>
        <p><strong>Driver Name:</strong> {driverName}</p>
        <p><strong>Hire:</strong> Rs. {Dhire.toFixed(2)}</p>
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p><strong>Customer:</strong> {order.customerName}</p>

        {/* Table for Selected Items */}
        <table>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Stock ID</th>
              <th>Batch ID</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(order.selectedItem) && order.selectedItem.map((item, idx) => (
              <tr key={idx}>
                <td>{item.I_Id}</td>
                <td>{item.stock_Id}</td>
                <td>{item.pc_Id}</td>
                <td>Rs. {Number(item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <table style={{ marginTop: "12px" }}>
          <thead>
            <tr>
              <th>Total</th>
              <th>Advance</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rs. {order.total.toFixed(2)}</td>
              <td>Rs. {order.advance.toFixed(2)}</td>
              <td>Rs. {order.balance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table> */}

        <p style={{ marginTop: "13px" }}>
          <strong>Balance to Collect:</strong> Rs. {balanceToCollect.toFixed(2)}
        </p>

        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Contact 1</th>
              <th>Contact 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{order.address}</td>
              <td>{order.contact1}</td>
              <td>{order.contact2}</td>
            </tr>
          </tbody>
        </table>

        <div className="footer-note" style={{ fontSize: "13px" }}>
          <p>Thank you for your business!</p>
          <p>--- Shejama Group ---</p>
        </div>
      </div>

      <div className="modal-buttons no-print" style={{ marginTop: "13px" }}>
        <button onClick={printDeliveryNote} className="print-btn">Print</button>
        <button onClick={handleClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default DeliveryNoteViewNow;

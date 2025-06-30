import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function ExportModal({ data, onClose, title = "Export Data" }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("csv");
  const [showPopup, setShowPopup] = useState(false);

  const filterByDate = () => {
    if (!startDate || !endDate) return data;
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  };

  const handleExport = () => {
    const filtered = filterByDate();

    if (filtered.length === 0) {
      alert("No data to export.");
      return;
    }

    if (format === "csv") {
      const ws = XLSX.utils.json_to_sheet(filtered);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${title.replace(" ", "_")}.xlsx`);
    } else if (format === "print") {
      const html = `
        <h3>${title}</h3>
        <table border="1" cellspacing="0" cellpadding="4">
          <thead>
            <tr>${Object.keys(filtered[0]).map((h) => `<th>${h}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${filtered.map((row) => `<tr>${Object.values(row).map((val) => `<td>${val}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      `;
      const win = window.open("", "", "width=800,height=600");
      win.document.write(html);
      win.document.close();
      win.print();
    }

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      onClose();
    }, 500);
  };

  return (
    <>
      <div style={backdropStyle}>
        <div className="modal-content bg-white p-4 rounded shadow" style={{ maxWidth: "500px", width: "100%" }}>
          <h5 className="mb-3">{title}</h5>

          <div className="mb-2">
            <label className="form-label">From Date</label>
            <input type="date" className="form-control" onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="mb-2">
            <label className="form-label">To Date</label>
            <input type="date" className="form-control" onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Export Format</label>
            <select className="form-select" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="csv">.XLSX (Excel)</option>
              <option value="print">Print</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleExport}>Export</button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div style={popupBackdropStyle}>
          <div style={popupBoxStyle}>
            <h5 className="text-success">Success</h5>
            <p>Data exported successfully.</p>
          </div>
        </div>
      )}
    </>
  );
}

const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const popupBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1050,
};

const popupBoxStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  textAlign: "center",
  maxWidth: "400px",
  width: "90%",
};

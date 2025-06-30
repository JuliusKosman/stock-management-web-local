import React, { useState } from "react";
import axios from "axios";

export default function AddStockInModal({ onClose, onSave, products }) {
  const [selectedID, setSelectedID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  

  const handleSave = async () => {
    setError("");

    if (!selectedID || quantity === "") {
      setError("All fields are required.");
      return;
    }

    const productID = parseInt(selectedID);
    const amount = parseInt(quantity);

    if (isNaN(productID) || isNaN(amount) || amount <= 0) {
      setError("Invalid product or quantity.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/transaksi/in",
        { product_id: productID, jumlah: amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        onSave();
        onClose();
      }, 500);
    } catch (err) {
      console.error("Failed to save stock-in:", err);
      setError("Failed to save entry. Please check your input or connection.");
    }
  };

  return (
    <div style={backdropStyle}>
      <div className="modal-content bg-white p-4 rounded shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <h5 className="mb-3">Add Stock In</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <select
          className="form-select mb-3"
          value={selectedID}
          onChange={(e) => setSelectedID(e.target.value)}
        >
          <option value="">Select a Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.kode_barang} - {p.nama_barang}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="form-control mb-4"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Add Stock In
          </button>
        </div>
      </div>

      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1050
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            textAlign: "center",
            maxWidth: "400px",
            width: "90%"
          }}>
            <h5 className="text-success">Success</h5>
            <p>Stock-in entry saved successfully.</p>
          </div>
        </div>
      )}
    </div>
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

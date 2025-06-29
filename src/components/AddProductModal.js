import React, { useState } from "react";
import axios from "axios";

export default function AddProductModal({ onClose, onSave }) {
  const [productName, setProductName] = useState("");
  const [productID, setProductID] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSave = async () => {
    if (!productID || !productName || quantity === "") {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/products",
        {
          kode_barang: productID.trim(),
          nama_barang: productName.trim(),
          jumlah: parseInt(quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSave({
        id: res.data.id,
        name: res.data.nama_barang,
        quantity: res.data.jumlah,
      });
      onClose();
    } catch (err) {
      console.error("Gagal menambahkan produk:", err);
      alert("Gagal menambahkan produk. Periksa input atau koneksi server.");
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h4 className="mb-3">Add New Product</h4>

        <div className="mb-2">
          <input
            className="form-control mb-2"
            placeholder="Product Code"
            value={productID}
            onChange={(e) => setProductID(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            className="form-control mb-3"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Add Product
          </button>
        </div>
      </div>
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

const modalStyle = {
  background: "#fff",
  borderRadius: "8px",
  padding: "24px",
  width: "100%",
  maxWidth: "400px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

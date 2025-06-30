import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaSave, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

export default function ProductDetailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(() => {
    return state || { id: "", kode_barang: "", name: "", quantity: 0 };
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage("");
      navigate(-1);
    }, 500);
  };

  const handleSave = async () => {
    try {
      const payload = {
        kode_barang: product.kode_barang,
        nama_barang: product.name,
        jumlah: parseInt(product.quantity),
      };

      await axios.put(`http://localhost:3000/api/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      showPopup("Product successfully updated!");
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to save changes.");
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setShowConfirmDelete(false);
      showPopup("Product successfully deleted!");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  };

  if (!state) {
    return (
      <div className="container py-4">
        <p className="text-danger">Product not found. Please return to the Dashboard.</p>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaBoxOpen /> Edit Product
      </h2>

      <div className="card shadow-sm" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Product Code</label>
            <input
              type="text"
              className="form-control"
              name="kode_barang"
              value={product.kode_barang}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleSave}>
              <FaSave /> Save Changes
            </button>
            <button className="btn btn-danger d-flex align-items-center gap-2" onClick={() => setShowConfirmDelete(true)}>
              <FaTrashAlt /> Delete Product
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Pop-up */}
      {popupMessage && (
        <div style={popupOverlayStyle}>
          <div style={popupBoxStyle}>
            <h5 className="text-success">Success</h5>
            <p>{popupMessage}</p>
          </div>
        </div>
      )}

      {/* Confirm Delete Pop-up */}
      {showConfirmDelete && (
        <div style={popupOverlayStyle}>
          <div style={popupBoxStyle}>
            <h5 className="text-danger">Delete Confirmation</h5>
            <p>Are you sure you want to delete this product?</p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirmed}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const popupOverlayStyle = {
  position: "fixed",
  top: 0, left: 0,
  width: "100%", height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1050
};

const popupBoxStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  textAlign: "center",
  maxWidth: "400px",
  width: "90%"
};

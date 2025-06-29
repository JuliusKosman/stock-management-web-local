import React, { useState, useEffect } from "react";
import axios from "axios";
import AddProductModal from "../components/AddProductModal";
import { useNavigate } from "react-router-dom";
import { FaBell, FaBoxes, FaPlusCircle, FaSearch } from "react-icons/fa";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const arr = res.data.map((p) => ({
        id: p.id,
        kode_barang: p.kode_barang,
        name: p.nama_barang,
        quantity: p.jumlah,
      }));
      setProducts(arr);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      alert("Failed to fetch products. Please login and start the server.");
    }
  };

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]); // Newest on top
    setShowModal(false);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  const sortFunctions = {
    "a-z": (a, b) => a.name.localeCompare(b.name),
    "z-a": (a, b) => b.name.localeCompare(a.name),
    "qty-asc": (a, b) => a.quantity - b.quantity,
    "qty-desc": (a, b) => b.quantity - a.quantity,
    "newest": (a, b) => b.id - a.id,
    "oldest": (a, b) => a.id - b.id,
  };

  const sorted = [...products].sort(sortFunctions[sortOption] || sortFunctions["newest"]);

  const filtered = sorted.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const restockCount = products.filter(p => p.quantity <= 50).length;
  const overstockCount = products.filter(p => p.quantity > 500).length;

  return (
    <div className="container-fluid px-4 py-4">
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaBoxes /> Dashboard
      </h2>

      {/* Alerts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6" onClick={() => navigate("/restock-alert", { state: { products } })}>
          <div className="card border-warning text-warning h-100 cursor-pointer shadow-sm">
            <div className="card-body d-flex align-items-center gap-3">
              <FaBell size={28} />
              <div>
                <h5 className="card-title mb-1">Restock Alert</h5>
                <p className="card-text mb-0">{restockCount} products need restocking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6" onClick={() => navigate("/overstock-alert", { state: { products } })}>
          <div className="card border-info text-info h-100 cursor-pointer shadow-sm">
            <div className="card-body d-flex align-items-center gap-3">
              <FaBoxes size={28} />
              <div>
                <h5 className="card-title mb-1">Overstock Alert</h5>
                <p className="card-text mb-0">{overstockCount} products are overstocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text"><FaSearch /></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="mb-0">Sort by:</label>
          <select
            className="form-select"
            value={sortOption}
            onChange={e => { setSortOption(e.target.value); setPage(1); }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">Name A-Z</option>
            <option value="z-a">Name Z-A</option>
            <option value="qty-asc">Quantity ↑</option>
            <option value="qty-desc">Quantity ↓</option>
          </select>
        </div>

        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FaPlusCircle /> Add New Product
        </button>
      </div>

      {showModal && <AddProductModal onClose={() => setShowModal(false)} onSave={handleAddProduct} />}

      {/* Table */}
      <div className="card-body table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ width: "10%" }}>No.</th>
              <th style={{ width: "20%" }}>Product Code</th>
              <th style={{ width: "40%" }}>Product Name</th>
              <th style={{ width: "30%" }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p, i) => (
              <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/product-detail/${p.id}`, { state: p })}>
                <td>{(page - 1) * pageSize + i + 1}</td>
                <td>{p.kode_barang}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span className="align-self-center">Page {page} of {totalPages}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1050
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "2rem", borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)", textAlign: "center",
            maxWidth: "400px", width: "90%"
          }}>
            <h5 className="text-success">Success</h5>
            <p>Product added successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}

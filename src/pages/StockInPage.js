import React, { useState, useEffect } from "react";
import axios from "axios";
import AddStockInModal from "../components/AddStockInModal";
import ExportModal from "../components/ExportModal";
import { FaDownload, FaPlusCircle, FaSearch, FaSignInAlt } from "react-icons/fa";

export default function StockInPage() {
  const [stockInList, setStockInList] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
    fetchStockIn();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const fetchStockIn = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/transaksi/in", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const mapped = res.data.map(tx => ({
        date: tx.tanggal?.split("T")[0] || "-",
        kodeBarang: tx.product?.kode_barang || "N/A",
        productName: tx.product?.nama_barang || "Unknown",
        quantity: tx.jumlah
      }));
      setStockInList(
        mapped.sort((a, b) => new Date(b.date) - new Date(a.date))
      );

    } catch (err) {
      console.error("Failed to load stock-in data:", err);
    }
  };

  const handleAddStockIn = () => {
    fetchStockIn();
  };

  const handleExport = () => {
    fetchStockIn(); 
  };

  const filtered = stockInList.filter(item => {
  const matchName = item.productName.toLowerCase().includes(search.toLowerCase());
  const dateOk = (!dateFrom || item.date >= dateFrom) &&
                 (!dateTo || item.date <= dateTo);
  return matchName && dateOk;
});


  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container py-4">
      <h3 className="mb-4 d-flex align-items-center gap-2">
        <FaSignInAlt /> Stock In
      </h3>

      {/* Toolbar */}
<div className="mb-3 d-flex flex-wrap align-items-center gap-2">
  <button className="btn btn-success" onClick={() => setShowModal(true)}>
    <FaPlusCircle /> Add Stock In
  </button>
  <button className="btn btn-outline-primary" onClick={() => setShowExport(true)}>
    <FaDownload /> Export Data
  </button>
</div>

{/* Date Filter & Search */}
<div className="d-flex flex-wrap align-items-center gap-3 mb-4">
  <div className="d-flex align-items-center gap-2">
    <label htmlFor="fromDate" className="form-label mb-0">From:</label>
    <input type="date" id="fromDate" className="form-control" style={{ maxWidth: "180px" }}
      value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} />
  </div>
  <div className="d-flex align-items-center gap-2">
    <label htmlFor="toDate" className="form-label mb-0">To:</label>
    <input type="date" id="toDate" className="form-control" style={{ maxWidth: "180px" }}
      value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} />
  </div>
  <div className="input-group" style={{ maxWidth: "280px", marginLeft: "auto" }}>
    <span className="input-group-text"><FaSearch /></span>
    <input type="text" className="form-control" placeholder="Search product..." value={search}
      onChange={e => { setSearch(e.target.value); setPage(1); }} />
  </div>
</div>


      {/* Add / Export Modals */}
      {showModal && (
        <AddStockInModal
          products={products}
          onSave={() => { setShowModal(false); handleAddStockIn(); }}
          onClose={() => setShowModal(false)}
        />
      )}
      {showExport && (
        <ExportModal
          title="Export Stock In"
          data={filtered}
          onSave={() => { setShowExport(false); handleExport(); }}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body table-responsive">
          {filtered.length === 0 ? (
            <div className="alert alert-info mb-0">No stock-in records found.</div>
          ) : (
            <>
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item, i) => (
                    <tr key={i}>
                      <td>{item.date}</td>
                      <td>{item.kodeBarang}</td>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-2 gap-3">
                  <button className="btn btn-sm btn-outline-secondary" disabled={page === 1}
                          onClick={() => setPage(p => p - 1)}>Prev</button>
                  <span className="align-self-center">Page {page} of {totalPages}</span>
                  <button className="btn btn-sm btn-outline-secondary" disabled={page === totalPages}
                          onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

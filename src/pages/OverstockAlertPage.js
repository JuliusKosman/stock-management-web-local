import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaBoxes } from "react-icons/fa";

export default function OverstockAlertPage() {
  const location = useLocation();
  const allProducts = location.state?.products || [];
  const overstockList = allProducts.filter((p) => p.quantity > 500);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(overstockList.length / itemsPerPage);

  const paginatedData = overstockList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container py-4">
      <h3 className="mb-4 d-flex align-items-center gap-2 text-info">
        <FaBoxes /> Overstock Alert Products
      </h3>

      {overstockList.length === 0 ? (
        <div className="alert alert-success">
          No overstocked products.
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "8%" }}>No.</th>
                  <th style={{ width: "20%" }}>Product Code</th>
                  <th style={{ width: "42%" }}>Product Name</th>
                  <th style={{ width: "30%" }}>Current Stock</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((p, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{p.kode_barang}</td>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-3 mt-3">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="align-self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

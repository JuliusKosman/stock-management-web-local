import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import axios from "axios";

export default function RestockAlertPage() {
  const location = useLocation();
  const allProducts = location.state?.products || [];
  const restockList = allProducts.filter((p) => p.quantity <= 50);

  const [forecastData, setForecastData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/transaksi/forecast");
        setForecastData(res.data);
      } catch (err) {
        console.error("Failed to fetch forecast data:", err);
      }
    };

    fetchForecast();
  }, []);

  const totalPages = Math.ceil(restockList.length / itemsPerPage);
  const paginatedData = restockList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getForecastValue = (kode_barang) => {
    const found = forecastData.find(item => item.product_id === kode_barang);
    return found ? found.forecasted_restock : "-";
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 d-flex align-items-center gap-2 text-warning">
        <FaBell /> Restock Alert Products
      </h3>

      {restockList.length === 0 ? (
        <div className="alert alert-success">No products need restocking.</div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "8%" }}>No.</th>
                  <th style={{ width: "20%" }}>Product Code</th>
                  <th style={{ width: "20%" }}>Product Name</th>
                  <th style={{ width: "20%" }}>Current Stock</th>
                  <th style={{ width: "32%" }}>Predicted Stock (ARIMA)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((p, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{p.kode_barang}</td>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>{getForecastValue(p.kode_barang)}</td>
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

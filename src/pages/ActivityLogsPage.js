import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaClipboardList, FaSearch } from "react-icons/fa";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await axios.get("http://localhost:3000/api/transaksi/logs", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setLogs(res.data);
  };

  const filteredLogs = logs.filter(log => {
    const user = log.user?.username || "Unknown";
    const createdAt = new Date(log.createdAt);
    const matchName = user.toLowerCase().includes(search.toLowerCase());
    const matchDate =
      (!startDate || createdAt >= new Date(startDate)) &&
      (!endDate   || createdAt <= new Date(endDate));
    return matchName && matchDate;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container py-4">
      <h3 className="mb-4 d-flex align-items-center gap-2">
        <FaClipboardList /> Activity Logs
      </h3>

      {/* Filter Toolbar */}
      <div className="row g-3 mb-4 align-items-end">
        <div className="col-md-3">
          <label className="form-label fw-bold">From Date</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">To Date</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="col-md-4 ms-auto">
          <label className="form-label fw-bold">Search User</label>
          <div className="input-group">
            <span className="input-group-text"><FaSearch /></span>
            <input type="text" className="form-control" placeholder="Username..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="card shadow-sm">
        <div className="card-body table-responsive">
          {paginatedLogs.length === 0 ? (
            <div className="alert alert-info mb-0">No activity found.</div>
          ) : (
            <>
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.user?.username || "Unknown"}</td>
                      <td>{log.aksi}</td>
                      <td>{log.deskripsi}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3 gap-3">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Prev</button>
                  <span className="align-self-center">Page {page} of {totalPages}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

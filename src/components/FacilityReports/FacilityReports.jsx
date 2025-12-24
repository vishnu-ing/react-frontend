import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/auth.interceptor";
import { authService } from "../../api/authService";

const FacilityReportsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get userId from query params or logged-in user
  const userIdFromQuery = new URLSearchParams(location.search).get("userId");
  const loggedInUser = authService.getUser();
  const userId =
    userIdFromQuery ||
    loggedInUser?.userId ||
    loggedInUser?.id ||
    loggedInUser?._id;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get("/facility-reports");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.reports || [];
        setReports(data);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!reports || !Array.isArray(reports) || !reports.length)
    return <div>No facility reports available.</div>;

  // Filter reports to only those created by the logged-in user
  console.log("Logged-in userId:", userId);
  console.log("All facility reports:", reports);
  const filteredReports = reports.filter((report) => {
    // Support both string and object for createdBy/reportedBy
    const createdBy = report.createdBy || report.reportedBy;
    if (!createdBy || !userId) return false;
    if (typeof createdBy === "object") {
      return (
        createdBy.userId === userId ||
        createdBy.id === userId ||
        createdBy._id === userId
      );
    }
    return String(createdBy) === String(userId);
  });

  return (
    <div className="facility__container">
      <h2>Facility Reports</h2>
      <button
        style={{ marginBottom: 20 }}
        onClick={() => {
          navigate("/housing/me");
        }}
      >
        Back to Housing
      </button>
      <ul className="facility__reports">
        {filteredReports.map((report) => (
          <li key={report._id} className="facility__report">
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <p>
              <strong>Created By:</strong>{" "}
              {report.reportedBy?.userName || "Unknown User"}
            </p>
            <p>
              <strong>TimeStamp:</strong>{" "}
              {report.createdAt
                ? new Date(report.createdAt).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {report.status}
            </p>
            <button onClick={() => navigate(`/facility-reports/${report._id}`)}>
              View Comments
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacilityReportsPage;

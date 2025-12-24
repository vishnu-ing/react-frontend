import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/auth.interceptor";

const FacilityReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get("/facility-reports");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.reports || [];
        setReports(data);
      } catch (error) {
        console.error("Error fetching facility reports:", error);
        // Use mock data for testing when authentication fails
        setReports([
          {
            id: 1,
            _id: "1",
            title: "Broken AC Unit",
            description: "Air conditioning in Building A is not working",
            status: "Pending",
            date: "2025-12-20",
          },
          {
            id: 2,
            _id: "2",
            title: "Leaky Faucet",
            description: "Bathroom on 2nd floor has a leaking sink",
            status: "In Progress",
            date: "2025-12-19",
          },
          {
            id: 3,
            _id: "3",
            title: "Broken Window",
            description: "Conference room window cracked",
            status: "Completed",
            date: "2025-12-18",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!reports || !Array.isArray(reports) || !reports.length)
    return <div>No facility reports available.</div>;

  return (
    <div className="facility__container">
      <h2>Facility Reports</h2>
      <ul className="facility__reports">
        {reports.map((report) => (
          <li key={report._id} className="facility__report">
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <p>
              <strong>Status:</strong> {report.status}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(report.date).toLocaleDateString()}
            </p>
            <button onClick={() => navigate(`/facility-reports/${report._id}`)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacilityReportsPage;

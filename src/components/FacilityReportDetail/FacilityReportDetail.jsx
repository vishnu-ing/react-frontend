import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/auth.interceptor";

const FacilityReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/facility-reports/${reportId}`
        );
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching facility report details:", error);
        // Mock data for testing
        const mockReports = [
          {
            id: 1,
            _id: "1",
            title: "Broken AC Unit",
            description: "Air conditioning in Building A is not working",
            status: "Pending",
            date: "2025-12-20",
            location: "Building A, Room 301",
            reportedBy: "John Doe",
            priority: "High",
            notes:
              "Unit has been making unusual noises for the past week before completely stopping.",
          },
          {
            id: 2,
            _id: "2",
            title: "Leaky Faucet",
            description: "Bathroom on 2nd floor has a leaking sink",
            status: "In Progress",
            date: "2025-12-19",
            location: "Building B, 2nd Floor Bathroom",
            reportedBy: "Jane Smith",
            priority: "Medium",
            notes: "Water is dripping continuously, causing water waste.",
          },
          {
            id: 3,
            _id: "3",
            title: "Broken Window",
            description: "Conference room window cracked",
            status: "Completed",
            date: "2025-12-18",
            location: "Building C, Conference Room 1",
            reportedBy: "Mike Johnson",
            priority: "Low",
            notes: "Small crack in bottom left corner. Replaced on 2025-12-19.",
          },
        ];
        const foundReport = mockReports.find(
          (r) => r._id === reportId || r.id.toString() === reportId
        );
        setReport(foundReport || null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>Report not found.</div>;

  return (
    <div className="facility_report__detail">
      <button
        onClick={() => navigate("/facility-reports")}
        className="back-button"
      >
        ← Back to Reports
      </button>

      <div className="report_detail__container">
        <h1>{report.title}</h1>

        <div className="report_detail__section">
          <h3>Description</h3>
          <p>{report.description}</p>
        </div>

        <div className="report_detail__section">
          <h3>Status</h3>
          <p
            className={`status-badge status-${report.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {report.status}
          </p>
        </div>

        <div className="report_detail__section">
          <h3>Details</h3>
          <div className="report_detail__grid">
            <div className="report_detail__item">
              <strong>Date Reported:</strong>
              <span>{new Date(report.date).toLocaleDateString()}</span>
            </div>

            {report.location && (
              <div className="report_detail__item">
                <strong>Location:</strong>
                <span>{report.location}</span>
              </div>
            )}

            {report.reportedBy && (
              <div className="report_detail__item">
                <strong>Reported By:</strong>
                <span>{report.reportedBy}</span>
              </div>
            )}

            {report.priority && (
              <div className="report_detail__item">
                <strong>Priority:</strong>
                <span className={`priority-${report.priority.toLowerCase()}`}>
                  {report.priority}
                </span>
              </div>
            )}
          </div>
        </div>

        {report.notes && (
          <div className="report_detail__section">
            <h3>Additional Notes</h3>
            <p>{report.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityReportDetail;

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/auth.interceptor';
import { authService } from '../../api/authService';
import './FacilityReports.css';
import '../../pages/OnboardingApplication.css';
import { Paper, Button } from '@mui/material';

const FacilityReportsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get userId from query params or logged-in user
  const userIdFromQuery = new URLSearchParams(location.search).get('userId');
  const loggedInUser = authService.getUser();
  const userId =
    userIdFromQuery ||
    loggedInUser?.userId ||
    loggedInUser?.id ||
    loggedInUser?._id;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get('/facility-reports');
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

  if (loading) return <div className="facility__loading">Loading...</div>;
  if (!reports || !Array.isArray(reports) || !reports.length)
    return (
      <div className="facility__loading">No facility reports available.</div>
    );

  // Filter reports to only those created by the logged-in user
  const filteredReports = reports.filter((report) => {
    // Support both string and object for createdBy/reportedBy
    const createdBy = report.createdBy || report.reportedBy;
    if (!createdBy || !userId) return false;
    if (typeof createdBy === 'object') {
      return (
        createdBy.userId === userId ||
        createdBy.id === userId ||
        createdBy._id === userId
      );
    }
    return String(createdBy) === String(userId);
  });

  return (
    <div className="onboarding-container facility__container">
      <Paper elevation={3} className="onboarding-content facility__content">
        <Button
          variant="outlined"
          color="primary"
          className="facility__back-btn"
          onClick={() => navigate('/housing/me')}
        >
          Back to Housing
        </Button>
        <h2>Facility Reports</h2>
        <div className="facility__reports">
          {filteredReports.map((report) => (
            <Paper
              key={report._id}
              elevation={2}
              className="facility__report-card"
            >
              <h3 className="facility__report-title">{report.title}</h3>
              <p className="facility__report-desc">{report.description}</p>
              <p>
                <strong>Created By:</strong>{' '}
                {report.reportedBy?.userName || 'Unknown User'}
              </p>
              <p>
                <strong>TimeStamp:</strong>{' '}
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleString()
                  : 'N/A'}
              </p>
              <p>
                <strong>Status:</strong> {report.status}
              </p>
              <Button
                variant="contained"
                color="secondary"
                className="facility__comments-btn"
                onClick={() => navigate(`/facility-reports/${report._id}`)}
              >
                View Comments
              </Button>
            </Paper>
          ))}
        </div>
      </Paper>
    </div>
  );
};

export default FacilityReportsPage;

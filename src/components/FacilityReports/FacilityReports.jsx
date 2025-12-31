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
  const [page, setPage] = useState(1);
  const REPORTS_PER_PAGE = 3;

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
  const filteredReports = reports
    .filter((report) => {
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
    })
    .sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });
  const paginatedReports = filteredReports.slice(
    (page - 1) * REPORTS_PER_PAGE,
    page * REPORTS_PER_PAGE
  );

  return (
    <div className="onboarding-container facility__container">
      <Paper elevation={3} className="onboarding-content facility__content">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginTop: '-32px',
            marginLeft: '-32px',
            marginBottom: '8px',
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            className="facility__back-btn"
            onClick={() => navigate('/housing/me')}
            style={{ margin: 0, padding: '0px 2px', minWidth: 0 }}
          >
            Back to Housing
          </Button>
        </div>
        <h2>Facility Reports</h2>
        <div className="facility__reports">
          {paginatedReports.map((report) => (
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
                <strong>Last Updated:</strong>{' '}
                {report.updatedAt
                  ? new Date(report.updatedAt).toLocaleString()
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
        {filteredReports.length > REPORTS_PER_PAGE && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              margin: '24px 0 0 0',
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span style={{ alignSelf: 'center' }}>
              Page {page} of{' '}
              {Math.ceil(filteredReports.length / REPORTS_PER_PAGE)}
            </span>
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                setPage((p) =>
                  Math.min(
                    Math.ceil(filteredReports.length / REPORTS_PER_PAGE),
                    p + 1
                  )
                )
              }
              disabled={
                page === Math.ceil(filteredReports.length / REPORTS_PER_PAGE)
              }
            >
              Next
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default FacilityReportsPage;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/auth.interceptor';
import { authService } from '../../api/authService';
import './FacilityReportDetail.css';
import '../../pages/OnboardingApplication.css';
import { Paper, Button } from '@mui/material';

const FacilityReportDetail = () => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get(`/facility-reports/${reportId}`);
        setReport(res.data);
        // Fetch comments thread for this report
        const commentsRes = await axiosInstance.get(
          `/facility-reports/${reportId}/comments`
        );
        setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
      } catch (error) {
        console.error('Error fetching facility report details:', error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      const res = await axiosInstance.post(
        `/facility-reports/${reportId}/comments`,
        { description: commentInput }
      );
      setComments([...comments, res.data]);
      setCommentInput('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <div className="facility__loading">Loading...</div>;
  if (!report)
    return <div className="facility__loading">Report not found.</div>;

  return (
    <div className="onboarding-container facility-detail__container">
      <Paper
        elevation={3}
        className="onboarding-content facility-detail__content"
      >
        <Button
          variant="outlined"
          color="primary"
          className="facility-detail__back-btn"
          onClick={() => navigate('/facility-reports')}
        >
          ← Back to Reports
        </Button>
        <h2 className="facility-detail__title">{report.title}</h2>
        <div className="facility-detail__section">
          <h3>Description</h3>
          <p>{report.description}</p>
        </div>
        <div className="facility-detail__section">
          <h3>Status</h3>
          <span
            className={`status-badge status-${report.status
              .toLowerCase()
              .replace(' ', '-')}`}
          >
            {report.status}
          </span>
        </div>
        <div className="facility-detail__section">
          <h3>Comments</h3>
          <ul className="facility-detail__comments">
            {comments.length === 0 && (
              <li key="no-comments">No comments yet.</li>
            )}
            {comments.map((comment, idx) => (
              <li
                key={comment._id || comment.id || idx}
                className="facility-detail__comment"
              >
                <div>
                  <strong>Description:</strong> {comment.description}
                </div>
                <div>
                  <strong>Created By:</strong>{' '}
                  {authService.getUser()?.userName ||
                    authService.getUser()?.name ||
                    'User'}
                </div>
                <div>
                  <strong>Timestamp:</strong>{' '}
                  {comment.timestamp
                    ? new Date(comment.timestamp).toLocaleString()
                    : ''}
                </div>
              </li>
            ))}
          </ul>
          <form
            className="facility-detail__comment-form"
            onSubmit={handleAddComment}
          >
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              rows={3}
              placeholder="Add a comment..."
              disabled={commentLoading}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={commentLoading || !commentInput.trim()}
              className="facility-detail__comment-btn"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
};

export default FacilityReportDetail;

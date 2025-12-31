import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/auth.interceptor';
import { authService } from '../../api/authService';
import './FacilityReportDetail.css';
import '../../pages/OnboardingApplication.css';
import { Paper, Button } from '@mui/material';

const FacilityReportDetail = () => {
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const COMMENTS_PER_PAGE = 3;
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosInstance.get(`/facility-reports/${reportId}`);
        setReport(res.data);
        // Fetch comments thread for this report
        const commentsRes = await axiosInstance.get(
          `/facility-reports/${reportId}/comments`
        );
        const fetched = Array.isArray(commentsRes.data) ? commentsRes.data : [];
        fetched.sort((a, b) => {
          const ta = a?.timestamp ? Date.parse(a.timestamp) : 0;
          const tb = b?.timestamp ? Date.parse(b.timestamp) : 0;
          return tb - ta;
        });
        setComments(fetched);
      } catch (error) {
        console.error('Error fetching facility report details:', error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    // set current user email (try authService, then localStorage fallback)
    try {
      const userFromService =
        authService.getCurrentUser && authService.getCurrentUser();
      const userFromStorage = JSON.parse(
        localStorage.getItem('user') || 'null'
      );
      const email = userFromService?.email || userFromStorage?.email || '';
      setCurrentUserEmail(email);
    } catch (e) {
      setCurrentUserEmail('');
    }

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
      setComments((prev) => {
        const updated = [res.data, ...prev];
        updated.sort((a, b) => {
          const ta = a?.timestamp ? Date.parse(a.timestamp) : 0;
          const tb = b?.timestamp ? Date.parse(b.timestamp) : 0;
          return tb - ta;
        });
        return updated;
      });
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
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            marginTop: '-8px',
            marginLeft: '-8px',
            marginBottom: '8px',
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            className="facility-detail__back-btn"
            onClick={() => navigate('/facility-reports')}
            style={{ margin: 0, padding: '8px 16px', minWidth: 0 }}
          >
            ← Back to Reports
          </Button>
        </div>
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
            {comments
              .slice(
                (commentsPage - 1) * COMMENTS_PER_PAGE,
                commentsPage * COMMENTS_PER_PAGE
              )
              .map((comment, idx) => {
                const createdByEmail = (comment.createdBy?.email || '')
                  .trim()
                  .toLowerCase();
                const userEmail = (currentUserEmail || '').trim().toLowerCase();
                console.log(
                  'Comparing comment email ->',
                  createdByEmail,
                  'with current user ->',
                  userEmail
                );
                return (
                  <li
                    key={comment._id || comment.id || idx}
                    className="facility-detail__comment"
                  >
                    <div>
                      <strong>Description:</strong> {comment.description}
                    </div>
                    <div>
                      <strong>Created By:</strong>{' '}
                      {createdByEmail
                        ? userEmail
                          ? createdByEmail === userEmail
                            ? comment.createdBy?.firstName ||
                              comment.createdBy?.lastName
                              ? `${comment.createdBy?.firstName || ''} ${
                                  comment.createdBy?.lastName || ''
                                }`.trim()
                              : comment.createdBy?.userName || 'User'
                            : 'HR'
                          : // userEmail unknown, fall back to role when available
                          comment.createdBy?.role === 'HR'
                          ? 'HR'
                          : comment.createdBy?.firstName ||
                            comment.createdBy?.lastName
                          ? `${comment.createdBy?.firstName || ''} ${
                              comment.createdBy?.lastName || ''
                            }`.trim()
                          : comment.createdBy?.userName || 'User'
                        : comment.createdBy?.userName || 'User'}
                    </div>
                    <div>
                      <strong>Timestamp:</strong>{' '}
                      {comment.timestamp
                        ? new Date(comment.timestamp).toLocaleString()
                        : ''}
                    </div>
                  </li>
                );
              })}
          </ul>
          {comments.length > COMMENTS_PER_PAGE && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                margin: '12px 0',
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => setCommentsPage((p) => Math.max(1, p - 1))}
                disabled={commentsPage === 1}
              >
                Previous
              </Button>
              <span style={{ alignSelf: 'center' }}>
                Page {commentsPage} of{' '}
                {Math.ceil(comments.length / COMMENTS_PER_PAGE)}
              </span>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setCommentsPage((p) =>
                    Math.min(
                      Math.ceil(comments.length / COMMENTS_PER_PAGE),
                      p + 1
                    )
                  )
                }
                disabled={
                  commentsPage ===
                  Math.ceil(comments.length / COMMENTS_PER_PAGE)
                }
              >
                Next
              </Button>
            </div>
          )}
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
              color="success"
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

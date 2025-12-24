import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/auth.interceptor";
import { authService } from "../../api/authService";

const FacilityReportDetail = () => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
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
        console.error("Error fetching facility report details:", error);
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
      setCommentInput("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

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

        {/* Comment Thread Section */}
        <div className="report_detail__section">
          <h3>Comments</h3>
          <ul className="comments__thread">
            {comments.length === 0 && (
              <li key="no-comments">No comments yet.</li>
            )}
            {comments.map((comment, idx) => (
              <li
                key={comment._id || comment.id || idx}
                style={{
                  marginBottom: "1.5em",
                  paddingBottom: "0.5em",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <strong>Description:</strong> {comment.description}
                </div>
                <div>
                  <strong>Created By:</strong>{" "}
                  {authService.getUser()?.userName ||
                    authService.getUser()?.name ||
                    "User"}
                </div>
                <div>
                  <strong>Timestamp:</strong>{" "}
                  {comment.timestamp
                    ? new Date(comment.timestamp).toLocaleString()
                    : ""}
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddComment} style={{ marginTop: 12 }}>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              rows={3}
              placeholder="Add a comment..."
              style={{ width: "100%", resize: "vertical" }}
              disabled={commentLoading}
            />
            <button
              type="submit"
              disabled={commentLoading || !commentInput.trim()}
              style={{ marginTop: 8 }}
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacilityReportDetail;

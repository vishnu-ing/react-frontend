import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/auth.interceptor";
import { authService } from "../../api/authService";
import { parseJwt } from "../../utils/jwt";

const HousingDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [housing, setHousing] = useState(null);
  const [facilityReports, setFacilityReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  // Load current user from JWT
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const payload = parseJwt(token);
      setCurrentUserId(payload?.userId || payload?.id || payload?.sub || null);
    }
  }, []);

  // Fetch housing + facility reports
  useEffect(() => {
    const fetchHousing = async () => {
      try {
        const res = await axiosInstance.get(`/housing/me`);

        setHousing(res.data);

        const houseId = res.data?._id || res.data?.id;
        if (!houseId) return;

        setLoadingReports(true);

        const reportsRes = await axiosInstance.get(
          `/facility-reports?houseId=${houseId}`
        );

        setFacilityReports(
          Array.isArray(reportsRes.data)
            ? reportsRes.data
            : reportsRes.data.reports || []
        );
      } catch (err) {
        console.error("Error fetching housing:", err);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchHousing();
  }, []);

  if (!housing) return <div>Loading...</div>;

  // Derived values
  const reportsForUser = facilityReports.filter(
    (r) => String(r.createdBy) === String(currentUserId)
  );

  const resolveCreatedBy = (report) =>
    report.createdByName ||
    report.createdBy?.username ||
    (typeof report.createdBy === "object" && report.createdBy?.name) ||
    report.createdBy ||
    "N/A";

  // Facility Reports UI
  const facilityReportsContent = (() => {
    if (loadingReports) return <div>Loading facility reports...</div>;
    if (!currentUserId) return <div>Loading user info...</div>;
    if (reportsForUser.length === 0)
      return <div>No facility reports found for this user.</div>;

    return (
      <ul className="facility__reports">
        {reportsForUser.map((report) => (
          <li key={report._id || report.id} className="facility__report">
            <h3>{report.title}</h3>
            <p>{report.description}</p>

            <p>
              <strong>Created By:</strong> {resolveCreatedBy(report)}
            </p>

            <p>
              <strong>Timestamp:</strong>{" "}
              {report.createdAt
                ? new Date(report.createdAt).toLocaleString()
                : report.date
                ? new Date(report.date).toLocaleString()
                : "N/A"}
            </p>

            <p>
              <strong>Status:</strong> {report.status || "open"}
            </p>
          </li>
        ))}
      </ul>
    );
  })();

  // Submit Facility Report
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMsg("");
    if (!housing || (!housing._id && !housing.id)) {
      setSubmitMsg("Cannot submit: Housing data not loaded.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        houseId: housing._id || housing.id,
        title: form.title,
        description: form.description,
      };

      await axiosInstance.post("/facility-reports", payload);

      setSubmitMsg("Report submitted successfully!");
      setForm({ title: "", description: "" });
      setShowForm(false);

      // Refresh reports
      setLoadingReports(true);
      const houseId = housing._id || housing.id;
      const reportsRes = await axiosInstance.get(
        `/facility-reports?houseId=${houseId}`
      );

      setFacilityReports(
        Array.isArray(reportsRes.data)
          ? reportsRes.data
          : reportsRes.data.reports || []
      );
    } catch (err) {
      setSubmitMsg(
        "Failed to submit report. " +
          (err?.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
      setLoadingReports(false);
    }
  };

  if (Array.isArray(housing.residents)) {
    console.log("Roommates:", housing.residents);
  }
  return (
    <div className="housing__content">
      <h2>Housing Details</h2>
      <p>
        <strong>Address:</strong> {housing.address}
      </p>

      <h2>Roommates</h2>
      <ul>
        {Array.isArray(housing.residents) && housing.residents.length > 0 ? (
          housing.residents
            .filter((roommate) => {
              // Exclude the logged-in user from roommates list by id, userName, or email
              const roommateId = roommate._id || roommate.id || roommate.userId;
              const roommateUserName = roommate.userName || roommate.username;
              const roommateEmail = roommate.email;
              const user = authService.getUser();
              const userId = user?.userId || user?.id || user?._id;
              const userName = user?.userName || user?.username;
              const email = user?.email;
              if (userId && roommateId && String(roommateId) === String(userId))
                return false;
              if (userName && roommateUserName && roommateUserName === userName)
                return false;
              if (email && roommateEmail && roommateEmail === email)
                return false;
              return true;
            })
            .map((roommate, index) => {
              // Prefer full name, then username, then email
              let displayName =
                (roommate.firstName && roommate.lastName
                  ? roommate.firstName + " " + roommate.lastName
                  : roommate.firstName) ||
                roommate.userName ||
                roommate.username ||
                roommate.email ||
                "No name";
              // Prefer cellPhone, then phone, then phoneNumber, then mobile, then contact
              let phone =
                roommate.cellPhone ||
                roommate.phone ||
                roommate.phoneNumber ||
                roommate.mobile ||
                roommate.contact ||
                "";
              return (
                <li key={index}>
                  {displayName}
                  {phone ? ` (${phone})` : ""}
                </li>
              );
            })
        ) : (
          <li>No roommates found.</li>
        )}
      </ul>

      <button
        style={{ marginTop: 20, marginBottom: 20 }}
        onClick={() => {
          navigate("/facility-reports");
        }}
      >
        View My Facility Reports
      </button>

      <button onClick={() => setShowForm((v) => !v)} style={{ marginTop: 20 }}>
        {showForm ? "Cancel" : "Report Facility Issue"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: 20,
            maxWidth: 420,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <label style={{ fontWeight: 600, marginBottom: 4 }}>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            disabled={submitting}
            style={{
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 16,
              marginBottom: 8,
            }}
            placeholder="Enter a short issue title"
            maxLength={60}
          />

          <label style={{ fontWeight: 600, marginBottom: 4 }}>
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            disabled={submitting}
            style={{
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 16,
              minHeight: 80,
              resize: "vertical",
              marginBottom: 8,
            }}
            placeholder="Describe the issue in detail"
            maxLength={500}
          />

          <button
            type="submit"
            disabled={submitting || !housing || (!housing._id && !housing.id)}
            style={{
              marginTop: 10,
              background: submitting ? "#aaa" : "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "12px 0",
              fontWeight: 600,
              fontSize: 16,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>

          {submitMsg && (
            <div
              style={{
                marginTop: 10,
                color: submitMsg.includes("success") ? "seagreen" : "crimson",
                fontWeight: 500,
              }}
            >
              {submitMsg}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default HousingDetails;

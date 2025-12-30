import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/auth.interceptor';
import { authService } from '../../api/authService';
import { parseJwt } from '../../utils/jwt';
import '../../pages/OnboardingApplication.css';
import { Paper, Button, CircularProgress } from '@mui/material';
import './HousingDetails.css';

const HousingDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [housing, setHousing] = useState(null);
  const [facilityReports, setFacilityReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [formErrors, setFormErrors] = useState({ title: '', description: '' });

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const payload = parseJwt(token);
      setCurrentUserId(payload?.userId || payload?.id || payload?.sub || null);
    }
  }, []);

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
        console.error('Error fetching housing:', err);
      } finally {
        setLoadingReports(false);
      }
    };
    fetchHousing();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMsg('');
    let errors = { title: '', description: '' };
    let hasError = false;
    if (!form.title.trim()) {
      errors.title = 'Title is required.';
      hasError = true;
    }
    if (!form.description.trim()) {
      errors.description = 'Description is required.';
      hasError = true;
    }
    setFormErrors(errors);
    if (hasError) return;
    if (!housing || (!housing._id && !housing.id)) {
      setSubmitMsg('Cannot submit: Housing data not loaded.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        houseId: housing._id || housing.id,
        title: form.title,
        description: form.description,
      };
      await axiosInstance.post('/facility-reports', payload);
      setSubmitMsg('Report submitted successfully!');
      setForm({ title: '', description: '' });
      setFormErrors({ title: '', description: '' });
      setShowForm(false);
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
        'Failed to submit report. ' +
          (err?.response?.data?.message || err.message)
      );
    } finally {
      setSubmitting(false);
      setLoadingReports(false);
    }
  };

  if (!housing)
    return (
      <div className="housing-loading">
        <CircularProgress />
      </div>
    );

  return (
    <div className="onboarding-container">
      <Paper elevation={3} className="onboarding-content">
        <Button
          variant="outlined"
          color="primary"
          className="housing-btn facility-reports-btn"
          style={{ marginBottom: 24 }}
          onClick={() => {
            navigate('/facility-reports');
          }}
        >
          View My Facility Reports
        </Button>

        <h2>Housing Details</h2>
        <p>
          <strong>Address:</strong> {housing.address}
        </p>

        <h2>Roommates</h2>
        <ul className="housing-roommates-list">
          {Array.isArray(housing.residents) && housing.residents.length > 0 ? (
            housing.residents
              .filter((roommate) => {
                const roommateId =
                  roommate._id || roommate.id || roommate.userId;
                const roommateUserName = roommate.userName || roommate.username;
                const roommateEmail = roommate.email;
                const user = authService.getUser();
                const currentUserIdLocal =
                  user?.userId || user?.id || user?._id;
                const currentUserName = user?.userName || user?.username;
                const currentUserEmail = user?.email;
                if (
                  currentUserIdLocal &&
                  roommateId &&
                  String(roommateId) === String(currentUserIdLocal)
                )
                  return false;
                if (
                  currentUserName &&
                  roommateUserName &&
                  roommateUserName === currentUserName
                )
                  return false;
                if (
                  currentUserEmail &&
                  roommateEmail &&
                  roommateEmail === currentUserEmail
                )
                  return false;
                return true;
              })
              .map((roommate, index) => {
                let displayName =
                  (roommate.firstName && roommate.lastName
                    ? roommate.firstName + ' ' + roommate.lastName
                    : roommate.firstName) ||
                  roommate.userName ||
                  roommate.username ||
                  roommate.email ||
                  'No name';
                let phone =
                  roommate.cellPhone ||
                  roommate.phone ||
                  roommate.phoneNumber ||
                  roommate.mobile ||
                  roommate.contact ||
                  '';
                return (
                  <li key={index}>
                    {displayName}
                    {phone ? ` (${phone})` : ''}
                  </li>
                );
              })
          ) : (
            <li>No roommates found.</li>
          )}
        </ul>

        <Button
          variant={!showForm ? 'contained' : 'outlined'}
          color={!showForm ? 'success' : 'secondary'}
          className={`housing-btn report-issue-btn`}
          onClick={() => {
            setShowForm((v) => {
              if (!v) setSubmitMsg('');
              return !v;
            });
          }}
          style={showForm ? { display: 'none' } : {}}
        >
          Report Facility Issue
        </Button>

        {submitMsg && !showForm && (
          <div
            className={`housing-submit-msg${
              submitMsg.includes('success') ? ' success' : ' error'
            }`}
            style={{ marginBottom: 16 }}
          >
            {submitMsg}
          </div>
        )}

        {showForm && (
          <form
            className="housing-form"
            onSubmit={handleSubmit}
            style={{ position: 'relative' }}
          >
            <button
              type="button"
              className="housing-close-btn"
              aria-label="Close"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h3 style={{ marginTop: 0 }}>File a Facility Report</h3>
            <div className="housing-form-fields-col">
              <div className="housing-form-field-group">
                <label className="housing-label" htmlFor="facility-title">
                  Title
                </label>
                <input
                  id="facility-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    if (formErrors.title)
                      setFormErrors({ ...formErrors, title: '' });
                  }}
                  required
                  disabled={submitting}
                  className="housing-input"
                  placeholder="What is the issue"
                  maxLength={60}
                />
                {formErrors.title && (
                  <div className="housing-form-error">{formErrors.title}</div>
                )}
              </div>
              <div className="housing-form-field-group">
                <label className="housing-label" htmlFor="facility-description">
                  Description
                </label>
                <textarea
                  id="facility-description"
                  value={form.description}
                  onChange={(e) => {
                    setForm({ ...form, description: e.target.value });
                    if (formErrors.description)
                      setFormErrors({ ...formErrors, description: '' });
                  }}
                  required
                  disabled={submitting}
                  className="housing-textarea"
                  placeholder="Describe the issue in detail"
                  maxLength={500}
                />
                {formErrors.description && (
                  <div className="housing-form-error">
                    {formErrors.description}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={
                submitting ||
                !housing ||
                (!housing._id && !housing.id) ||
                !form.title.trim() ||
                !form.description.trim()
              }
              className="housing-btn submit-btn"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default HousingDetails;

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { authService } from "../api/authService";
import {
  getPersonalInfoThunk,
  updatePersonalInfoThunk,
} from "../store/userSlice/user.slice";

// import { fetchProfilePicture, uploadProfilePicture } from "../api/axiosCustom";
import { uploadProfilePicture } from "../api/axiosCustom";
import EditToolbar from "../components/profile/EditToolbar";
import NameSection from "../components/profile/NameSection";
import AddressSection from "../components/profile/AddressSection";
import ContactInfoSection from "../components/profile/ContactInfoSection";
import EmergencyContactsSection from "../components/profile/EmergencyContactsSection";
import DriverLicenseSection from "../components/profile/DriverLicenseSection";
import VisaDocumentsSection from "../components/profile/VisaDocumentsSection";

// ===========TEMPORARY. MUST RETRIEVE USERID FROM TOKEN
// const USER_ID = import.meta.env.VITE_EXAMPLE_USERID;
// ===========TEMPORARY. MUST RETRIEVE USERID FROM TOKEN

export default function PersonalProfile() {
  const dispatch = useDispatch();
  const { personalInfo, loading, updating } = useSelector((s) => s.user);
  const [absoluteError, setAbsoluteError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    dispatch(getPersonalInfoThunk());
  }, [dispatch]);

  useEffect(() => {
    setDraft(personalInfo);
  }, [personalInfo]);

  if (loading || !draft) {
    return <p>Loading...</p>;
  }

  const onCancel = () => {
    setDraft(personalInfo);
    setIsEditing(false);
  };

  const onSave = () => {
    // If a new file was selected, upload it first to get S3 URL
    const doSave = async () => {
      try {
        let updatedName = { ...draft.name };
        const file = draft?.name?.profilePictureFile;
        if (file && file instanceof File) {
          const res = await uploadProfilePicture(file);
          const url = res.data?.url;
          if (url) {
            updatedName = { ...updatedName, profilePicture: `${url}?v=${Date.now()}` };
          }
        }
        await dispatch(
          updatePersonalInfoThunk({
            payload: {
              name: updatedName,
              address: draft.address,
              contactInfo: draft.contactInfo,
              driverlicense: draft.driverlicense,
              emergencyContacts: draft.emergencyContacts,
            },
          })
        );
        setDraft((prev) => ({
          ...prev,
          name: {
            ...updatedName,
          },
        }));

        await dispatch(getPersonalInfoThunk()).unwrap();

        setIsEditing(false);
      } catch (err) {
        console.error("Save error:", err);
      }
    };

    doSave();
  };

  return (
    <div className="profile-page">
      <EditToolbar
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={onCancel}
        onSave={onSave}
        loading={updating}
        absoluteError={absoluteError}
      />

      <NameSection
        data={draft}
        setDraft={setDraft}
        isEditing={isEditing}
        setAbsoluteError={setAbsoluteError}
      />

      <AddressSection data={draft} setDraft={setDraft} isEditing={isEditing} />

      <ContactInfoSection
        data={draft}
        setDraft={setDraft}
        isEditing={isEditing}
        setAbsoluteError={setAbsoluteError}
      />

      <EmergencyContactsSection
        data={draft}
        setDraft={setDraft}
        isEditing={isEditing}
        setAbsoluteError={setAbsoluteError}
      />

      <DriverLicenseSection driverLicense={draft.driverlicense} />
      <VisaDocumentsSection visaDocuments={draft.visaDocuments || []} />
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getPersonalInfoThunk,
  updatePersonalInfoThunk,
} from "../store/userSlice/user.slice";

import {
  uploadDriverLicense,
  uploadProfilePicture,
  uploadVisaDocument,
} from "../api/axiosCustom";
import EditToolbar from "../components/profile/EditToolbar";
import NameSection from "../components/profile/NameSection";
import AddressSection from "../components/profile/AddressSection";
import ContactInfoSection from "../components/profile/ContactInfoSection";
import EmergencyContactsSection from "../components/profile/EmergencyContactsSection";
import DriverLicenseSection from "../components/profile/DriverLicenseSection";
import VisaDocumentsSection from "../components/profile/VisaDocumentsSection";
import { Stack } from '@mui/material';

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
    if (absoluteError) {
      console.warn("Cannot save when there are errors!");
      return;
    }
    const doSave = async () => {
      try {
        //      PROFILE PICTURE S3
        let updatedName = { ...draft.name };
        let file = draft?.name?.profilePictureFile;
        if (file && file instanceof File) {
          let res = await uploadProfilePicture(file);
          let url = res.data?.url;
          if (url) {
            updatedName = {
              ...updatedName,
              profilePicture: `${url}?v=${Date.now()}`,
            };
          }
        }

        //      DRIVER LICENSE S3
        let updatedDriverLicense = { ...draft.driverlicense };
        const driverFile = draft?.driverlicense?.fileUrl;
        if (driverFile && driverFile instanceof File) {
          let res = await uploadDriverLicense(driverFile);
          let url = res.data?.url;
          if (url) {
            updatedDriverLicense = {
              ...updatedDriverLicense,
              fileUrl: `${url}?v=${Date.now()}`,
            };
          }
        }
        //      Visa Documents
        let updatedVisaDocuments = [...draft.visaDocuments];

        for (let i = 0; i < updatedVisaDocuments.length; i++) {
          const doc = updatedVisaDocuments[i];

          if (doc.fileUrl instanceof File) {
            const res = await uploadVisaDocument(doc.fileUrl, doc._id);
            const url = res.data?.url;
            const key = res.data?.key;

            updatedVisaDocuments[i] = {
              ...doc,
              fileUrl: `${url}?v=${Date.now()}`,
              fileKey: key, 
            };
          }
        }

        await dispatch(
          updatePersonalInfoThunk({
            payload: {
              name: updatedName,
              address: draft.address,
              contactInfo: draft.contactInfo,
              driverlicense: updatedDriverLicense,
              emergencyContacts: draft.emergencyContacts,
              visaDocuments: updatedVisaDocuments,
            },
          })
        );
        setDraft((prev) => ({
          ...prev,
          name: {
            ...updatedName,
          },
          driverlicense: updatedDriverLicense,
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
    <Stack spacing={5} sx={{ p: 4, maxWidth: 900, mx: 'auto', bgcolor: 'transparent' }}>
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

      <AddressSection data={draft} setDraft={setDraft} isEditing={isEditing} setAbsoluteError={setAbsoluteError} />

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

      <DriverLicenseSection
        data={draft}
        setDraft={setDraft}
        driverLicense={draft.driverlicense}
        isEditing={isEditing}
      />
      <VisaDocumentsSection
        data={draft}
        setDraft={setDraft}
        isEditing={isEditing}
        
        visaDocuments={draft.visaDocuments || []}
      />
    </div>
    </Stack>
  );
}

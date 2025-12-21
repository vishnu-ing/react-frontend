
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  getPersonalInfoThunk,
  updatePersonalInfoThunk,
} from "../store/userSlice/user.slice";



import EditToolbar from "../components/profile/EditToolbar";
import NameSection from "../components/profile/NameSection";
import AddressSection from "../components/profile/AddressSection";
import ContactInfoSection from "../components/profile/ContactInfoSection";
import EmergencyContactsSection from "../components/profile/EmergencyContactsSection";
import DriverLicenseSection from "../components/profile/DriverLicenseSection";
import VisaDocumentsSection from "../components/profile/VisaDocumentsSection";



// ===========TEMPORARY. MUST RETRIEVE USERID FROM TOKEN
const USER_ID = import.meta.env.VITE_EXAMPLE_USERID;
// ===========TEMPORARY. MUST RETRIEVE USERID FROM TOKEN



export default function PersonalProfile() {
  const dispatch = useDispatch();
  const { personalInfo, loading, updating } = useSelector((s) => s.user);
  const [absoluteError,setAbsoluteError] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  
 

  useEffect(() => {
    dispatch(getPersonalInfoThunk(USER_ID));
  }, [dispatch]);

  useEffect(() => {
    setDraft(personalInfo);
  }, [personalInfo]);

  if (loading || !draft) return <p>Loading...</p>;

  

  const onCancel = () => {
    setDraft(personalInfo);
    setIsEditing(false);
  };

  const onSave = () => {


    dispatch(
      updatePersonalInfoThunk({
        userId: USER_ID,
        payload: {
        name: draft.name,
        address: draft.address,
        contactInfo: draft.contactInfo,
        driverLicense: draft.driverlicense, 
        emergencyContacts: draft.emergencyContacts,
      },
      })
    ).then(() => setIsEditing(false));
  };

  return (
    <div className="profile-page">
      <EditToolbar
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={onCancel}
        onSave={onSave}
        loading={updating}
        absoluteError = {absoluteError}
      />

      <NameSection
        data={draft}
        setDraft={setDraft}
        isEditing={isEditing}
        setAbsoluteError = {setAbsoluteError}
  
      />

      <AddressSection data={draft} setDraft={setDraft} isEditing={isEditing} />

      <ContactInfoSection
        data={draft}
        setDraft={setDraft}
        isEditing={isEditing}
       setAbsoluteError = {setAbsoluteError}
      />

      <EmergencyContactsSection
        data={draft}
        setDraft={setDraft}
        isEditing={isEditing}
        setAbsoluteError = {setAbsoluteError}

      />
     
      <DriverLicenseSection driverLicense={draft.driverlicense} />
      <VisaDocumentsSection visaDocuments={draft.visaDocuments || []} />
    </div>
  )}

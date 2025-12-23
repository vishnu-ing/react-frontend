import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from "react";
import { Stack, Typography, Box, Alert, AlertTitle, Button } from '@mui/material';

//import components
import ProfilePicture from "../components/onboardingcomponents/ProfilePicture";
import PersonalInformation from "../components/onboardingcomponents/PersonalInformation";
import AddressSection from "../components/onboardingcomponents/AddressSection";
import PersonalInfoOthers from "../components/onboardingcomponents/PersonalInfoOthers";
import CitizenStatus from "../components/onboardingcomponents/CitizenStatus";
import DriverLicense from "../components/onboardingcomponents/DriverLicense";
import ReferralSection from "../components/onboardingcomponents/ReferralSection";
import EmergencyContactSection from "../components/onboardingcomponents/EmergencyContactSection";
import DocumentSummarySection from "../components/onboardingcomponents/DocumentSummarySection";
import Feedback from "../components/onboardingcomponents/Feedback";
//import datas
import { fetchOnboardingData,submitApplication } from '../store/onboardslice/onboardingthunks';

function OnboardingApplication() {
    const dispatch = useDispatch();
    const authData = useSelector((state) => state.auth);
    const { formData, onboardingStatus } = useSelector((state) => state.onboarding);
    const username = authData?.user?.userName;
    //initialize value for MUI
    const emptyForm = useMemo(() => ({
        firstName: "", lastName: "", middleName: "", preferredName: "",
        email: "", cellPhone: "", workPhone: "", ssn: "", DOB: "", gender: "",
        address: { building: "", street: "", city: "", state: "", zip: "" },
        car: { make: "", model: "", color: "" },
        isCitizen: "No", workAuth: "", visaTitle: "", visaStart: "", visaEnd: "",
        hasLicense: "No", licenseNum: "", licenseExp: "",
        referral: { firstName: "", lastName: "", phone: "", relationship: "" },
        emergencyContacts: [],
        greencard: "No", citizenType: ""
    }), []);

    const methods = useForm({ 
        defaultValues: { ...emptyForm, ...formData } 
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (username) {
            dispatch(fetchOnboardingData(username));
        }
    }, [dispatch, username]);

    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
             //helper to convert dates
            const formatDate = (dateString) => {
                if (!dateString) return "";
                return dateString.includes('T') ? dateString.split('T')[0] : dateString;
            };
            let formIsCitizen = "No";
            if (formData.isCitizen === "Yes" || formData.greencard === "Yes") {
                formIsCitizen = "Yes";
            }
            //determine dropdown value for resident)
            let formCitizenType = "";
            if (formData.isCitizen === "Yes") {
                formCitizenType = "Citizen";
            } else if (formData.greencard === "Yes") {
                formCitizenType = "Green Card";
            }
            let extractedWorkAuth = "";
            let extractedVisaStart = "";
            let extractedVisaEnd = "";
            let extractedVisaTitle = "";
            let backendOptReceipt = null;
            //extra visa object
            if (formData.VisaDocument && formData.VisaDocument.length > 0) {
                const visaDoc = formData.VisaDocument[0]; 
                if (visaDoc.type === 'OPT Receipt') {
                    extractedWorkAuth = 'F1';
                } else {
                    extractedWorkAuth = visaDoc.type || "";
                }
                extractedVisaStart = formatDate(visaDoc.startDate);
                extractedVisaEnd = formatDate(visaDoc.endDate);
                extractedVisaTitle = formData.visaTitle || ""; 
                if (extractedWorkAuth === 'F1') {
                    backendOptReceipt = visaDoc;
                }
            }
            //finding document files
            if (formData.VisaDocument && formData.VisaDocument.length > 0) {
                const optDoc = formData.VisaDocument.find(doc => doc.type === 'OPT Receipt');
                if (optDoc) backendOptReceipt = optDoc; 
            }
            let backendLicense = null;
            if (formData.driverlicense && formData.driverlicense.fileUrl) {
                backendLicense = formData.driverlicense.fileUrl;
                if (backendLicense && !backendLicense.startsWith('uploads/')) {
                backendLicense = `uploads/${backendLicense}`;
            }
            }
            const formattedData = {
                ...emptyForm,
                ...formData,
                isCitizen: formIsCitizen,    
                citizenType: formCitizenType,
                workAuth: extractedWorkAuth,
                visaStart: extractedVisaStart,
                visaEnd: extractedVisaEnd,
                visaTitle: extractedVisaTitle,
                optReceipt: backendOptReceipt, 
                driverLicense: backendLicense
            };
            reset(formattedData);
        }
    }, [formData, reset, emptyForm]);

    const isLocked = onboardingStatus === 'Pending';

    const onFormSubmit = (values) => {
        const submissionData = { ...values };
        // need to map our frontend only variables to our backend model
        if (values.isCitizen === "Yes") {
            if (values.citizenType === "Citizen") {
                submissionData.isCitizen = "Yes";
                submissionData.greencard = "No";
            } 
            else if (values.citizenType === "Green Card") {
                submissionData.isCitizen = "No";
                submissionData.greencard = "Yes";
            }
        } 
        else {
            //visa both would be no
            submissionData.isCitizen = "No";
            submissionData.greencard = "No";
        }
        delete submissionData.citizenType;
        dispatch(submitApplication({ userName: username, onboardingdata: submissionData }));
    };
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <Stack spacing={5} sx={{ p: 4, maxWidth: 900, mx: 'auto', bgcolor: 'transparent' }}>
                    {onboardingStatus !== 'Not Started' && (
                        <Box sx={{ mb: 3 }}>
                            <Alert 
                                severity={
                                    onboardingStatus === 'Pending' ? "info" : 
                                    onboardingStatus === 'Rejected' ? "error" : "success"
                                } 
                                variant="filled"
                                sx={{ 
                                    bgcolor: 
                                        onboardingStatus === 'Pending' ? 'dodgerblue' : 
                                        onboardingStatus === 'Rejected' ? '#d32f2f' : 'seagreen' 
                                }}
                            >
                                <AlertTitle>Application Status: {onboardingStatus}</AlertTitle>
                                {onboardingStatus === 'Pending' && "Your application is under review by HR."}
                                {onboardingStatus === 'Rejected' && "Please review the feedback and resubmit your application."}
                            </Alert>
                        </Box>
                    )}
                    <Typography variant="h4" component="h1" sx={{ color: 'black' }}>
                        Onboarding Application
                    </Typography>

                    {/*personal info*/}
                    <Stack direction="row" spacing={4} alignItems="flex-start">
                        <ProfilePicture isLocked={isLocked} />
                        <PersonalInformation isLocked={isLocked} />
                    </Stack>

                    {/*section components */}
                    <AddressSection isLocked={isLocked} />
                    <PersonalInfoOthers isLocked={isLocked} />
                    <CitizenStatus isLocked={isLocked} />
                    <DriverLicense isLocked={isLocked} />
                    <ReferralSection isLocked={isLocked} />
                    <EmergencyContactSection isLocked={isLocked} />
                    <DocumentSummarySection />
                    <Feedback />
                    {!isLocked && (
                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large" 
                            sx={{ py: 2, bgcolor: 'royalblue', '&:hover': { bgcolor: 'blue' } }}
                        >
                            {onboardingStatus === 'Rejected' ? 'Update & Resubmit' : 'Submit Application'}
                        </Button>
                    )}
                </Stack>
            </form>
        </FormProvider>
    );
}

export default OnboardingApplication;
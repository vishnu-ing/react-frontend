import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import onboardingReducer from '../features/onboarding/onboardingSlice'

export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     onboarding: onboardingReducer,
//   },
//   devTools: !import.meta.env.PROD,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export default store

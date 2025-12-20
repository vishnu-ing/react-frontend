import { configureStore } from '@reduxjs/toolkit'
// import authReducer from '../features/auth/authSlice'
// import onboardingReducer from '../features/onboarding/onboardingSlice'
import userReducer from './userSlice/user.slice'

export const store = configureStore({
    reducer:{
        user:userReducer
    }
//   reducer: {
//     auth: authReducer,
//     onboarding: onboardingReducer,
//   },
//   devTools: !import.meta.env.PROD,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export default store

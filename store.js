// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';  // Le chemin correct est celui où vous avez votre fichier authSlice.js
import registerReducer from './registerSlice';  // Ajoutez le reducer du register si nécessaire

const store = configureStore({
  reducer: {
    auth: authReducer,  // Auth reducer
    register: registerReducer,  // Register reducer
  },
});

export default store;

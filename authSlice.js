import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api"; // Assurez-vous que ce chemin est correct et que api est configuré
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action asynchrone pour le login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/login", { email, password });
      console.log("Réponse de l'API /login :", response.data);
      
      // Stockage du token dans AsyncStorage pour les futures requêtes API
      if (response.data.token) {
        await AsyncStorage.setItem('accessToken', response.data.token);
        console.log("Token stocké dans AsyncStorage");
      }
      
      // Si response.data.user existe, nous le stockons dans le state
      if (response.data.user) {
        dispatch(setUser(response.data.user)); 
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data; // Devrait contenir { token, role, user (optionnel) }
    } catch (error) {
      console.error("Erreur de login:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.error || "Login failed. Please try again."
      );
    }
  }
);

// Slice pour gérer l'état de l'authentification
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Ajout du champ pour stocker les informations de l'utilisateur
    token: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      // Vous pouvez aussi mettre à jour isAuthenticated si l'utilisateur est défini
      state.isAuthenticated = !!action.payload;
    },
    logout: {
      reducer(state) {
        state.user = null;
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
      },
      prepare() {
        // Suppression du token et de l'utilisateur d'AsyncStorage
        AsyncStorage.removeItem('accessToken');
        AsyncStorage.removeItem('user');
        return { payload: null };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.role = action.payload.role ? action.payload.role[0] : null; 
        // Si l'utilisateur est dans action.payload.user et n'a pas été défini par le dispatch dans loginUser,
        // vous pouvez le définir ici. Cependant, il est préférable de le faire via dispatch(setUser).
        // if (action.payload.user && !state.user) {
        //   state.user = action.payload.user;
        // }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout } = authSlice.actions; // Exporter l'action setUser

export default authSlice.reducer;


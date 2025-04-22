import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api";

// Action asynchrone pour le login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, password });
      console.log("Réponse de l'API /login :", response.data);
      return response.data; // Retourne { token, role }
    } catch (error) {
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
    token: null,
    role: null, // Ajout pour stocker le rôle utilisateur
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null; // Réinitialise le rôle lors de la déconnexion
      state.isAuthenticated = false;
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
        state.role = action.payload.role[0]; // Le rôle est le premier élément du tableau
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

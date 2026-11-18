import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

export const addEmployees = createAsyncThunk(
  "addEmployees",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.post("/employees", payload);
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getAllEmployees = createAsyncThunk(
  "getAllEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await AuthService.get("/employees");
      return data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getEmployeeById = createAsyncThunk(
  "getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await AuthService.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const StaffSlice = createSlice({
  name: "employee",
  initialState: {
    employee: [],
    employeeDetails: null,
    loading: false, // fetching list / details
    saving: false,  // creating an employee (kept separate so the modal isn't blocked by list refreshes)
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // list
    builder
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.employee = action.payload?.data || [];
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // single
    builder
      .addCase(getEmployeeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.employeeDetails = action.payload?.data;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // create
    builder
      .addCase(addEmployees.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addEmployees.fulfilled, (state) => {
        state.saving = false;
        state.error = null;
        // list is refetched by the caller after a successful create
      })
      .addCase(addEmployees.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export default StaffSlice.reducer;
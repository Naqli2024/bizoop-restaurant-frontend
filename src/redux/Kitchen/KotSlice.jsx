import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

export const getKitchenStation = createAsyncThunk(
    "getKitchenStation",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await AuthService.get("/kitchen-stations");
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
)

const KotSlice = createSlice({
    name: "stations",
    initialState: {
        stations: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.loading = true;
        };

        const handleFulFilled = (state, action) => {
            state.loading = false;
            state.error = null;

            switch (action.type) {
                case getKitchenStation.fulfilled.type:
                    state.stations = action.payload?.data || [];
                    break;
                default:
                    break;
            }
        };
        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };
        [getKitchenStation].forEach((action) => {
            builder
                .addCase(action.pending, handlePending)
                .addCase(action.fulfilled, handleFulFilled)
                .addCase(action.rejected, handleRejected);
        });
    },
});

export default KotSlice.reducer
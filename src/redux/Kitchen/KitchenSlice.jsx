import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import handleApiError from "../../helpers/helperApiError";
import AuthService from "../../services/AuthService";

export const getKot = createAsyncThunk(
    "getKot",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await AuthService.get("/kots");
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
)

export const getKitchenDisplay = createAsyncThunk(
    "getKitchenDisplay",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await AuthService.get("/kots/kitchen-display");
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
)

export const startKot = createAsyncThunk(
    "startKot",
    async (kotId, { rejectWithValue }) => {
        try {
            const { data } = await AuthService.patch(
                `/kots/${kotId}/start`
            );
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const updateKotItemStatus = createAsyncThunk(
    "updateKotItemStatus",
    async ({ kotId, itemId,payload }, { rejectWithValue }) => {
        try {
            const { data } = await AuthService.patch(
                `/kots/${kotId}/items/${itemId}/status`,payload
                
            );
            return data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const KitchenSlice = createSlice({
    name: "kitchen",
    initialState: {
        kitchen: [],
        summary: {},
        stations: [],
        columns: {},
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
                case getKot.fulfilled.type:
                    state.kitchen = action.payload?.data || [];
                    break;
                case getKitchenDisplay.fulfilled.type:
                    state.summary = action.payload?.summary || {};
                    state.stations = action.payload?.stations || [];
                    state.columns = action.payload?.columns || {};
                    break;
                case startKot.fulfilled.type:
                    break;
                case updateKotItemStatus.fulfilled.type:
                    break;
                default:
                    break;
                    
            }
        };
        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };
        [getKot, getKitchenDisplay, startKot,updateKotItemStatus].forEach((action) => {
            builder
                .addCase(action.pending, handlePending)
                .addCase(action.fulfilled, handleFulFilled)
                .addCase(action.rejected, handleRejected);
        });
    },
});

export default KitchenSlice.reducer
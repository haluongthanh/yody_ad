import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
    value: {
        id: bigint;
        user_name: string;
        full_name: string;
        address: string;
        avatar: string;
        role_id: bigint;
        role_name: string;
        warehouse_id: bigint;
        created_time: Date;
        updated_time: Date;
        created_by: bigint;
        updated_by: bigint;
    } | null;
}

const initialState: UserState = {
    value: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{
            id: bigint;
            user_name: string;
            full_name: string;
            address: string;
            avatar: string;
            role_id: bigint;
            warehouse_id: bigint;
            created_time: Date;
            updated_time: Date;
            created_by: bigint;
            updated_by: bigint;
        }>) => {
            state.value = action.payload;
        },
        clearUser: (state) => {
            state.value = null;
        },
    },
});
export type UserStateType = UserState;
export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
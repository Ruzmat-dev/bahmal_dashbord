import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface Props {
    isChange: boolean
}

const initialState: Props = {
    isChange: false
}

export const changeSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    changeState: (state, action: PayloadAction<boolean>) => {
        state.isChange = action.payload
    },
  },
})

export const { changeState } = changeSlice.actions
export default changeSlice.reducer
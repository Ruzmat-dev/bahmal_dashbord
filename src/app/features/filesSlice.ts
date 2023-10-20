import { FileWithPath } from '@mantine/dropzone'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface Props {
    files: FileWithPath[]
}

const initialState: Props = {
    files: []
}

export const filesSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    changeFiles: (state, action: PayloadAction<FileWithPath[]>) => {
        state.files = action.payload
    },
  },
})

export const { changeFiles } = filesSlice.actions
export default filesSlice.reducer
import { configureStore } from '@reduxjs/toolkit'
import changeSlice from './features/contentSlice'
import filesSlice from './features/filesSlice'

export const store = configureStore({
  reducer: {
    filesSlice: filesSlice,
    changeSlice: changeSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
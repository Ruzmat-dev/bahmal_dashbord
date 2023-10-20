import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './app/store.ts';
import './index.css';


const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <MantineProvider theme={theme}>
    <ModalsProvider labels={{ confirm: 'Submit', cancel: 'Cancel' }}>
        <App />
    </ModalsProvider>

    </MantineProvider>
    </Provider>
  </React.StrictMode>,
)

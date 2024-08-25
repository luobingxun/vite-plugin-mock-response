import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import mockResponse from '../src/index';
import mockResponse from 'vite-plugin-mock-response';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mockResponse()]
});

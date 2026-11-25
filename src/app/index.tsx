import React from 'react';
import { WelcomeScreen } from '../features/auth/screens/welcome-screen';

/**
 * Entry point utama aplikasi (rute /).
 * Menampilkan WelcomeScreen (logo animasi GIF + line loading 0-100%)
 * yang setelah loading penuh otomatis berpindah ke halaman login.
 */
export default function Index() {
  return <WelcomeScreen />;
}

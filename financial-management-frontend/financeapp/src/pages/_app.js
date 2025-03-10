import { useEffect } from 'react';
import { initEmailJS } from '../services/emailjs';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize EmailJS
    initEmailJS();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Memasukkan CSS Bootstrap
import '../styles/globals.css'; // Memasukkan file CSS global
import Menu from '../components/Menu';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Menu />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

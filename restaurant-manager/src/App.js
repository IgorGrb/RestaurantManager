import './App.css';
import Main from './components/classes/Main';
import 'bootstrap/dist/css/bootstrap.min.css'
import './stilization.css'
import LoginModal from './components/functiones/modals/NavbarLoginModal';
import LoadCompanyLogoModal from './components/functiones/modals/LoadCompanyLogoModal';

function App() {
  return (
    <div className="App">
      <LoadCompanyLogoModal />
      <LoginModal />
      <Main />
    </div>
  );
}

export default App;

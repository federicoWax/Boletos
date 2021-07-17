import { FC } from 'react';
import './App.css';
import Routes from './routes/Routes';
import { AuthProvider } from './context/AuthContext';

const App: FC = () => (
  <div className="App">
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </div>
);

export default App;

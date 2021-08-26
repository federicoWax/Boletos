import { FC } from 'react';
import './App.css';
import Routes from './routes/Routes';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux'
import { store, rrfProps } from './firebase/firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

const App: FC = () => (
  <div className="App">
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  </div>
);

export default App;

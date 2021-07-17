import { useEffect, useState, useContext, createContext } from "react";
import firebase from "../firebase/firebase";
import FullLoader from "../components/FullLoader";

const AuthContext = createContext<{ user: firebase.User | null }>({
  user: null,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const uns = firebase.auth().onIdTokenChanged((user: firebase.User | null) => {
      setUser(user);
      setLoading(false);
    });

    return uns;
  }, []);

  if(loading) return <FullLoader />

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
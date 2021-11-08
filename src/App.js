import './App.css';
import { signInWithRedirect, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import LoginPage from './components/LoginPage'
import { ref, update } from "firebase/database";
import { database } from './firebase'
import { useEffect } from 'react';
import Main from './components/Main';

function App() {

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user !== null) {
      update(ref(database, 'communicator/users/' + user.uid), {
        username: user.displayName,
        photo: user.photoURL,
        id : user.uid
      },
      );
    }
  }, [user])

  function logout() {
    signOut(auth)
  }

  function login() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
    }).catch((error) => {
      console.log(error)
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  return (
    <div className="App">
      {user ? <Main photo={user.photoURL} name={user.displayName} id={user.uid} logout={logout}/> : <LoginPage login={login} />}
    </div>
  );
}

export default App;

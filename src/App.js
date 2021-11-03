import './App.css';
import { signInWithRedirect, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Main from './components/Main'
import LoginPage from './components/LoginPage'

function App() {

  const [user, loading, error] = useAuthState(auth);

  function logout() {
    signOut(auth)
  }

  function login() {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(user)
    }).catch((error) => {
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

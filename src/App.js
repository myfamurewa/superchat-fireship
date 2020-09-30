import React, {useState, useRef} from 'react';
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData} from 'react-firebase-hooks/firestore'
import './App.css';

firebase.initializeApp({
  apiKey: "AIzaSyC3dN3vx6K5U1hjIQkMdjau0o8Uxnx75ug",
  authDomain: "superchat-f92bc.firebaseapp.com",
  databaseURL: "https://superchat-f92bc.firebaseio.com",
  projectId: "superchat-f92bc",
  storageBucket: "superchat-f92bc.appspot.com",
  messagingSenderId: "313735941867",
  appId: "1:313735941867:web:7e76595796e4a0778bb8ae",
  measurementId: "G-BXH7FDH6L5"
})

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()
function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
        <h1>Mike's Chat App</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return (
    <button onClick={() => signInWithGoogle}>Sign in</button>
  )
}
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}> Sign Out</button>
  )
}
function ChatRoom() {

  const dummy = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField: 'id'})
  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault()

    const {uid, photoURL} = auth.currentUser
    await messagesRef.add({
      test: formValue,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({behavior: 'smooth'})
  }
  return (
    <>
      <main>
        {messages && messages.map(message => <ChatMessage key={message.id} message={message}/>)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form >
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.id ? 'sent' : 'received'

  return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL ||  'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
        <p>{text}</p>
      </div>
  )
}
export default App;

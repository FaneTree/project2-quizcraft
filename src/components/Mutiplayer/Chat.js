import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import "../style/Chat.css";
import "../style/Auth.css";
import { useAuthState } from "react-firebase-hooks/auth";
import Signin from "../Routes/Signin";

export const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const [users, setUsers] = useState([]);
  const usersRef = collection(db, "users");
  const [user] = useAuthState(auth);

  const addUser = async () => {
    await removeUser();
    await addDoc(usersRef, {
      user: auth.currentUser.displayName,
      room,
    });
    // console.log("add user", data.id);
  };

  const removeUser = async () => {
    // console.log("removing user");
    const q = query(
      usersRef,
      where("user", "==", auth.currentUser.displayName)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(function (doc) {
      deleteDoc(doc.ref);
    });
  };

  useEffect(() => {
    addUser();
  }, []);

  useEffect(() => {
    const queryUsers = query(usersRef, where("room", "==", room));
    const unsubscribe = onSnapshot(queryUsers, (snapshot) => {
      let users = [];
      const names = [];
      snapshot.forEach((doc) => {
        // Only add unique names
        const data = doc.data();
        if (!names.includes(data.user)) {
          users.push({ ...data, id: doc.id });
          names.push(data.user);
        }
      });
      setUsers(users);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages);
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });

    setNewMessage("");
  };

  return (
    <div>
      {user ? (
        <div className="sidebar">
          {/* <div className="playerlist">
          <p>Current players: </p>
          <button onClick={removeUser}> removeUser </button>
          {users.map((user) => (
            <div key={user.id} className="user">
              {user.user}
            </div>
          ))}
        </div> */}
          <div className="chat-app">
            <div className="header">
              <h1>Welcome! The room code is: {room.toUpperCase()}</h1>
            </div>
            <div className="messages">
              {messages.map((message) => (
                <div key={message.id} className="message">
                  <span className="user">{message.user}:</span> {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="new-message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                className="new-message-input"
                placeholder="Type your message here..."
              />
              <button type="submit" className=" auth lobbytag enterbutton">
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Signin />
      )}
    </div>
  );
};

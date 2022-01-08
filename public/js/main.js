import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, addDoc, query, where, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
var db = null;

var app = null;
const firebaseConfig = {
  apiKey: "AIzaSyAgfZ8M7rPNPBnqzK6gYlnIiMgeuXEVqW4",
  authDomain: "thong-pro.firebaseapp.com",
  projectId: "thong-pro",
  storageBucket: "thong-pro.appspot.com",
  messagingSenderId: "729502608583",
  appId: "1:729502608583:web:74b5917d91887495b2a2e2"
}

window.onload = async () => {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  // try {
  //   await addDoc(collection(db, "chat"), {
  //     username: "Nguyễn Văn Hiếu",
  //     msg: 'Xin chào!',
  //     room: "JavaScript"
  //   });
  //   await addDoc(collection(db, "chat"), {
  //     username: "Nguyễn Trọng Thông",
  //     msg: 'Xin chào1!',
  //     room: "JavaScript"
  //   });
  //   await addDoc(collection(db, "chat"), {
  //     username: "Obama",
  //     msg: 'Xin chào2!',
  //     room: "Python"
  //   });
  //   console.log("Document written with ID: ", docRef.id);
  // } catch (e) {
  //   console.error("Error adding document: ", e);
  // }

  const q = query(collection(db, "chat"), where("room", "==", room), orderBy('createdAt'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", JSON.stringify(doc.data()));
    outputMessage1(doc.data());
  });

}

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);
  var data = { username, msg, room, createdAt: new Date() }

  try {
    await addDoc(collection(db, "chat"), data);



  } catch (error) {
    console.log(error);
  }

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function outputMessage1(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${ formatDateTime(new Date(message.createdAt*1000))}</span>`;
  
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.msg;
  if(message.username == username){
    p.classList.add('to-right');
    para.classList.add('to-right');
  }
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function formatDateTime(_date) {
  if (_date != null) {
    var date = new Date(_date);
    var day = date.getDate();
    day = (day < 10) ? '0' + day : day;
    var month = date.getMonth() + 1;
    month = (month < 10) ? '0' + month : month;
    var hour = date.getHours();
    hour = (hour < 10) ? '0' + hour : hour;
    var minit = date.getMinutes();
    minit = (minit < 10) ? '0' + minit : minit;
    return hour + ":" + minit + " " + day + '/' + month;
  }
  else {
    return '';
  }
}

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}


// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

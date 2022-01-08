import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";


document.querySelector('#btn').addEventListener('click', () => {
    authenticate();
})

const firebaseConfig = {
    apiKey: "AIzaSyAgfZ8M7rPNPBnqzK6gYlnIiMgeuXEVqW4",
    authDomain: "thong-pro.firebaseapp.com",
    projectId: "thong-pro",
    storageBucket: "thong-pro.appspot.com",
    messagingSenderId: "729502608583",
    appId: "1:729502608583:web:74b5917d91887495b2a2e2"
}


async function authenticate() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    var rs = 1;
    await signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            alert("Đăng nhập thành công!");
            username.value = userCredential.user.email.split('@')[0];
            document.querySelector('#formLogin').setAttribute('action','chat.html');
            document.querySelector('#formLogin').submit();
        })
        .catch((error) => {
            alert('Đăng nhập thất bại!');
        });
}

export default authenticate;
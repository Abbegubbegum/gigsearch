import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: "AIzaSyDBZXix-BZGLOcRYvl8e7sc46ZTDNyM_ck",
	authDomain: "gigsearch-b3ae7.firebaseapp.com",
	projectId: "gigsearch-b3ae7",
	storageBucket: "gigsearch-b3ae7.appspot.com",
	messagingSenderId: "309932126295",
	appId: "1:309932126295:web:d2795c74da1aef79557312",
	measurementId: "G-LP1N9488PN",
};

initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseapp);

const app = createApp(App);

app.use(router);

app.mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css";
import axios from "axios";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, GeoPoint, getFirestore } from "@firebase/firestore";
import { getDoc } from "@firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const mapsAPIURL = "https://maps.googleapis.com/maps/api/geocode/json?";

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

export async function decodeGeopoint(coord: GeoPoint): Promise<string> {
	const api_key = await getMapsApiKey();

	let res = await axios.get(mapsAPIURL, {
		params: {
			latlng: `${coord.latitude},${coord.longitude}`,
			key: api_key,
		},
	});

	let results: [] = res.data.results;

	let postalTownResult: any = results.find(
		(result: any) =>
			result.types.find((type: string) => type === "postal_town") !==
			undefined
	);

	if (postalTownResult) {
		return postalTownResult.formatted_address;
	}

	let countryResult: any = results.find(
		(result: any) =>
			result.types.find((type: string) => type === "country") !==
			undefined
	);

	if (countryResult) {
		return countryResult.formatted_address;
	}

	return "Invalid Location";
}

export async function encodeLocation(
	postalTown: string,
	country: string
): Promise<GeoPoint> {
	const api_key = await getMapsApiKey();

	let res = await axios.get(mapsAPIURL, {
		params: {
			address: `${postalTown} ${country}`,
			key: api_key,
		},
	});

	let result = res.data.results[0].geometry.location;

	if (result?.lat && result?.lng) {
		return new GeoPoint(result.lat, result.lng);
	}
	return new GeoPoint(0, 0);
}

async function getMapsApiKey(): Promise<string> {
	let snapshot = await getDoc(doc(getFirestore(), "api_keys", "maps"));
	let data = snapshot.data();
	if (data) {
		return data.key;
	}

	return "";
}

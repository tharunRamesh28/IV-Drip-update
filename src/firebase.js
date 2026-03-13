// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQMVMMla9py6sMF45tGzGjr9AaZlJb7rg",
    authDomain: "new-iv-drip.firebaseapp.com",
    databaseURL: "https://new-iv-drip-default-rtdb.firebaseio.com",
    projectId: "new-iv-drip",
    storageBucket: "new-iv-drip.firebasestorage.app",
    messagingSenderId: "391699284016",
    appId: "1:391699284016:web:f01b3cbc5df8f89cdeedf5",
    measurementId: "G-832PSZD6NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Reference paths (same as ESP32 code)
const volumeRef = ref(database, "IV/volume");
const flowRef = ref(database, "IV/flowrate");

// Ensure the script waits for the DOM to load before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    const volumeElement = document.getElementById("volume");
    const flowElement = document.getElementById("flowrate");

    // Listen for volume updates
    onValue(volumeRef, (snapshot) => {
        const volume = snapshot.val();
        if (volumeElement) {
            volumeElement.innerText = volume + " ml";
        }
        console.log("Volume updated to:", volume);
    });

    // Listen for flow rate updates
    onValue(flowRef, (snapshot) => {
        const flow = snapshot.val();
        if (flowElement) {
            flowElement.innerText = flow + " ml/min";
        }
        console.log("Flow Rate updated to:", flow);
    });
});

export { database };
export default app;
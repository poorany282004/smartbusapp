// Firebase Config (Replace with your real config)
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Initialize Map
let map;
let busMarker;

function initMap() {
    const initialPosition = { lat: 20.5937, lng: 78.9629 }; // Center of India

    map = new google.maps.Map(document.getElementById("map"), {
        center: initialPosition,
        zoom: 5,
    });

    busMarker = new google.maps.Marker({
        position: initialPosition,
        map: map,
        title: "Bus Location",
    });
}

// Update Bus Location and Passenger Count
function updateBusInfo(busData) {
    const { latitude, longitude, passengerCount, busId } = busData;

    const newPos = { lat: latitude, lng: longitude };

    busMarker.setPosition(newPos);
    map.panTo(newPos);

    document.getElementById('bus-id').textContent = busId;
    // Update the UI with live data
    document.getElementById('bus-location').textContent = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    document.getElementById('passenger-count').textContent = passengerCount;

    // Update map position
    const busLocation = new google.maps.LatLng(latitude, longitude);
    busMarker.setPosition(busLocation);
    map.setCenter(busLocation);
}

// Real-Time Listener
function listenToBusUpdates() {
    db.collection('buses').doc('bus001')
        .onSnapshot((doc) => {
            if (doc.exists) {
                updateBusInfo(doc.data());
            }
        });
}

// Emergency Button
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    listenToBusUpdates();

    document.getElementById('report-emergency').addEventListener('click', () => {
        alert('Emergency reported! Authorities will be notified.');
    });
});

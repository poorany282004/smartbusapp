// Firebase Config (Replace with your real config)
const firebaseConfig = {
    apiKey: "AIzaSyCV8AnDq8hyQ25Kuvu1EBqIHiXbE-fsvxk",
    authDomain: "smartbusapp-ed919.firebaseapp.com",
    projectId: "smartbusapp-ed919",
    storageBucket: "smartbusapp-ed919.firebasestorage.app",
    messagingSenderId: "449939813331",
    appId: "1:449939813331:web:7d0dc29c9d1201aed8f526"
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

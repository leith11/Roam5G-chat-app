// ⚠️ IMPORTANTE: Sostituisci i seguenti valori con i tuoi dati Firebase
// 1. Vai su https://console.firebase.google.com
// 2. Crea un nuovo progetto o seleziona uno esistente
// 3. Copia i dati di configurazione dalla sezione "Aggiungi Firebase alla tua app web"

const firebaseConfig = {
    apiKey: "INSERISCI_TUA_API_KEY",
    authDomain: "TUO_PROGETTO.firebaseapp.com",
    databaseURL: "https://TUO_PROGETTO.firebaseio.com",
    projectId: "TUO_PROGETTO",
    storageBucket: "TUO_PROGETTO.appspot.com",
    messagingSenderId: "TUO_MESSAGING_SENDER_ID",
    appId: "TUO_APP_ID"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);

// Riferimenti per Authentication e Realtime Database
const auth = firebase.auth();
const db = firebase.database();

console.log("Firebase inizializzato correttamente!");
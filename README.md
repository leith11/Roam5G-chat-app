## 🚀 Roam5G - Chat e Chiamate

Un'applicazione web moderna per chat e chiamate vocali in tempo reale, costruita con **Firebase** e **Realtime Database**.

### ✨ Caratteristiche

- ✅ **Autenticazione SMS** - Accedi con il tuo numero di telefono
- 💬 **Chat in Tempo Reale** - Messaggi istantanei con Firebase Realtime Database
- 📞 **Chiamate Vocali** - Sistema di chiamate integrate (setup audio richiesto)
- 👤 **Profilo Personalizzato** - Nome e foto profilo
- 📱 **Design Mobile-First** - Interfaccia ottimizzata per dispositivi mobili
- 🌙 **Tema Scuro** - Design elegante ispirato a WhatsApp
- 📋 **Registro Chiamate** - Storico delle chiamate ricevute e effettuate
- 🔔 **Notifiche di Chiamata** - Popup per le chiamate in arrivo

### 🔧 Setup e Installazione

#### 1. Configurazione Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com)
2. Crea un nuovo progetto
3. Abilita **Authentication** con SMS
4. Abilita **Realtime Database**
5. Copia i dati di configurazione

#### 2. Configura il file `firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### 3. Regole Realtime Database

Aggiungi queste regole nel Firebase Console:

```json
{
  "rules": {
    "private_chat_{number1}_{number2}": {
      ".read": "auth != null",
      ".write": "auth != null",
      "messages": {
        ".indexOn": "time"
      },
      "call": {
        ".indexOn": "time"
      }
    }
  }
}
```

#### 4. Avvia l'Applicazione

```bash
# Apri il file index.html nel browser
# Oppure usa un server locale
python -m http.server 8000
```

Visita `http://localhost:8000` nel tuo browser.

### 📋 Flusso Utente

1. **Login** - Inserisci il tuo numero di telefono
2. **Verifica** - Inserisci il codice ricevuto via SMS
3. **Profilo** - Personalizza nome e foto
4. **Home** - Visualizza le tue chat
5. **Nuova Chat** - Clicca il bottone `+` per iniziare una chat
6. **Messaggi** - Invia e ricevi messaggi in tempo reale
7. **Chiamate** - Chiama i tuoi contatti direttamente dalla chat

### 📁 Struttura File

```
roam5g-chat-app/
├── index.html           # File HTML principale
├── styles.css          # Stili CSS
├── app.js              # Logica applicazione
├── firebase-config.js  # Configurazione Firebase
└── README.md           # Questo file
```

### 🔐 Sicurezza

- ✅ Autenticazione tramite SMS
- ✅ Accesso limitato alle proprie chat
- ✅ Dati salvati in Realtime Database protetto
- ⚠️ Non salvare la API Key nel codice pubblico

### 🛠️ Tecnologie Utilizzate

- **Firebase Authentication** - Autenticazione SMS
- **Firebase Realtime Database** - Messaggi e chiamate
- **HTML5/CSS3** - UI responsiva
- **JavaScript Vanilla** - Logica applicazione

### 📝 Funzionalità Pianificate

- [ ] Audio WebRTC per le chiamate
- [ ] Gruppi chat
- [ ] Foto e file multimediali
- [ ] Crittografia end-to-end
- [ ] App mobile nativa

### 🐛 Risoluzione Problemi

**Problema**: "Firebase non è definito"
- **Soluzione**: Verifica che gli script di Firebase siano caricati correttamente in `index.html`

**Problema**: "Numero non valido"
- **Soluzione**: Assicurati di inserire un numero di almeno 4 cifre

**Problema**: "I messaggi non appaiono"
- **Soluzione**: Verifica le regole Realtime Database e che l'autenticazione sia corretta

### 📧 Contatti e Supporto

Per domande o segnalazioni, contatta: support@roam5g.dev

### 📄 Licenza

MIT License - Vedi LICENSE.md per i dettagli

---

**Nota**: Questa è una versione beta. Le funzionalità di audio/video per le chiamate richiedono una configurazione aggiuntiva con WebRTC.
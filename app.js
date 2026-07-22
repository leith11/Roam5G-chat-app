// ===== VARIABILI GLOBALI =====
let myFullNumber = "";
let chatRoomId = "";
let currentTargetNumber = "";
let confirmationResultObj = null;
let myDisplayName = "";
let myProfilePic = "";
let callInProgress = false;
let incomingCallData = null;
let callLogs = [];

// ===== INIZIALIZZAZIONE =====
window.onload = function() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': () => sendOTP()
    });
    loadCallLogs();
};

// ===== FUNZIONI UI =====
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
}

function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).style.display = 'flex';
}

// ===== AUTENTICAZIONE =====
function sendOTP() {
    const prefix = document.getElementById('myPrefix').value;
    const num = document.getElementById('myPhone').value.trim();
    
    if (num.length < 4) {
        alert('Inserisci un numero valido!');
        return;
    }

    myFullNumber = prefix + num;
    myDisplayName = myFullNumber;

    auth.signInWithPhoneNumber(myFullNumber, window.recaptchaVerifier)
        .then((result) => {
            confirmationResultObj = result;
            showScreen('verify-screen');
        })
        .catch((err) => {
            alert('Errore: ' + err.message);
        });
}

function verifyOTP() {
    const code = document.getElementById('otpCode').value.trim();
    
    if (code.length !== 6) {
        alert('Inserisci 6 cifre!');
        return;
    }

    confirmationResultObj.confirm(code)
        .then(() => {
            showScreen('profile-screen');
        })
        .catch(() => {
            alert('Codice errato!');
        });
}

function saveProfile() {
    const name = document.getElementById('profileNameInput').value.trim();
    const pic = document.getElementById('profilePicInput').value.trim();
    
    if (name) myDisplayName = name;
    if (pic) {
        myProfilePic = pic;
        document.getElementById('headerPic').src = pic;
        document.getElementById('headerPic').style.display = 'block';
    }
    
    showHomeScreen();
}

// ===== SCHERMATE PRINCIPALI =====
function showHomeScreen() {
    hideAllScreens();
    document.getElementById('home-screen').style.display = 'flex';
    document.getElementById('bottomNav').style.display = 'flex';
    document.getElementById('headerTitleText').innerText = "Roam5G";
    loadChatList();
}

function openTargetModal() {
    showScreen('target-screen');
}

function openProfileModal() {
    showScreen('profile-screen');
    document.getElementById('profileNameInput').value = myDisplayName;
    document.getElementById('profilePicInput').value = myProfilePic;
}

// ===== CHAT =====
function startChatRoom() {
    const prefix = document.getElementById('targetPrefix').value;
    const num = document.getElementById('targetPhone').value.trim();
    
    if (num.length < 4) {
        alert('Numero non valido!');
        return;
    }

    currentTargetNumber = prefix + num;
    const numbers = [myFullNumber, currentTargetNumber].sort();
    chatRoomId = "private_chat_" + 
        numbers[0].replace(/[^0-9]/g, '') + "_" + 
        numbers[1].replace(/[^0-9]/g, '');

    hideAllScreens();
    document.getElementById('chat-screen').style.display = 'flex';
    document.getElementById('bottomNav').style.display = 'flex';
    document.getElementById('chatHeaderName').innerText = currentTargetNumber;
    
    document.getElementById('chat').innerHTML = '';
    loadMessages();
    listenForCalls();
    addChatToHomeList(currentTargetNumber);
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !chatRoomId) return;

    db.ref(chatRoomId + '/messages/').push({
        senderPhone: myFullNumber,
        senderName: myDisplayName,
        text: text,
        time: Date.now()
    });

    input.value = '';
}

function loadMessages() {
    db.ref(chatRoomId + '/messages/').off();
    db.ref(chatRoomId + '/messages/').on('child_added', (snapshot) => {
        const data = snapshot.val();
        const chat = document.getElementById('chat');
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(data.senderPhone === myFullNumber ? 'sent' : 'received');

        msgDiv.innerHTML = `<span class="sender-tag">${data.senderName || data.senderPhone}</span>${escapeHtml(data.text)}`;
        chat.appendChild(msgDiv);
        chat.scrollTop = chat.scrollHeight;
    });
}

function loadChatList() {
    const list = document.getElementById('chatsList');
    list.innerHTML = '';
    
    if (callLogs.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; color: #8696a0; padding: 40px 20px;">
                Nessuna conversazione ancora.<br>Tocca il pulsante <b>+</b> in basso per iniziare!
            </div>
        `;
    } else {
        const uniqueContacts = [...new Set(callLogs.map(log => log.contact))];
        uniqueContacts.forEach(contact => {
            addChatToList(contact);
        });
    }
}

function addChatToHomeList(targetNumber) {
    const item = document.createElement('div');
    item.className = 'chat-list-item';
    item.onclick = () => {
        currentTargetNumber = targetNumber;
        const numbers = [myFullNumber, currentTargetNumber].sort();
        chatRoomId = "private_chat_" + 
            numbers[0].replace(/[^0-9]/g, '') + "_" + 
            numbers[1].replace(/[^0-9]/g, '');
        
        hideAllScreens();
        document.getElementById('chat-screen').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
        document.getElementById('chatHeaderName').innerText = currentTargetNumber;
        document.getElementById('chat').innerHTML = '';
        loadMessages();
        listenForCalls();
    };
    
    item.innerHTML = `
        <div class="chat-avatar">${targetNumber.charAt(0)}</div>
        <div class="chat-info">
            <div class="chat-name">${targetNumber}</div>
            <div class="chat-last-msg">Tocca per aprire la chat</div>
        </div>
    `;
    
    const list = document.getElementById('chatsList');
    list.prepend(item);
}

function addChatToList(targetNumber) {
    const item = document.createElement('div');
    item.className = 'chat-list-item';
    item.onclick = () => {
        currentTargetNumber = targetNumber;
        const numbers = [myFullNumber, currentTargetNumber].sort();
        chatRoomId = "private_chat_" + 
            numbers[0].replace(/[^0-9]/g, '') + "_" + 
            numbers[1].replace(/[^0-9]/g, '');
        
        hideAllScreens();
        document.getElementById('chat-screen').style.display = 'flex';
        document.getElementById('bottomNav').style.display = 'flex';
        document.getElementById('chatHeaderName').innerText = currentTargetNumber;
        document.getElementById('chat').innerHTML = '';
        loadMessages();
        listenForCalls();
    };
    
    item.innerHTML = `
        <div class="chat-avatar">${targetNumber.charAt(0)}</div>
        <div class="chat-info">
            <div class="chat-name">${targetNumber}</div>
            <div class="chat-last-msg">Tocca per aprire la chat</div>
        </div>
    `;
    
    const list = document.getElementById('chatsList');
    list.appendChild(item);
}

// ===== CHIAMATE =====
function startCall() {
    if (!currentTargetNumber || !chatRoomId) {
        alert('Errore: seleziona un contatto');
        return;
    }

    db.ref(chatRoomId + '/call/').set({
        caller: myFullNumber,
        callerName: myDisplayName,
        receiver: currentTargetNumber,
        status: 'ringing',
        time: Date.now()
    });

    callInProgress = true;
    hideAllScreens();
    document.getElementById('call-screen').style.display = 'flex';
    document.getElementById('callTargetTitle').innerText = "Chiamata in uscita";
    document.getElementById('callTargetPhone').innerText = currentTargetNumber;
    document.getElementById('callStatusText').innerText = "Squillo...";
    document.getElementById('acceptCallBtn').style.display = 'none';

    // Salva il log della chiamata
    addCallLog({
        contact: currentTargetNumber,
        type: 'outgoing',
        time: new Date().toLocaleTimeString('it-IT')
    });
}

function listenForCalls() {
    db.ref(chatRoomId + '/call/').on('value', (snapshot) => {
        const callData = snapshot.val();
        const ringtone = document.getElementById('ringtone');

        if (!callData) {
            ringtone.pause();
            return;
        }

        if (callData.status === 'ringing' && callData.caller !== myFullNumber) {
            // Chiamata in arrivo
            incomingCallData = callData;
            showIncomingCallBanner(callData.callerName || callData.caller);
            ringtone.play();
            document.getElementById('acceptCallBtn').style.display = 'block';
        } else if (callData.status === 'accepted') {
            ringtone.pause();
            document.getElementById('callStatusText').innerText = "In chiamata...";
        } else if (callData.status === 'ended' || !callData.status) {
            ringtone.pause();
            if (callInProgress) {
                endCall();
            }
        }
    });
}

function showIncomingCallBanner(callerName) {
    document.getElementById('bannerCallerName').innerText = callerName;
    document.getElementById('incoming-call-banner').classList.add('show');
}

function hideIncomingCallBanner() {
    document.getElementById('incoming-call-banner').classList.remove('show');
}

function acceptIncomingCall() {
    if (!incomingCallData || !chatRoomId) return;

    hideIncomingCallBanner();
    document.getElementById('ringtone').pause();

    db.ref(chatRoomId + '/call/').update({
        status: 'accepted'
    });

    hideAllScreens();
    document.getElementById('call-screen').style.display = 'flex';
    document.getElementById('callTargetTitle').innerText = "Chiamata in arrivo";
    document.getElementById('callTargetPhone').innerText = incomingCallData.callerName || incomingCallData.caller;
    document.getElementById('callStatusText').innerText = "In chiamata...";
    document.getElementById('acceptCallBtn').style.display = 'none';

    callInProgress = true;

    // Salva il log della chiamata
    addCallLog({
        contact: incomingCallData.caller,
        type: 'incoming',
        time: new Date().toLocaleTimeString('it-IT')
    });
}

function rejectIncomingCall() {
    if (!chatRoomId) return;

    hideIncomingCallBanner();
    document.getElementById('ringtone').pause();

    db.ref(chatRoomId + '/call/').update({
        status: 'rejected'
    });
}

function acceptCall() {
    if (!chatRoomId) return;

    db.ref(chatRoomId + '/call/').update({
        status: 'accepted'
    });

    document.getElementById('callStatusText').innerText = "In chiamata...";
    document.getElementById('acceptCallBtn').style.display = 'none';
}

function endCall() {
    if (!chatRoomId) return;

    db.ref(chatRoomId + '/call/').set(null);
    
    callInProgress = false;
    hideAllScreens();
    document.getElementById('chat-screen').style.display = 'flex';
    document.getElementById('bottomNav').style.display = 'flex';
}

// ===== REGISTRO CHIAMATE =====
function addCallLog(logEntry) {
    callLogs.push(logEntry);
    saveCallLogs();
}

function saveCallLogs() {
    localStorage.setItem('roam5g_call_logs', JSON.stringify(callLogs));
}

function loadCallLogs() {
    const saved = localStorage.getItem('roam5g_call_logs');
    if (saved) {
        callLogs = JSON.parse(saved);
    }
}

function showCallLog() {
    hideAllScreens();
    
    const logScreen = document.createElement('div');
    logScreen.id = 'call-log-screen';
    logScreen.className = 'screen';
    
    if (callLogs.length === 0) {
        logScreen.innerHTML = `
            <div style="text-align: center; color: #8696a0; padding: 40px 20px;">
                Nessuna chiamata nel registro.
            </div>
        `;
    } else {
        let html = '';
        callLogs.forEach((log, index) => {
            const icon = log.type === 'incoming' ? '📥' : '📤';
            html += `
                <div class="call-log-item">
                    <div class="call-log-avatar">${log.contact.charAt(0)}</div>
                    <div class="call-log-info">
                        <div class="call-log-name">${log.contact}</div>
                        <div class="call-log-time">${log.time}</div>
                    </div>
                    <span class="call-log-type">${icon}</span>
                </div>
            `;
        });
        logScreen.innerHTML = html;
    }
    
    const homeScreen = document.getElementById('home-screen');
    if (logScreen.parentNode) {
        logScreen.parentNode.removeChild(logScreen);
    }
    document.body.insertBefore(logScreen, document.getElementById('bottomNav'));
    logScreen.style.display = 'flex';
}

// ===== UTILITY =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
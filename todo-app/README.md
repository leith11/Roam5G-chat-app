# 📝 TodoList - Gestione Attività

Un'applicazione web moderna e intuitiva per gestire le tue attività quotidiane con salvataggio automatico su Local Storage.

## ✨ Caratteristiche

- ✅ **Aggiunta Attività** - Aggiungi nuove attività in pochi secondi
- ✔️ **Segna Completata** - Marca le attività come completate
- ✏️ **Modifica Attività** - Modifica il testo di qualsiasi attività
- 🗑️ **Elimina Attività** - Rimuovi le attività indesiderate
- 🔍 **Filtri Intelligenti** - Visualizza tutte, attive o completate
- 📊 **Statistiche in Tempo Reale** - Conta totale, completate e rimaste
- 💾 **Local Storage** - Salvataggio automatico sul browser
- 📥 **Esporta in JSON** - Scarica le tue attività come backup
- 📤 **Importa da JSON** - Ripristina attività da un file
- 📱 **Responsive Design** - Perfetto su qualsiasi dispositivo
- 🎨 **Interfaccia Moderna** - Design pulito e intuitivo

## 🚀 Come Usare

### Aggiungere un'Attività
1. Scrivi il testo nella casella di input
2. Premi il bottone "Aggiungi" o premi Enter
3. L'attività appare nella lista

### Completare un'Attività
- Clicca la checkbox accanto all'attività
- Il testo si barrerà automaticamente
- La statistica "Completate" si aggiorna

### Modificare un'Attività
1. Clicca il bottone "Modifica" accanto all'attività
2. Modifica il testo nella finestra di dialogo
3. Clicca "Salva" o premi Enter

### Eliminare un'Attività
1. Clicca il bottone "Elimina" accanto all'attività
2. Conferma l'eliminazione
3. L'attività viene rimossa

### Usare i Filtri
- **Tutte**: Mostra tutte le attività
- **Attive**: Mostra solo le attività non completate
- **Completate**: Mostra solo le attività completate

### Cancellare Tutte le Completate
- Clicca "Elimina Completate"
- Tutte le attività completate verranno rimosse

### Esportare le Attività
1. Clicca "Esporta"
2. Viene scaricato un file JSON con tutte le attività
3. Usa questo file come backup

### Importare le Attività
1. Clicca "Importa"
2. Seleziona un file JSON precedentemente esportato
3. Scegli se sostituire o unire le attività
4. Le attività vengono ripristinate

## 💾 Local Storage

L'app salva automaticamente tutte le attività nel Local Storage del browser:
- ✅ I dati persistono tra i refresh della pagina
- ✅ I dati rimangono finché non cancelli i dati del browser
- ✅ Non richiede connessione internet
- ⚠️ I dati sono specifici per browser/dispositivo

## 📊 Struttura dei Dati

Ogni attività è memorizzata come oggetto JSON:

```json
{
  "id": 1234567890,
  "text": "Acquistare latte",
  "completed": false,
  "createdAt": "22/07/2024 15:30:45"
}
```

## 🎨 Customizzazione

Puoi personalizzare i colori modificando le variabili CSS in `styles.css`:

```css
:root {
    --primary-color: #4f46e5;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... altri colori ... */
}
```

## 📱 Responsive Design

L'app si adatta perfettamente a:
- 📱 Smartphone (320px e oltre)
- 📱 Tablet (768px e oltre)
- 💻 Desktop (1024px e oltre)

## 🔒 Privacy

- ✅ Nessun dato inviato a server
- ✅ Tutti i dati rimangono locali
- ✅ Nessun tracciamento
- ✅ Nessuna pubblicità

## 📝 Note

- Le attività sono ordinate da più recente a più vecchia
- Il timestamp viene creato al momento dell'aggiunta
- Il timestamp rimane lo stesso anche dopo la modifica dell'attività
- I filtri non eliminano nulla, solo nascondono le attività

## 🌟 Suggerimenti

1. **Backup Regolare**: Esporta periodicamente le tue attività
2. **Pulizia**: Elimina le attività completate per mantenere la lista pulita
3. **Sync**: Usa l'esportazione/importazione per sincronizzare tra dispositivi
4. **Organizzazione**: Usa nomi descrittivi per le attività

## 🐛 Troubleshooting

**Problema**: Le attività scompaiono dopo aver chiuso il browser
- **Soluzione**: Verifica che i cookie e il Local Storage siano abilitati

**Problema**: L'importazione non funziona
- **Soluzione**: Assicurati che il file sia un JSON valido esportato da questa app

**Problema**: Non riesco a modificare un'attività
- **Soluzione**: Chiudi la finestra di dialogo e riprova

## 📄 Licenza

MIT License - Libero per uso personale e commerciale

---

**Versione**: 1.0.0  
**Ultima Aggiornamento**: Luglio 2024  
**Autore**: TodoList App Team
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Path per salvare i dati utenti
const USERS_FILE = path.join(__dirname, 'data/users.json');

// Funzione per leggere/scrivere utenti
function getUsers() {
    if (!fs.existsSync(USERS_FILE)) return {};
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUser(id, username) {
    const users = getUsers();
    if (!users[id]) {
        users[id] = { username, points: 0, referrals: 0, tasks: [] };
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return users[id];
}

// Rotte principali
app.get('/', (req, res) => {
    const { id, username } = req.query;
    if (!id || !username) {
        return res.send("Errore: ID e Username non forniti!");
    }
    const user = saveUser(id, username);
    res.render('home', { user });
});

app.get('/tasks', (req, res) => {
    const { id } = req.query;
    const users = getUsers();
    if (!id || !users[id]) return res.send("Errore: Utente non trovato!");
    res.render('tasks', { user: users[id] });
});

app.get('/referral', (req, res) => {
    const { id } = req.query;
    const users = getUsers();
    if (!id || !users[id]) return res.send("Errore: Utente non trovato!");
    res.render('referral', { user: users[id] });
});

app.get('/airdrop', (req, res) => {
    res.render('airdrop');
});

// Server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

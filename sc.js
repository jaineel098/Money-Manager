const MASTER_USER = "Js";
const MASTER_PASS = "9815";

let db = JSON.parse(localStorage.getItem("moneyDB") || "{}");
function saveDB(){ localStorage.setItem("moneyDB", JSON.stringify(db)); }

let currentUser = "";
let currentCurrency = "₹";

// LOGIN
function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (user === MASTER_USER && pass === MASTER_PASS) {
    currentUser = "MASTER";
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("masterDash").style.display = "block";
    loadUsers();
    return;
  }

  if (db[user] && db[user].password === pass) {
    currentUser = user;
    currentCurrency = db[user].currency;
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("userDash").style.display = "block";
    renderRecords();
    return;
  }

  alert("Incorrect username or password");
}

// ADD USER
function addUser() {
  let u = newUser.value.trim();
  let p = newUserPass.value.trim();
  let c = newCurrency.value;

  if (!u || !p) return alert("Fill all fields");

  db[u] = { password: p, currency: c, records: [] };
  saveDB();
  loadUsers();
}

// LIST USERS (MASTER)
function loadUsers() {
  let area = document.getElementById("userList");
  area.innerHTML = "";

  Object.keys(db).forEach(name => {
    let div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <b>${name}</b>
      <button class="btn red" onclick="deleteAccount('${name}')">Delete</button>
    `;
    area.appendChild(div);
  });
}

// DELETE ACCOUNT
function deleteAccount(name) {
  if (confirm(`Delete ${name}?`)) {
    delete db[name];
    saveDB();
    loadUsers();
  }
}

// ADD RECORD
document.getElementById("recordForm").addEventListener("submit", e => {
  e.preventDefault();

  let type = document.getElementById("type").value;
  let desc = document.getElementById("description").value.trim();
  let amount = parseFloat(document.getElementById("amount").value);

  if (!desc || !amount) return;

  db[currentUser].records.push({ type, desc, amount });
  saveDB();
  renderRecords();
});

// SHOW RECORDS
function renderRecords() {
  let tbody = document.querySelector("#recordsTable tbody");
  tbody.innerHTML = "";

  db[currentUser].records.forEach((rec, i) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${rec.type}</td>
      <td>${rec.desc}</td>
      <td>${currentCurrency}${rec.amount}</td>
      <td><button class="btn red" onclick="deleteRecord(${i})">X</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deleteRecord(i) {
  db[currentUser].records.splice(i, 1);
  saveDB();
  renderRecords();
}

// LOGOUT
function logout() {
  location.reload();
}

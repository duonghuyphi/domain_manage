// Firebase SDK (v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ⚠️ Thay đoạn config này bằng config của bạn trong Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCCr9u62qYHE5n7pmZdwsZ_wZFf_a_7KR0",
  authDomain: "domain-manager-thtmmo.firebaseapp.com",
  projectId: "domain-manager-thtmmo",
  storageBucket: "domain-manager-thtmmo.firebasestorage.app",
  messagingSenderId: "460456938465",
  appId: "1:460456938465:web:ec7261be05ff73210c20a0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const domainCollection = collection(db, "domains");

// DOM Elements
const form = document.getElementById("domainForm");
const domainInput = document.getElementById("domain");
const imageInput = document.getElementById("image");
const tableBody = document.getElementById("domainTableBody");

// Add domain
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const domain = domainInput.value.trim();
  const image = imageInput.value.trim();

  if (!domain || !image) return;

  await addDoc(domainCollection, { domain, image });
  domainInput.value = "";
  imageInput.value = "";
  loadDomains();
});

// Load and display domains
async function loadDomains() {
  const snapshot = await getDocs(domainCollection);
  tableBody.innerHTML = "";
  let stt = 1;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${stt++}</td>
      <td>${data.domain}</td>
      <td><img src="${data.image}" alt="logo" style="height:30px;" /></td>
      <td>
        <button onclick="deleteDomain('${docSnap.id}')">Xoá</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

window.deleteDomain = async (id) => {
  if (confirm("Bạn có chắc muốn xoá domain này không?")) {
    await deleteDoc(doc(domainCollection, id));
    loadDomains();
  }
};

// Initial load
loadDomains();

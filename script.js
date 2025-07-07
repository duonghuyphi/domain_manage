// Firebase SDK (v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
const tableBody = document.getElementById("domainTableBody");

// Add domain
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const domain = domainInput.value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!domain) return;

  await addDoc(domainCollection, { domain, comment, createdAt: new Date() });
  domainInput.value = "";
  document.getElementById("comment").value = "";
  loadDomains();
});

// Load and display domains
async function loadDomains() {
  const q = query(domainCollection, orderBy("createdAt"));
  const snapshot = await getDocs(q);

  tableBody.innerHTML = "";
  let stt = 1;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const safeLink = data.domain.startsWith("http")
      ? data.domain
      : `https://${data.domain}`;
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${stt++}</td>
    <td><input id="domain-${docSnap.id}" value="${
      data.domain
    }" /><a href="${safeLink}" target="_blank">${data.domain}</a></td>
    <td>
        <input id="comment-${docSnap.id}" value="${data.comment || ""}" />
    </td>
    <td>
        <button onclick="updateDomain('${docSnap.id}')">Lưu</button>
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

window.updateComment = async (id) => {
  const input = document.getElementById(`comment-${id}`);
  const newComment = input.value.trim();

  const ref = doc(domainCollection, id);
  await updateDoc(ref, { comment: newComment });

  alert("Đã cập nhật ghi chú!");
};

window.updateDomain = async (id) => {
  const domain = document.getElementById(`domain-${id}`).value.trim();
  const comment = document.getElementById(`comment-${id}`).value.trim();

  if (!domain) {
    alert("Tên miền và hình ảnh không được để trống.");
    return;
  }

  const ref = doc(domainCollection, id);
  await updateDoc(ref, { domain, comment });

  alert("Đã cập nhật thành công!");
  loadDomains();
};

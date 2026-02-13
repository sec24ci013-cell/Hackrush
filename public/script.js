/* =========================
   LOAD EXPENSE SUMMARY
========================= */
async function loadSummary() {
  const res = await fetch("/summary");
  const summary = await res.json();

  const list = document.getElementById("summaryList");
  list.innerHTML = "";

  for (const [buyer, total] of Object.entries(summary)) {
    const li = document.createElement("li");
    li.textContent = `${buyer} spent ₹${total}`;
    list.appendChild(li);
  }
}


/* =========================
   LOAD FAMILY EXPENSE
========================= */
async function loadFamilyExpense() {
  const res = await fetch("/family-expense");
  const data = await res.json();

  document.getElementById("familyExpense").innerHTML = `
    <p>Total Spent: ₹${data.totalSpent}</p>
    <p>Budget: ₹${data.budget}</p>
    <p>Remaining: ₹${data.remaining}</p>
    <p>Status: ${data.status}</p>
  `;
}


/* =========================
   SET BUDGET
========================= */
async function setBudget() {
  const budget = parseFloat(document.getElementById("budgetInput").value);

  if (!budget || budget <= 0) {
    alert("Enter valid budget");
    return;
  }

  await fetch("/set-budget", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ budget })
  });

  document.getElementById("budgetInput").value = "";

  await loadFamilyExpense();
}


/* =========================
   ADD REQUEST
========================= */
async function addRequest() {
  const name = document.getElementById("requestName").value;
  const quantity = document.getElementById("requestQuantity").value;

  if (!name || !quantity) {
    alert("Enter name and quantity");
    return;
  }

  await fetch("/add-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantity })
  });

  document.getElementById("requestName").value = "";
  document.getElementById("requestQuantity").value = "";

  await loadRequests();
}


/* =========================
   PURCHASE DIRECTLY
========================= */
async function purchaseRequest(name) {

  const buyer = prompt("Enter your name:");
  if (!buyer) return;

  const price = parseFloat(prompt("Enter price:"));
  if (!price) return;

  await fetch("/purchase-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, buyer, price })
  });

  // refresh everything
  await loadRequests();
  await loadSummary();
  await loadFamilyExpense();
}


/* =========================
   LOAD REQUESTS
========================= */
async function loadRequests() {
  const res = await fetch("/requests");
  const requests = await res.json();

  const list = document.getElementById("requestList");
  list.innerHTML = "";

  requests.forEach(r => {
    const li = document.createElement("li");

    li.textContent = `${r.name} (Qty: ${r.quantity})`;

    const btn = document.createElement("button");
    btn.textContent = "Purchase";
    btn.onclick = () => purchaseRequest(r.name);

    li.appendChild(btn);

    list.appendChild(li);
  });
}


/* =========================
   INITIAL LOAD
========================= */
loadSummary();
loadFamilyExpense();
loadRequests();

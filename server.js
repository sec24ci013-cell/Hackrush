const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


/* =========================
   In-memory storage
========================= */
let expenses = [];
let requests = [];
let familyBudget = 0;


/* =========================
   EXPENSE SUMMARY
========================= */
app.get("/summary", (req, res) => {
  const summary = {};

  expenses.forEach(e => {
    summary[e.buyer] = (summary[e.buyer] || 0) + e.price;
  });

  res.json(summary);
});


/* =========================
   FAMILY EXPENSE + BUDGET
========================= */
app.get("/family-expense", (req, res) => {
  const total = expenses.reduce((acc, e) => acc + e.price, 0);
  const remaining = familyBudget - total;

  res.json({
    totalSpent: total,
    budget: familyBudget,
    remaining,
    status:
      familyBudget === 0
        ? "Budget not set"
        : remaining >= 0
        ? "Within Budget"
        : "Over Budget"
  });
});


/* =========================
   SET BUDGET
========================= */
app.post("/set-budget", (req, res) => {
  const { budget } = req.body;

  if (!budget || budget <= 0)
    return res.status(400).json({ error: "Invalid budget value" });

  familyBudget = Number(budget);

  res.json({ success: true });
});


/* =========================
   ADD REQUEST
========================= */
app.post("/add-request", (req, res) => {
  const { name, quantity } = req.body;

  if (!name || !quantity)
    return res.status(400).json({ error: "Missing fields" });

  requests.push({
    name,
    quantity
  });

  res.json({ success: true });
});


/* =========================
   GET REQUESTS
========================= */
app.get("/requests", (req, res) => {
  res.json(requests);
});


/* =========================
   PURCHASE REQUEST (NEW)
   ⭐ removes from list
   ⭐ adds to expenses
========================= */
app.post("/purchase-request", (req, res) => {
  const { name, buyer, price } = req.body;

  const index = requests.findIndex(r => r.name === name);

  if (index === -1)
    return res.status(404).json({ error: "Request not found" });

  // remove item from request list
  requests.splice(index, 1);

  // add expense
  expenses.push({
    buyer,
    price: Number(price)
  });

  res.json({ success: true });
});


/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const recipeRef = collection(db, "recipes");

const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("searchInput");
const saveBtn = document.getElementById("saveBtn");

const modal = document.getElementById("recipeModal");
const modalTitle = document.getElementById("modalTitle");
const modalIngredients = document.getElementById("modalIngredients");
const modalSteps = document.getElementById("modalSteps");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

let allRecipes = [];

// ➕ Add Recipe
saveBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const steps = document.getElementById("steps").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!name || !ingredients || !steps || !imageFile) {
    alert("All fields required");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    await addDoc(recipeRef, {
      name,
      ingredients,
      steps,
      imageBase64: reader.result,
      createdAt: Date.now()
    });
    loadRecipes();
  };
  reader.readAsDataURL(imageFile);
});

// 📥 Load Recipes
async function loadRecipes() {
  const snapshot = await getDocs(recipeRef);
  allRecipes = [];
  snapshot.forEach(doc => allRecipes.push(doc.data()));
  renderRecipes(allRecipes);
}

// 🧩 Render Cards (NO INLINE JS)
function renderRecipes(recipes) {
  recipeList.innerHTML = "";

  recipes.forEach(r => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const img = document.createElement("img");
    img.src = r.imageBase64;

    const title = document.createElement("h3");
    title.innerText = r.name;

    const btn = document.createElement("button");
    btn.className = "view-btn";
    btn.innerText = "View Recipe";

    btn.addEventListener("click", () => {
      openModal(r);
    });

    card.append(img, title, btn);
    recipeList.appendChild(card);
  });
}

// 🔍 Search
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  const filtered = allRecipes.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.ingredients.toLowerCase().includes(q)
  );
  renderRecipes(filtered);
});

// 🪟 Modal
function openModal(recipe) {
  modal.style.display = "block";
  modalTitle.innerText = recipe.name;
  modalIngredients.innerText = recipe.ingredients;
  modalSteps.innerText = recipe.steps;
  modalImg.src = recipe.imageBase64;
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

loadRecipes();

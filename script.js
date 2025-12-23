import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const recipeRef = collection(db, "recipes");
const recipeList = document.getElementById("recipeList");

// ADD RECIPE
window.addRecipe = async function () {
  const name = document.getElementById("name").value;
  const ingredients = document.getElementById("ingredients").value;
  const steps = document.getElementById("steps").value;
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
};

// LOAD RECIPES (SAFE VERSION)
async function loadRecipes() {
  const snapshot = await getDocs(recipeRef);
  recipeList.innerHTML = "";

  snapshot.forEach(doc => {
    const r = doc.data();

    const card = document.createElement("div");
    card.className = "recipe-card";

    const img = document.createElement("img");
    img.src = r.imageBase64;

    const title = document.createElement("h3");
    title.innerText = r.name;

    const btn = document.createElement("button");
    btn.className = "view-btn";
    btn.innerText = "View Recipe";

    // ✅ SAFE EVENT HANDLER
    btn.addEventListener("click", () => {
      openModal(r.name, r.ingredients, r.steps, r.imageBase64);
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(btn);

    recipeList.appendChild(card);
  });
}

loadRecipes();

// MODAL FUNCTIONS
window.openModal = function (name, ingredients, steps, image) {
  recipeModal.style.display = "block";
  modalTitle.innerText = name;
  modalIngredients.innerText = ingredients;
  modalSteps.innerText = steps;
  modalImg.src = image;
};

window.closeModal = function () {
  recipeModal.style.display = "none";
};

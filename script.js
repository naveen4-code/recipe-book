import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const recipeRef = collection(db, "recipes");

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

async function loadRecipes() {
  const snapshot = await getDocs(recipeRef);
  recipeList.innerHTML = "";

  snapshot.forEach(doc => {
    const r = doc.data();

    recipeList.innerHTML += `
      <div class="recipe-card">
        <img src="${r.imageBase64}">
        <h3>${r.name}</h3>
        <button class="view-btn"
          onclick="openModal(
            '${r.name}',
            '${r.ingredients.replace(/'/g, "\\'")}',
            '${r.steps.replace(/'/g, "\\'")}',
            '${r.imageBase64}'
          )">
          View Recipe
        </button>
      </div>
    `;
  });
}


loadRecipes();
window.openModal = function(name, ingredients, steps, image) {
  recipeModal.style.display = "block";
  modalTitle.innerText = name;
  modalIngredients.innerText = ingredients;
  modalSteps.innerText = steps;
  modalImg.src = image;
};

window.closeModal = function() {
  recipeModal.style.display = "none";
};

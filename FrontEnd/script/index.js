// VARIABLES GLOBALES

const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");
let listWorks = [];

// GESTION DE LA PARTIE WORKS

async function recupererWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  listWorks = await response.json();
  return listWorks;
}

async function displayWorks(worksToShow = listWorks) {
  gallery.innerHTML = "";
  worksToShow.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// GESTION DE LA PARTIE CATEGORIES

async function recupererCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

async function displayCategoriesBtn() {
  const buttonAll = document.createElement("button");
  buttonAll.classList = "button-filters";
  buttonAll.textContent = "Tous";
  buttonAll.id = "0";
  filtersContainer.appendChild(buttonAll);
  const arrayCategories = await recupererCategories();
  arrayCategories.forEach((category) => {
    const button = document.createElement("button");
    button.classList = "button-filters";
    button.textContent = category.name;
    button.id = category.id;
    filtersContainer.appendChild(button);
  });
}

//GESTION FILTRAGE DES CATEGORIES

async function initFilterButtons() {
  const buttons = document.querySelectorAll(".button-filters");
  buttons.forEach((button) => {
    if (button.id === "0") {
      buttonSelected(button);
    }
    button.addEventListener("click", (event) => {
      let galleryFiltered;
      const buttonId = event.target.id;
      if (buttonId !== "0") {
        galleryFiltered = listWorks.filter((work) => {
          return work.category.id === parseInt(buttonId);
        });
      } else {
        // Si le bouton "Tous" est cliqué, affiche toutes les WORKS
        galleryFiltered = listWorks;
      }
      handleActiveButton(button);
      
      displayWorks(galleryFiltered);
    });
  });
}

async function handleActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".button-filters");
  buttons.forEach((button) => {
    if (activeButton === button) {
      buttonSelected(button);
    }
    else {
      buttonUnselected(button);
    }
  });
}

// GESTION DU BOUTON "TOUS" 

function buttonSelected(element) {
  element.classList.add("selected");
}

function buttonUnselected(element) {
  element.classList.remove("selected");
}

// FONCTION D'INITIALISATION

async function initializePage() {
  await recupererWorks();
  await displayCategoriesBtn();
  await initFilterButtons();
  await displayWorks();
}

initializePage();

// GESTION DE LA CONNEXION/DECONNEXION

document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector('nav ul li:nth-child(3)');

  updateLoginLink();

  function updateLoginLink() {
    const userIsLogged = checkLoginStatus();
    if (userIsLogged) {
      configureLogoutLink();
      addEditModeUI();
    } else {
      loginLink.innerHTML = '<a href="login.html">login</a>';
    }
  }

  // VERIFIER SI LE USER EST CONNECTE
  function checkLoginStatus() {
    const token = localStorage.getItem("token");
    return token !== null && token !== "";
  }

  // CONFIGURATION DE LA DECONNEXION
  function configureLogoutLink() {
    loginLink.innerHTML = '<a href="#" id="logout">logout</a>';
    document.getElementById("logout").addEventListener("click", handleLogout);
  }

  // GESTION DE LA DECONNEXION
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }

  // MODE EDITION
  function addEditModeUI() {
    addEditModeToHeader();
    addEditModeToPortfolio();
  }

  // GESTION DU "MODE EDITION"

  function addEditModeToHeader() {
    const header = document.querySelector("header");
    const editionModeDiv = createDivWithIcon("fas fa-regular fa-pen-to-square", " Mode édition");
    editionModeDiv.className = "editionMode";
    editionModeDiv.style.cursor = "pointer";
    header.appendChild(editionModeDiv);
    header.style.margin = "110px 0";
    editionModeDiv.addEventListener("click", () => {
      displayModal();
    });
  }

  // GESTION DE "MODIFIER"

  function addEditModeToPortfolio() {
    const portfolioSection = document.getElementById("portfolio");
    const portfolioTitle = portfolioSection.querySelector("h2");
    const modifierButton = createDivWithIcon("fas fa-regular fa-pen-to-square", "modifier");
    modifierButton.style.cursor = "pointer";
    portfolioTitle.insertAdjacentElement("beforebegin", modifierButton);
    modifierButton.addEventListener("click", () => {
      displayModal();
    });
  }
});

// Création d'un div avec une icône
function createDivWithIcon(iconClass, text) {
  const div = document.createElement("div");
  const icon = document.createElement("i");
  icon.className = iconClass;
  div.appendChild(icon);
  div.appendChild(document.createTextNode(text));
  return div;
}

// Création d'un bouton avec une icône
function createButtonWithIcon(iconClass, text) {
  const button = document.createElement("button");
  const icon = document.createElement("i");
  icon.className = iconClass;
  button.appendChild(icon);
  button.appendChild(document.createTextNode(text));
  return button;
}

// Fonction d'affichage de la modale
function displayModal() {
  const modal = document.querySelector(".modale");
  if (modal) {
    modal.style.display = "flex";
  }
}

// Fonction de masquage de la modale
function hideModal() {
  const modal = document.querySelector(".modale");
  if (modal) {
    modal.style.display = "none";
  }
}

// **********************GESTION INTEGRATION DYNAMIQUE DE LA MODALE 1 "containerModale"********************

// Création de la première modale pour la galerie
const modaleGallery = document.createElement("div");
modaleGallery.classList.add("modale");
modaleGallery.id = "modaleGallery";

const containerModaleGallery = document.createElement("div");
containerModaleGallery.classList.add("containerModale");

const spanIconGallery = document.createElement("span");
const xmarkIconGallery = document.createElement("i");
xmarkIconGallery.classList.add("fa-solid", "fa-xmark");
xmarkIconGallery.id = "xmark-modaleGallery";
spanIconGallery.appendChild(xmarkIconGallery);

const titleH2Gallery = document.createElement("h2");
titleH2Gallery.classList.add("title");
titleH2Gallery.textContent = "Gallerie photo";

const galleryModale = document.createElement("div");
galleryModale.classList.add("galleryModale");

const separationDivGallery = document.createElement("div");
separationDivGallery.classList.add("separation");

const buttonModaleGallery = document.createElement("button");
buttonModaleGallery.classList.add("btnModale");
buttonModaleGallery.textContent = "Ajouter une photo";
buttonModaleGallery.style.cursor = "pointer";

// Assemblage de la première modale
containerModaleGallery.appendChild(spanIconGallery);
containerModaleGallery.appendChild(titleH2Gallery);
containerModaleGallery.appendChild(galleryModale);
containerModaleGallery.appendChild(separationDivGallery);
containerModaleGallery.appendChild(buttonModaleGallery);
modaleGallery.appendChild(containerModaleGallery);
document.body.appendChild(modaleGallery);

// Création de la deuxième modale pour l'ajout de photo
const modaleAdd = document.createElement("div");
modaleAdd.classList.add("modale");
modaleAdd.id = "modaleAdd";

const containerModaleAdd = document.createElement("div");
containerModaleAdd.classList.add("containerModale");

const spanLeftArrow = document.createElement("span");
const leftArrowIcon = document.createElement("i");
leftArrowIcon.classList.add("fa-solid", "fa-arrow-left");
spanLeftArrow.appendChild(leftArrowIcon);
containerModaleAdd.appendChild(spanLeftArrow);

const spanIconAdd = document.createElement("span");
const xmarkIconAdd = document.createElement("i");
xmarkIconAdd.classList.add("fa-solid", "fa-xmark");
xmarkIconAdd.id = "xmark-modaleAdd";
spanIconAdd.appendChild(xmarkIconAdd);
containerModaleAdd.appendChild(spanIconAdd);

const titleH2AddWork = document.createElement("h2");
titleH2AddWork.textContent = "Ajout photo";
containerModaleAdd.appendChild(titleH2AddWork);

const formAddWork = document.createElement("form");
formAddWork.classList.add("formAddWork");

// Création des autres éléments du formulaire
const containerFileDiv = document.createElement("div");
containerFileDiv.classList.add("containerFile");

const fileIconSpan = document.createElement("span");
const fileIcon = document.createElement("i");
fileIconSpan.classList.add("fileIcon");
fileIcon.classList.add("fa-regular", "fa-image");
fileIconSpan.appendChild(fileIcon);

const fileLabel = document.createElement("label");
fileLabel.textContent = "+ Ajouter photo";
fileLabel.classList.add("fileLabel");
fileLabel.style.cursor = "pointer";
fileLabel.setAttribute("for", "file");

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.id = "file";
fileInput.name = "images";

const imagePreview = document.createElement("img");
imagePreview.className = "imagePreviewLoaded";
imagePreview.src = "#";
imagePreview.alt = "Aperçu de l'image";

const maxFileSize = document.createElement("p");
maxFileSize.classList.add("maxFileSize");
maxFileSize.textContent = "Jpg, png: 4Mo max";

const titleLabel = document.createElement("label");
titleLabel.textContent = "Titre";

const titleInput = document.createElement("input");
titleInput.type = "text";
titleInput.name = "title";
titleInput.id = "title";

const categoryLabel = document.createElement("label");
categoryLabel.textContent = "Catégorie";

const categorySelect = document.createElement("select");
categorySelect.name = "category";
categorySelect.id = "category";

const validateButton = document.createElement("button");
validateButton.classList.add("btnValidate");
validateButton.textContent = "Valider";
validateButton.type = "submit";
validateButton.style.cursor = "pointer";

const separationDiv = document.createElement("div");
separationDiv.classList.add("separation");

// Ajout des éléments au formulaire
containerFileDiv.appendChild(fileIconSpan);
containerFileDiv.appendChild(fileLabel);
containerFileDiv.appendChild(fileInput);
containerFileDiv.appendChild(imagePreview);
containerFileDiv.appendChild(maxFileSize);

formAddWork.appendChild(containerFileDiv);
formAddWork.appendChild(titleLabel);
formAddWork.appendChild(titleInput);
formAddWork.appendChild(categoryLabel);
formAddWork.appendChild(categorySelect);
formAddWork.appendChild(validateButton);

// Assemblage de la deuxième modale
containerModaleAdd.appendChild(formAddWork);
modaleAdd.appendChild(containerModaleAdd);

// Ajout de la deuxième modale au document
document.body.appendChild(modaleAdd);

// Masquer la modale au chargement de la page
modaleAdd.style.display = "none";

// Écouteur d'événement pour l'icône de fermeture
xmarkIconAdd.addEventListener("click", function () {
  modaleAdd.style.display = "none";
  modaleGallery.style.display = "none";
});

// Écouteur d'événement pour la flèche gauche
leftArrowIcon.addEventListener("click", function () {
  showModal("modaleGallery");
  modaleAdd.style.display = "none";
});

// Écouteurs d'événements pour les icônes de fermeture
xmarkIconGallery.addEventListener("click", function () {
  hideModal("modaleGallery");
});

xmarkIconAdd.addEventListener("click", function () {
  hideModal("modaleAdd");
});

// Fonction pour afficher la modale d'ajout
function showModalAdd() {
  modaleAdd.style.display = "flex";
}

//***************************GESTION AU CLIC SUR LE BOUTON "AJOUTER UNE PHOTO"************************** */
buttonModaleGallery.addEventListener("click", function () {
  // Réinitialise les champs du formulaire et l'image
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const fileInput = document.getElementById("file");
  const fileLabel = document.querySelector(".fileLabel");
  const fileIconSpan = document.querySelector(".fileIcon");
  const maxFileSize = document.querySelector(".maxFileSize");
  const validateButton = document.querySelector(".btnValidate");
  const containerFileDiv = document.querySelector(".containerFile");
  const imagePreview = document.querySelector(".imagePreviewLoaded");
  const faRegular = document.querySelector(".fa-regular .fa-image");
  // Supprimer l'ancien aperçu de l'image, s'il existe
  let oldPreview = document.getElementById("imagePreview");
  if (oldPreview) {
    oldPreview.remove();
  }
  if (fileLabel) {
    fileLabel.style.display = "block";
  }
  if (imagePreview) {
    imagePreview.style.display = "none";
    // Crée un nouvel aperçu d'image
    const newPreview = document.createElement("img");
    newPreview.id = "imagePreview";
    newPreview.style.display = "none";
    containerFileDiv.appendChild(newPreview);

    // Réinitialise les valeurs des champs
    if (titleInput) {
      titleInput.value = "";
    }
    if (faRegular) {
      faRegular.style.display = "block";
    }
    if (categorySelect) {
      categorySelect.value = "";
    }
    if (fileInput) {
      fileInput.value = "";
      fileInput.style.display = "none";
    }
    // Réinitialiser les états visuels des autres éléments
    if (fileIconSpan) {
      fileIconSpan.style.display = "block";
    }
    if (maxFileSize) {
      maxFileSize.style.display = "block";
    }
    if (validateButton) {
      validateButton.style.backgroundColor = "";
      validateButton.style.border = "";
    }
    // Masque la modale de galerie et affiche la modale de formulaire
    hideModal("modaleGallery");
    showModal("modaleAdd");
  }
});

// ***********************AFFICHER UNE MODALE***********************
function showModal(modalId) {
  const modale = document.getElementById(modalId);
  modale.style.display = "flex";
}

// ***********************MASQUER UNE MODALE***********************
function hideModal(modalId) {
  const modale = document.getElementById(modalId);
  modale.style.display = "none";
}

//// ***********************GESTION XMARK*******************************
xmarkIconGallery.addEventListener("click", function () {
  hideModal("modaleGallery");
});

xmarkIconAdd.addEventListener("click", function () {
  hideModal("modaleAdd");
});

// // ***********************FERMETURE AU CLIC EN DEHORS MODALE AJOUT*******************************
modaleAdd.addEventListener("click", function (event) {
  // Vérifie si l'élément cliqué est en dehors de la modale
  if (!containerModaleAdd.contains(event.target)) {
    modaleAdd.style.display = "none";
    modaleGallery.style.display = "none";
  }
  displayWorks();
});

// ***********************FERMETURE AU CLIC EN DEHORS MODALE GALLERIE******************************
modaleGallery.addEventListener("click", function (event) {
  // Vérifie si l'élément cliqué est en dehors de la modale
  if (!containerModaleGallery.contains(event.target)) {
    modaleGallery.style.display = "none";
  }
  handleActiveButton(document.getElementById("0"));
  displayWorks();
});

// *****************GESTION AFFICHAGE DE LA GALLERIE DANS MODALE 1***********************
async function displayGalleryModale() {
  galleryModale.innerHTML = "";
  const gallery = await recupererWorks();
  gallery.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;
    img.src = work.imageUrl;
    span.appendChild(trash);
    figure.appendChild(img);
    figure.appendChild(span);
    galleryModale.appendChild(figure);
  });
  await deleteWork();
}
displayGalleryModale();

// *****************GESTION DELETE DE L'IMAGE DANS LA MODALE 1***********************

async function deleteWork() {
  const trashAll = document.querySelectorAll(".fa-trash-can");
  trashAll.forEach(trash => {
    trash.addEventListener("click", async (event) => {
      event.preventDefault();
      const id = trash.id;
      const init = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      };
      try {
        const response = await fetch(`http://localhost:5678/api/works/` + id, init);
        if (response.ok) {
          console.log("Delete ok");
          displayGalleryModale();
        } else {
          console.log("Delete ko");
        }
      } catch (error) {
        console.error("Une erreur est survenue pendant la suppression", error);
      }
    });
  });
  displayWorks();
}

// Prévisualisation de l'IMG dans modale 2 et écoute des changements sur l'input file
fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      imagePreview.src = reader.result;
      imagePreview.style.display = "block";
      fileLabel.style.display = "none";
      maxFileSize.style.display = "none";
      fileInput.style.display = "none";
      fileIconSpan.style.display = "none";
      validateButton.style.color = "white";
      validateButton.style.backgroundColor = "#1D6154";
      validateButton.style.border = "1px solid #1D6154";
    });
    reader.readAsDataURL(file);
  }
})

// *****************GESTION DU POST**************************

formAddWork.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData();
  // Vérifie si tous les champs requis sont remplis
  if (titleInput.value === "" || categorySelect.value === "" || fileInput.files.length === 0) {
    alert("Veuillez remplir tous les champs requis et ajouter une image.");
    return;
  }
  // Ajoute les données du formulaire à formData
  formData.append('title', titleInput.value);
  formData.append('category', categorySelect.value);
  formData.append('image', fileInput.files[0]);
  // Configuration de la requête POST
  const requestOptions = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData
  };
  // Envoi de la requête POST à l'API
  try {
    const response = await fetch("http://localhost:5678/api/works", requestOptions);
    if (response.ok) {
      modaleAdd.style.display = "none";
      modaleGallery.style.display = "flex";
      displayGalleryModale();
      console.log('La requête POST a réussi');
      // Masque complètement la modale principale

    } else {
      console.log('La requête POST a échoué', response.status, response.statusText);
    }
  } catch (error) {
    console.error("Erreur pendant la requête POST", error);
  }
  displayWorks();
});

// Création de la liste catégorie dynamique dans l'input select de la modale 2
async function displayCategorieModal2() {
  const select = document.querySelector("#category");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Choisissez une catégorie";
  select.appendChild(defaultOption);
  const categories = await recupererCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  })
}
displayCategorieModal2()

// **************REDIRECTION VERS LA SECTION CONTACT DANS LE LIEN DU LOGIN EN SCROLLING********************
document.addEventListener("DOMContentLoaded", () => {
  const sectionToScroll = window.location.hash.substring(1);
  if (sectionToScroll) {
    setTimeout(function () {
      const targetSection = document.getElementById(sectionToScroll);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
        });
      }
    }, 100);
  }
});

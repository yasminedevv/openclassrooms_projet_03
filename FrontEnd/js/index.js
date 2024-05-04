// Variables globales

const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");
let listWorks = [];

//recupererCategories();

async function recupererCategories() {
    const responsecategory = await fetch ('http://localhost:5678/api/categories');
    const listcategory = await responsecategory.json();
    console.log(listcategory); 
    return (listcategory) ;
};
//afficher catégories 
async function displayCategories() {
    const arrayCategories = await recupererCategories ();
    arrayCategories.forEach((category) => {
     const button = document.createElement("button") ;
     button.textContent = category.name;
     button.id = category.id;
     filtersContainer.appendChild(button);  
    });
}

// recupererWorks(); 
async function recupererWorks() {
    const response = await fetch ("http://localhost:5678/api/works");
    listWorks = await response.json();
    return listWorks;  
};
//afficher works
async function displayWorks (afficheWorks = listWorks){
    gallery.innerHTML = "" ;
    afficheWorks.forEach((work) => {
      const figure = document.createElement("figure");
      const img =document.createElement("img");
      img.src = work.imageUrl;
      const figcaption = document.createElement("figcaption");
      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent= work.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    })    
}

//********** FILTRAGE DES CATEGORIES**********
async function filterCategory() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      let galleryFiltered;
      const buttonId = event.target.id;
      if (buttonId !== "0") {
        galleryFiltered = listWorks.filter((work) => {
          return work.category.id === parseInt(buttonId);
        });
        // Applique le style normal au bouton "Tous"
        toggleTousButtonStyle(false);
      } else {
        // Si le bouton "Tous" est cliqué, afficher toutes les work
        galleryFiltered = listWorks;
        // Appliquer le style spécial au bouton "Tous"
        toggleTousButtonStyle(true);
      }
      // Afficher les parties filtrées ou tout les work
      displayWorks(galleryFiltered);
    });
  });
}

// *******************GESTION DU BOUTON "TOUS" *************************
function toggleTousButtonStyle(selected) {
  const tousButton = document.getElementById('0');
  if (selected) {
    // Supprime la classe lorsque le bouton est sélectionné
    tousButton.classList.remove('not-selected');
    tousButton.style.backgroundColor = '#1d6154';
    tousButton.style.color = 'white';
    // Supprimer les gestionnaires d'événements hover lorsque le bouton est sélectionné
    tousButton.removeEventListener('mouseenter', handleMouseEnter);
    tousButton.removeEventListener('mouseleave', handleMouseLeave);
  } else {
    // Ajoute classList qand le bouton n'est pas sélectionné
    tousButton.classList.add('not-selected');
    tousButton.style.backgroundColor = 'white';
    tousButton.style.color = '#1d6154';
    // Ajoute les gestionnaires d'événements hover lorsque le bouton n'est pas sélectionné
    tousButton.addEventListener('mouseenter', handleMouseEnter);
    tousButton.addEventListener('mouseleave', handleMouseLeave);
  }
}
// Gestionnaire d'événement pour le survol (mouseenter)
function handleMouseEnter(event) {
  event.target.style.backgroundColor = '#1d6154';
  event.target.style.color = 'white';
}
// Gestionnaire d'événement pour la sortie du survol (mouseleave)
function handleMouseLeave(event) {
  event.target.style.backgroundColor = 'white';
  event.target.style.color = '#1d6154';
}

// ******************FONCTION D'INITIALISATION***************************
// Fonction d'initialisation de la page
async function initializePage() {

    await displayCategories();
    await recupererWorks();
    await displayWorks();
    await filterCategory();

  
   // Ajoute la classe "not-selected" au bouton "Tous" par défaut
   const tousButton = document.getElementById('0');
   tousButton.classList.add('not-selected');
   toggleTousButtonStyle(true);
 }
  
  initializePage(); // Appel de la fonction d'initialisation au chargement de la page
  

 

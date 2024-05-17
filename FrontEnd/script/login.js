// Variables globales
const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const form = document.querySelector("form");
const errorDisplay = document.querySelector(".error");

// fonction REGEX email validation
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Fonction submit de la page login
form.addEventListener("submit", (event) => {
    // Empêche le navigateur de soumettre le formulaire au clic sur le bouton
    event.preventDefault();
    // Récupération des informations écrites par l'utilisateur
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;
    // Validation de l'adresse email et affichage du message d'erreur si invalide
    if (!validateEmail(userEmail)) {
        errorDisplay.textContent = "Veuillez entrer une adresse email valide.";
        return;
    }

    // Crée un objet avec les données du formulaire
    const formData = {
        email: userEmail,
        password: userPassword
    };
    // Envoi de la requête POST au serveur avec les données du formulaire
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // Transforme en chaîne de caractères sous forme JSON pour être traité côté serveur
        body: JSON.stringify(formData)
    })
        .then(async response => {
            if (response.status !== 200) {
                throw new Error("Adresse email ou mot de passe invalide.");
            } else {
                // Convertit la réponse en JSON
                return response.json();
            }
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            // Redirection vers la page d'accueil après connexion réussie
            window.location.href = "index.html";

        })
        .catch(err => {
            console.error('Erreur:', err);
            errorDisplay.innerHTML = "<p>" + err + "</p>";
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const contactLink = document.querySelector('nav ul li:nth-child(2) a'); // Sélection du lien "contact"

    // Ajout de l'écouteur d'événement au clic sur le lien "contact"
    contactLink.addEventListener("click", function (event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        window.location.href = "index.html#contact"; // Redirection vers la section "contact" de la page index.html
    });
});



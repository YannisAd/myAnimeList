$(document).ready(function() {
  var $grid = $('#anime-list').isotope({
    // options
  });

  // Filter items on button click
  $('.filter-button-group').on('click', 'button', function() {
    var $button = $(this);
  
    // Toggle active class on button
    $button.toggleClass('active');
  
    // Get active filters
    var activeFilters = [];
    $('.filter-button-group').find('.active').each(function() {
      activeFilters.push($(this).attr('data-filter'));
    });
  
    // Combine active filters
    var filterValue = activeFilters.join('');
  
    // Filter items
    $grid.isotope({ filter: filterValue });
  });

  // Event handler for search bar input
  $("#search-bar").on("input", function() {
    var searchTerm = $(this).val().toLowerCase();

    // Filter items based on search term
    $grid.isotope({
      filter: function() {
        var title = $(this).find("#titre").text().toLowerCase();
        return title.includes(searchTerm);
      }
    });
  });

  // Popup details creation
  $(".product-item").click(function() {
    var title = $(this).find("#titre").text();
    var avis = $(this).find("#avis").text();
    var synopsis = $(this).find("#synopsis").text();
    var imgUrl = $(this).find(".product-img img").attr("src");

    var popupContent = `
    <button class="close-btn">
    <img src="images/close.svg" alt="Fermer">
  </button>
  
  
  
      <div class="popup-content">
        <img src="${imgUrl}" class="popup-img">
        <h2>${title}</h2>
        <h3> Mon avis : <br></h3>
        <p>${avis}</p>
        <h3> Synopsis : <br></h3>

        <p>${synopsis}</p>

      </div>

    `;

    $("body").append('<div class="popup">' + popupContent + '</div>');
    $(".popup").hide().fadeIn();

    $(".popup, .close-btn").click(function(event) {
      if (!$(event.target).closest(".popup-content").length || $(event.target).hasClass("close-btn")) {
        $(".popup").fadeOut(function() {
          $(this).remove();
        });
      }
    });
  });
});






/* Si utilisation d'une API ici Jikan REST

    // Liste des IDs
var idList = [21];

// Fonction pour effectuer la requête API pour chaque ID
function fetchData(id) {
  var apiUrl = "https://api.jikan.moe/v4/anime/" + id;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();

    })
    .then(function (data) {
      // Récupérer les éléments nécessaires de la réponse JSON

      console.log(data); // Affiche la réponse JSON dans la console

      var title = data.title;
      var episodes = data.episodes;
      var status = data.status;
      var duration = data.duration;
      var score = data.score;
      var synopsis = data.synopsis;
      var genres = data.genre;

      document.getElementById("test").innerHTML = title;

      // Créer l'élément HTML avec les données récupérées
      var productHtml = `
        <div class="col-lg-4 col-md-6 action">
            <div class="product-item">
                <div class="product-img">
                    <img src="images/" class="img-fluid d-block mx-auto">
                </div>
                <div class="product-content text-center py-3">
                    <span class="d-block text-uppercase fw-bold" id="titre">${title}</span>
                    <span class="d-block" id="épisode">${episodes}</span>
                    <span class="d-block" id="synopsis">${synopsis}</span>
                </div>
            </div>
        </div>
      `;

      // Insérer l'élément HTML dans la page
      var productList = document.getElementById("product-list");
      productList.innerHTML += productHtml;
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Parcourir la liste d'IDs et effectuer la requête API pour chaque ID
idList.forEach(function (id) {
  fetchData(id);
});


*/ 



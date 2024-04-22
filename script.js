const search = document.querySelector(".search_input");
getMovies("naruto");

search.onkeyup = () => {
  if (search.value.length > 2) {
    getMovies(search.value);
  } else {
    errorMessage("Your input is too short");
  }
};

async function getMovies(title) {
  try {
    const response = await fetch(
      "https://www.omdbapi.com/?apikey=dca61bcc&s=" + title
    );
    const json = await response.json();
    if (json.Response == "False") {
      throw new Error(json.Error);
    } else {
      displayMovie(json);
      cardHandle();
    }
  } catch (err) {
    errorMessage(err);
  }
}

function displayMovie(movies) {
  const redText = document.querySelector(".search_input");
  redText.style.color = "black";
  let listMovie = "";
  movies.Search.forEach((movie) => {
    listMovie += `
    <div class="card" data-imdbID=${movie.imdbID}>
    <div class="header-card">
      <img
        class="poster"
        src=${movie.Poster}
        alt=${movie.Title}
      />
    </div>
    <div class="body-card">
      <div>
        <p class="title">${movie.Title}</p>
        <p class="years">${movie.Year}</p>
      </div>
    </div>
  </div>`;
  });
  document.querySelector(".container").innerHTML = listMovie;
}

function errorMessage(message) {
  const redText = document.querySelector(".search_input");
  const alert = document.querySelector(".alert");
  redText.style.color = "red";
  alert.innerHTML = `<p class="text-alert">${message}</p>`;
  alert.style.transform = "translate(-50%, 0)";
  setTimeout(() => {
    alert.style.transform = "translate(-50%, -3rem)";
  }, 1000);
}

function cardHandle() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const imdbId = card.getAttribute("data-imdbID");
      getMoviesDetail(imdbId);
    });
  });
}

async function getMoviesDetail(id) {
  const response = await fetch(
    "https://www.omdbapi.com/?apikey=dca61bcc&i=" + id
  );
  const json = await response.json();
  showModal(json);
}

function showModal(movie) {
  const modal = document.querySelector(".modal");
  modal.onclick = (e) => {
    if (e.target.classList == "modal") {
      modal.style.display = "none";
      modal.innerHTML = "";
    }
  };
  modal.style.display = "flex";
  modal.innerHTML = `<div class="modal-card">
  <img
    class="modal-poster"
    src=${movie.Poster}
    alt=${movie.Title}
  />
  <div class="modal-detail">
    <div class="title-modal">
      <h1>${movie.Title}</h1>
      <p style="color: #333">${movie.Runtime}</p>
    </div>
    <div class="contributor">
      <p>Released: ${movie.Released}</p>
      <p>Genre: ${movie.Genre}</p>
      <p>Director: ${movie.Director}</p>
      <p>Writer: ${movie.Writer}</p>
      <p>Actors: ${movie.Actors}</p>
    </div>
    <div class="plot">
      <p>
        Synopsis: ${movie.Plot}
      </p>
    </div>
    <p class="showmore-btn">Show More...</p>
    <div class="rating">
      <p class="material-symbols-outlined">grade</p>
      <p>${movie.imdbRating}</p>
    </div>
  </div>
  </div>`;
  showMore();
}

function showMore() {
  const showmore = document.querySelector(".showmore-btn");
  const plotModal = document.querySelector(".plot");
  showmore.onclick = () => {
    if (plotModal.className == "plot") {
      plotModal.classList.add("show-plot");
      showmore.textContent = "Show Less...";
    } else {
      plotModal.classList.remove("show-plot");
      showmore.textContent = "Show More...";
    }
  };
}

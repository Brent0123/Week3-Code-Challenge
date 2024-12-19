// URL for the API server
const API_URL = "http://localhost:3000/films";

// DOM elements
const movieList = document.querySelector("#films");
const poster = document.querySelector("#poster");
const title = document.querySelector("#title");
const runtime = document.querySelector("#runtime");
const showtime = document.querySelector("#showtime");
const description = document.querySelector("#description");
const availableTickets = document.querySelector("#available-tickets");
const buyButton = document.querySelector("#buy-ticket");

// Fetch and display all movies when the page loads
fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        displayMovieList(data);
        displayMovieDetails(data[0]); // Display first movie details by default
    });

// Function to display the list of movies
function displayMovieList(movies) {
    movieList.innerHTML = ""; // Clear existing list
    movies.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        li.classList.add("film", "item");
        if (movie.capacity - movie.tickets_sold === 0) {
            li.classList.add("sold-out");
        }
        li.addEventListener("click", () => displayMovieDetails(movie));
        movieList.appendChild(li);
    });
}

// Function to display detailed information of a selected movie
function displayMovieDetails(movie) {
    poster.src = movie.poster;
    title.textContent = movie.title;
    runtime.textContent = movie.runtime;
    showtime.textContent = movie.showtime;
    description.textContent = movie.description;
    updateAvailableTickets(movie);
    buyButton.classList.remove("sold-out-btn");
    buyButton.textContent = "Buy Ticket";

    // Handle Buy Ticket Button
    buyButton.onclick = () => buyTicket(movie);
}

// Update the number of available tickets
function updateAvailableTickets(movie) {
    const ticketsLeft = movie.capacity - movie.tickets_sold;
    availableTickets.textContent = ticketsLeft;
    if (ticketsLeft <= 0) {
        markAsSoldOut();
    }
}

// Function to handle buying a ticket
function buyTicket(movie) {
    const ticketsLeft = movie.capacity - movie.tickets_sold;
    if (ticketsLeft > 0) {
        movie.tickets_sold += 1;
        updateAvailableTickets(movie);
    }
}

// Mark the movie as sold out if no tickets are left
function markAsSoldOut() {
    buyButton.textContent = "Sold Out";
    buyButton.classList.add("sold-out-btn");
    buyButton.onclick = null; // Disable further clicks
    const soldOutItem = Array.from(movieList.children).find(
        li => li.textContent === title.textContent
    );
    if (soldOutItem) soldOutItem.classList.add("sold-out");
}
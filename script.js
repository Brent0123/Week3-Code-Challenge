document.addEventListener('DOMContentLoaded', () => {
    // Fetch all movies when the page loads
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
            displayMovies(films);
            displayMovieDetails(films[0]); // Show first movie by default
        });

    function displayMovies(films) {
        const filmsList = document.getElementById('films');
        // Clear any existing list items
        filmsList.innerHTML = '';
        films.forEach(film => {
            const li = document.createElement('li');
            li.textContent = film.title;
            li.classList.add('film', 'item');
            li.dataset.id = film.id;
            li.addEventListener('click', () => fetchAndDisplayMovieDetails(film.id));
            filmsList.appendChild(li);
        });
    }

    function displayMovieDetails(movie) {
        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('moviePoster').src = movie.poster;
        document.getElementById('movieRuntime').textContent = `Runtime: ${movie.runtime} minutes`;
        document.getElementById('movieShowtime').textContent = `Showtime: ${movie.showtime}`;
        updateTicketAvailability(movie);

        const buyButton = document.getElementById('buyTicket');
        buyButton.addEventListener('click', () => {
            if (parseInt(movie.tickets_sold) < movie.capacity) {
                movie.tickets_sold++; // Simulate buying a ticket
                updateTicketAvailability(movie);
                checkIfSoldOut(movie);
            }
        });
    }

    function updateTicketAvailability(movie) {
        const available = movie.capacity - movie.tickets_sold;
        document.getElementById('availableTickets').textContent = `Available Tickets: ${available}`;
        document.getElementById('buyTicket').disabled = available === 0;
        document.getElementById('buyTicket').textContent = available === 0 ? "Sold Out" : "Buy Ticket";
    }

    function fetchAndDisplayMovieDetails(id) {
        fetch(`http://localhost:3000/films/${id}`)
            .then(response => response.json())
            .then(movie => {
                displayMovieDetails(movie);
                checkIfSoldOut(movie);
            });
    }

    function checkIfSoldOut(movie) {
        const movieItem = document.querySelector(`li[data-id="${movie.id}"]`);
        if (movie.capacity === movie.tickets_sold) {
            movieItem.classList.add('sold-out');
        } else {
            movieItem.classList.remove('sold-out');
        }
    }
});
// Global variables to keep track of the current page and items per page
let currentPage = 1;
const perPage = 10;

// Base URL for your deployed API
const baseUrl = 'https://labweb422-h3w4-oqjjsul3n-kamelin22yahoocoms-projects.vercel.app/api/movies';

// Load movie data either with a search filter or without
function loadMovieData(title = null) {
    let url = `${baseUrl}?page=${currentPage}&perPage=${perPage}`;
    if (title) {
        url += `&title=${encodeURIComponent(title)}`;
        currentPage = 1; // Reset to first page on new search
        document.querySelector('.pagination').classList.add('d-none');
    } else {
        document.querySelector('.pagination').classList.remove('d-none');
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateTable(data);
            document.getElementById('current-page').textContent = currentPage; // Update the current page display
        })
        .catch(error => console.error('Error loading the data:', error));
}

// Update the movie table with fetched data
function updateTable(movies) {
    const tableBody = document.getElementById('moviesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear previous content

    movies.forEach(movie => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot}</td>
            <td>${movie.rating}</td>
            <td>${movie.runTime}</td>
        `;
        row.dataset.id = movie.id;
        row.addEventListener('click', () => showMovieDetails(movie.id));
    });
}

// Show details in the modal for the clicked movie
function showMovieDetails(movieId) {
    const detailUrl = `${baseUrl}/${movieId}`;
    fetch(detailUrl)
        .then(response => response.json())
        .then(movie => {
            document.getElementById('detailsModalLabel').textContent = movie.title;
            const modalBody = document.querySelector('#detailsModal .modal-body');
            modalBody.innerHTML = `
                <strong>Plot:</strong> ${movie.plot}<br>
                <strong>Rating:</strong> ${movie.rating}<br>
                <strong>Run Time:</strong> ${movie.runTime} minutes
            `;
            new bootstrap.Modal(document.getElementById('detailsModal')).show();
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Event listeners for pagination
document.getElementById('previous-page').addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        loadMovieData();
    }
});

document.getElementById('next-page').addEventListener('click', function(event) {
    event.preventDefault();
    currentPage++;
    loadMovieData();
});

// Event listener for search form submission
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    loadMovieData(title);
});

// Event listener for clearing the search form
document.getElementById('clearForm').addEventListener('click', function() {
    document.getElementById('title').value = '';
    currentPage = 1;
    loadMovieData(); // Load initial or default data
});

// Initial data load when the page loads
loadMovieData();

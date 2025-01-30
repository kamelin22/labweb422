// Set up the base URL for your deployed API
const baseUrl = 'https://labweb422-lfvs-iwykxj5up-kamelin22yahoocoms-projects.vercel.app/';

// Global variables to keep track of the current page and items per page
let currentPage = 1;
const perPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    loadMovieData();  // Initial data load when the page loads

    // Pagination event listeners
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

    // Search functionality
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        loadMovieData(title);
    });

    // Clear search
    document.getElementById('clearForm').addEventListener('click', function() {
        document.getElementById('title').value = '';
        currentPage = 1;
        loadMovieData();
    });
});

// Function to load movie data from the API
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
            console.log("API Response:", data); // Debugging line
            updateTable(data);
            document.getElementById('current-page').textContent = currentPage;
        })
        .catch(error => console.error('Error loading the data:', error));
}

// Function to update the table with movie data
function updateTable(movies) {
    const tableBody = document.getElementById('moviesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear previous content

    movies.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie.year || 'N/A'}</td>
            <td>${movie.title || 'N/A'}</td>
            <td>${movie.plot || 'N/A'}</td>
            <td>${movie.rated || 'N/A'}</td>
            <td>${formatRunTime(movie.runtime)}</td>
        `;
        row.dataset.id = movie._id; // Attach data-id for further reference
        row.addEventListener('click', () => showMovieDetails(movie._id));
        tableBody.appendChild(row);
    });
}

// Function to show movie details in a modal
function showMovieDetails(movieId) {
    const detailUrl = `${baseUrl}/${movieId}`;
    fetch(detailUrl)
        .then(response => response.json())
        .then(movie => {
            const modalBody = document.querySelector('#detailsModal .modal-body');
            modalBody.innerHTML = `
                <img src="${movie.poster}" class="img-fluid w-100" alt="Movie Poster">
                <strong>Directed By:</strong> ${movie.directors.join(', ')}<br>
                <p>${movie.fullplot}</p>
                <strong>Cast:</strong> ${movie.cast.join(', ') || 'N/A'}<br>
                <strong>Awards:</strong> ${movie.awards.text}<br>
                <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)
            `;
            document.getElementById('detailsModalLabel').textContent = movie.title;
            new bootstrap.Modal(document.getElementById('detailsModal')).show();
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Helper function to format runtime from minutes to "X:YY" format
function formatRunTime(runtime) {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

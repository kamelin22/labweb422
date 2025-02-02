document.addEventListener('DOMContentLoaded', function () {
    // Global variables
    let currentPage = 1; // Tracks the current page
    const perPage = 10; // Number of movies per page
    const baseUrl = 'https://labweb422-lfvs-iwykxj5up-kamelin22yahoocoms-projects.vercel.app'; // Base URL for the API

    // Function to load movie data
    function loadMovieData(title = null) {
        let url = `${baseUrl}?page=${currentPage}&perPage=${perPage}`;
        if (title) {
            url += `&title=${encodeURIComponent(title)}`;
            currentPage = 1; // Reset to the first page for new search
            document.querySelector('.pagination').classList.add('d-none'); // Hide pagination
        } else {
            document.querySelector('.pagination').classList.remove('d-none'); // Show pagination
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateTable(data); // Update the table with movie data
                updatePaginationControls(data.length); // Update pagination controls
                document.getElementById('current-page').textContent = currentPage; // Update current page number
            })
            .catch(error => console.error('Error loading movies:', error));
    }

    // Function to update the table with movie data
    function updateTable(movies) {
        const tableBody = document.getElementById('moviesTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear previous content

        movies.forEach(movie => {
            const row = document.createElement('tr');
            row.dataset.id = movie._id; // Add data-id attribute
            row.innerHTML = `
                <td>${movie.year || 'N/A'}</td>
                <td>${movie.title || 'N/A'}</td>
                <td>${movie.plot || 'N/A'}</td>
                <td>${movie.rated || 'N/A'}</td>
                <td>${formatRunTime(movie.runtime)}</td>
            `;
            row.addEventListener('click', () => showMovieDetails(movie._id)); // Add click event
            tableBody.appendChild(row);
        });
    }

    // Function to format runtime from minutes to "X:YY" format
    function formatRunTime(runtime) {
        if (!runtime) return 'N/A';
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    // Function to update pagination controls
    function updatePaginationControls(movieCount) {
        const previousPageButton = document.getElementById('previous-page');
        const nextPageButton = document.getElementById('next-page');

        // Disable "Previous" button if on the first page
        previousPageButton.classList.toggle('disabled', currentPage === 1);

        // Disable "Next" button if there are fewer movies than the items per page
        nextPageButton.classList.toggle('disabled', movieCount < perPage);
    }

    // Function to show movie details in a modal
    function showMovieDetails(movieId) {
        const detailUrl = `${baseUrl}/${movieId}`;
        fetch(detailUrl)
            .then(response => response.json())
            .then(movie => {
                const modalBody = document.querySelector('#detailsModal .modal-body');
                modalBody.innerHTML = `
                    <img src="${movie.poster}" class="img-fluid w-100" alt="Movie Poster"><br><br>
                    <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                    <p>${movie.fullplot}</p>
                    <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
                    <strong>Awards:</strong> ${movie.awards.text}<br>
                    <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)
                `;
                document.getElementById('detailsModalLabel').textContent = movie.title;
                new bootstrap.Modal(document.getElementById('detailsModal')).show(); // Show the modal
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    // Event listeners
    document.getElementById('previous-page').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadMovieData();
        }
    });

    document.getElementById('next-page').addEventListener('click', (e) => {
        e.preventDefault();
        currentPage++;
        loadMovieData();
    });

    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        loadMovieData(title);
    });

    document.getElementById('clearForm').addEventListener('click', () => {
        document.getElementById('title').value = '';
        loadMovieData();
    });

    // Load initial movie data
    loadMovieData();
});

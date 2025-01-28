document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const clearForm = document.getElementById('clearForm');
    const titleInput = document.getElementById('title');
    const pagination = document.querySelector('.pagination');
    let currentPage = 1;
    const perPage = 10;

    function loadMovieData(title = null) {
        const apiUrl = `/api/movies?page=${currentPage}&perPage=${perPage}` + (title ? `&title=${encodeURIComponent(title)}` : '');
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                updateTable(data);
                updatePaginationControls();
            })
            .catch(error => console.error('Error loading movies:', error));
    }

    function updateTable(movies) {
        const tableBody = document.getElementById('moviesTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';
        movies.forEach(movie => {
            let row = `<tr data-id="${movie._id}">
                            <td>${movie.year}</td>
                            <td>${movie.title}</td>
                            <td>${movie.plot || 'N/A'}</td>
                            <td>${movie.rating || 'N/A'}</td>
                            <td>${movie.runTime || 'N/A'}</td>
                       </tr>`;
            tableBody.innerHTML += row;
        });
    }

    function updatePaginationControls() {
        document.getElementById('current-page').textContent = currentPage;
    }

    document.getElementById('previous-page').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadMovieData(titleInput.value.trim());
        }
    });

    document.getElementById('next-page').addEventListener('click', (e) => {
        e.preventDefault();
        currentPage++;
        loadMovieData(titleInput.value.trim());
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 1;  // Reset to the first page for new search
        loadMovieData(titleInput.value.trim());
    });

    clearForm.addEventListener('click', () => {
        titleInput.value = '';
        currentPage = 1; // Reset to the first page
        loadMovieData();
    });

    // Load initial movies data without any filter
    loadMovieData();
});

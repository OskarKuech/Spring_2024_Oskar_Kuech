function fetchMovieDetails(movieTitle) {
    fetch('../../movies/details.json')
        .then(response => response.json())
        .then(data => {
            const movie_informations = data.find(movie => movie.title == movieTitle);
            if (movie_informations) {
                const movieDetailsTitle = document.getElementById('movieDetailsTitle');
                if (movieDetailsTitle) {
                    movieDetailsTitle.textContent = movie_informations.title;
                }
                const movieDetailsRelease_Date = document.getElementById('movieDetailsRelease_Date');
                if (movieDetailsRelease_Date) {
                    movieDetailsRelease_Date.textContent = movie_informations.release_date;
                }
                const movieDetailsRuntime = document.getElementById('movieDetailsRuntime');
                if (movieDetailsRuntime) {
                    movieDetailsRuntime.textContent = movie_informations.runtime;
                }
                const movieDetailsDirector = document.getElementById('movieDetailsDirector');
                if (movieDetailsDirector) {
                    movieDetailsDirector.textContent = movie_informations.director;
                }
                const movieDetailsGenre = document.getElementById('movieDetailsGenre');
                if (movieDetailsGenre) {
                    movieDetailsGenre.textContent = movie_informations.genre;
                }
                const movieDetailsDescription = document.getElementById('movieDetailsDescription');
                if (movieDetailsDescription) {
                    movieDetailsDescription.textContent = movie_informations.description;
                }
                const movieDetailsPoster = document.getElementById('movieDetailsPoster');
                if (movieDetailsPoster) {
                    const posterImg = document.createElement ('img');
                    posterImg.src = movie_informations.poster;
                    posterImg.alt = movie_informations.title + " Poster";
                    movieDetailsPoster.appendChild(posterImg);
                }
                const movieDetailsTrailerId = document.getElementById('movieDetailsTrailerId');
                if (movieDetailsTrailerId) {
                    movieDetailsTrailerId.textContent = movie_informations.trailer_id;
                }
            } else {
                console.log("A movie with that Title was not found.")
            }
        })
}
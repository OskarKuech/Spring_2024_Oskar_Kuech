function playTrailer(trailerIdElement) {
    const trailerId = trailerIdElement.textContent.trim();
    const youtubeURL = 'https://www.youtube.com/watch?v=' + trailerId;
    window.open(youtubeURL);
}
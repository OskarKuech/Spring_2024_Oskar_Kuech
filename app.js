import express, { request, response } from 'express';
import fs from 'fs';


const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

const details = JSON.parse(fs.readFileSync('./views/movies/details.json'));


app.get('/', (request, response) => {
    response.render('index')
})

app.get('/:slug', (request, response) => {
    response.render(request.params.slug)
    response.send('This Page does not exist. HAHA')
})

app.get('/movies/:slug', (request, response) => {
    const movieSlug = request.params.slug.toLowerCase();
    const movieDetails = details.find(movie => movie.slug.toLowerCase().replace(/\s+/g, '-') === movieSlug);
    if (movieDetails) {
        response.render('./includes/movie-detail-view.ejs', { 
            title: movieDetails.title,
            release_date: movieDetails.release_date,
            runtime: movieDetails.runtime,
            director: movieDetails.director,
            genre: movieDetails.genre,
            description: movieDetails.description,
            poster: movieDetails.poster,
            trailer_id: movieDetails.trailer_id
        });
    } else {
        response.render('error');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})
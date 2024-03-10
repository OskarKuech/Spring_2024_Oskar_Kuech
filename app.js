import express, { request, response } from 'express';


const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))


app.get('/', (request, response) => {
    response.render('index')
})


app.get('/:slug', (request, response) => {
    response.render(request.params.slug)
    response.send('This Page does not exist.')
})

app.get('/movies/:movieSlug', (request, response) => {
    const movieSlug = request.params.movieSlug;
    response.render('movies/' + movieSlug);
    response.send(`${movieSlug} does not exist in the Databse (because there is no...).`)
});


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})
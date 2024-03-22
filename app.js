import express, { request, response } from 'express';
import fs from 'fs';
import mongoose, { mongo } from 'mongoose';
import morgan from 'morgan';  


const app = express();
app.use(morgan('tiny'));

app.set('view engine', 'ejs');
const PORT = 3000;

const moviesSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    director: String, 
    runtime: String,
    release_date: String,
    genre: String,
    description: String,
    poster: String,
    poster_textless: String,
    trailer_id: String
  })
  
  const Movies = mongoose.model('Movies', moviesSchema)

  app.get('/movies', async (request, response) => {
    try {

      const movies = await Movies.find({}).exec()
  
      response.render('movies/index', {
        movies: movies,
      })
    }catch(error) {
      console.error(error)
      response.render('/movies/index', {
        movies: []
      })
    }
  })



  app.get('/movies/:slug', async (request, response) => {
    try {
      const slug = request.params.slug
      const movies = await Movies.findOne({slug: slug}).exec()
      if(!movies) throw new Error('Movie not found')
  
      response.render('./includes/movie-detail-view.ejs', {
        movies: movies,
      })
    }catch(error) {
      console.error(error)
      response.render('error', {
        movies: []
      })
    }
  })


  // app.post('/movies', async (request, response) => {
  //   console.log('Received request to create user:', request.body);
  //   try {
  //       const movie = new Movie({
  //         slug: 'oppenheimer',
  //         title: 'Oppenheimer',
  //         director: 'Christopher Nolan',
  //         runtime: '3h 1m',
  //         release_date: 'Jul 20th 2023',
  //         genre: 'Drame, Historie',
  //         description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
  //         poster:'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  //         trailer_id: 'NjlA8pKUavY'
  //       })
  //       await movie.save()
        
  //       response.send('Movie Created')
  //   }catch (error) {
  //       console.error(error)
  //       response.send('Error: Movie could not be created.')
  //   }
  // })



app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

//const details = JSON.parse(fs.readFileSync('./views/movies/details.json'));

// mongoose.connect('mongodb://127.0.0.1:27017/filmstarts')
mongoose.connect('mongodb+srv://oskue:6$e7UErJa.xMZNp@cluster0.uzhjuzp.mongodb.net/filmstarts?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Database is connected'))
    .catch (error => console.error(error))


app.get('/', (request, response) => {
    response.render('index')
})

app.get('/:slug', (request, response) => {
    response.render(request.params.slug)
    response.send('This Page does not exist.')
})

// app.get('/movies/:slug', (request, response) => {
//     const movieSlug = request.params.slug
//     const movieDetails = details.find(movie => movie.slug.toLowerCase().replace(/\s+/g, '-') === movieSlug);
//     if (movieDetails) {
//         response.render('./includes/movie-detail-view.ejs', { 
//             title: movieDetails.title,
//             release_date: movieDetails.release_date,
//             runtime: movieDetails.runtime,
//             director: movieDetails.director,
//             genre: movieDetails.genre,
//             description: movieDetails.description,
//             poster: movieDetails.poster,
//             trailer_id: movieDetails.trailer_id
//         });
//     } else {
//         response.render('error');
//     }
// });



const userSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    email:      { type: String, unique: true, required: true },
    password:   { type: String, required: true }, 
  })
  
  const User = mongoose.model('User', userSchema)


app.get('/sign-up', (request, response) => {
    response.render('sign-up')
  })


app.post('/users', async (request, response) => {
    try {
      const user = new User({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password
      })
      await user.save()
  
      response.send('User successfully Created')
    }catch (error) {
      console.error(error)
      response.send('Error: The User could not be created.')
    }
  })


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import morgan from 'morgan';  
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import favicon from 'serve-favicon';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
//app.use(morgan('tiny'));

app.set('view engine', 'ejs');
const PORT = 3000;

app.use(favicon(__dirname + '/public/image/Arrival_Walk.png'));


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
      })
    }
  })

  app.get('/user', async (request, response) => {
    try {
        const users = await User.find({}).exec();
        response.render('user', { users: users });
    } catch (error) {
        console.error(error);
        response.render('error', { message: 'Error retrieving users' });
    }
  })

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log('Database is connected'))
  .catch(error => console.error(error));


app.get('/', (request, response) => {
    response.render('index')  
})

app.get('/:slug', (request, response) => {
  try {
      response.render(request.params.slug, (err, html) => {
          if (err) {
              console.error(err);
              response.status(404).render('error');
          } else {
              response.send(html);
          }
      });
  } catch (error) {
      console.error(error);
      response.status(500).render('error');
  }
});

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

    response.redirect('/user')
  }catch (error) {
    console.error(error)
    response.send('Error: The User could not be created.')
  }
})

app.post('/users/:id/delete', async (request, response) => {
  try {
    const userId = request.params.id;
    await User.deleteOne({ _id: userId });
    response.redirect('/user');
  } catch (error) {
    console.error(error);
    response.send('Error: The User could not be deleted.');
  }
});

app.get('/users/:id/edit', async (request, response) => {
  try {
    const user = await User.findById(request.params.id).exec();
    if (!user) throw new Error('User not found');
    response.render('edit-user', { user: user });
  } catch (error) {
    console.error(error);
    response.render('error', { message: 'Error retrieving user for edit' });
  }
});

app.post('/users/:id/update', async (request, response) => {
  try {
    const userId = request.params.id;
    const updatedData = {
      name: request.body.name,
      email: request.body.email,
    };
    await User.findByIdAndUpdate(userId, updatedData, { new: true });
    response.redirect('/user');
  } catch (error) {
    console.error(error);
    response.send('Error: The User could not be updated.');
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})
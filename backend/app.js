const express = require('express')
const books = require('./books.json')

const PORT = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Funcionando' })
})

app.get('/books', (req, res) => {
  const { genre, author } = req.query

  // Busqueda de libros por genero
  if (genre) {
    const booksFiltered = books.filter(
      book => book.genre.some(
        g => g.toLowerCase() === genre.toLowerCase()
      ))

    return res.json(booksFiltered)
  }

  // Busqueda de libros por autor
  if (author) {
    // buscar coincidencias parciales (no es necesario poner el nombre completo del autor
    // ademas no es case sensitive)
    const booksFiltered = books.filter(book => book.author.replaceAll(' ', '').toLowerCase().includes(author.replaceAll(' ', '').toLowerCase()))

    return res.json(booksFiltered)
  }

  // Si no contiene query params devulve todos los libros
  return res.json(books)
})

// Búsqueda de un libro por su id
app.get('/books/:id', (req, res) => {
  const { id } = req.params

  const bookId = books.findIndex(book => book.id === id)

  if (bookId === -1) {
    return res.status(404).json({ message: 'El libro no existe' })
  }

  return res.json(books[bookId])
})

// otros metodos

// Eliminar un libro por su id
app.delete('/books/:id', (req, res) => {
  const { id } = req.params

  const bookId = books.findIndex(book => book.id === id)

  if (bookId === -1) {
    return res.status(404).json({ message: 'El libro no existe' })
  }

  const bookToDelete = books[bookId]
  books.splice(bookId, 1)
  return res.json(bookToDelete)
})

// Manejo de recurso no encontrado (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' })
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

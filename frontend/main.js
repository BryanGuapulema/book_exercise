// ======================
// DECLARACION DE VARIABLES
// ======================
const API_URL_BASE = 'http://localhost:1234/books'
let books = []

// Elementos del DOM
const booksContainer = document.getElementById('booksContainer')
const searchInput = document.getElementById('searchInput')
const newBookBtn = document.getElementById('newBookBtn')
const bookModal = document.getElementById('bookModal')
const closeModal = document.getElementById('closeModal')
const bookForm = document.getElementById('bookForm')

// ======================
// INIT
// ======================

document.addEventListener('DOMContentLoaded', async () => {
  books = await fetchBooks()
  // al cargar no hay texto de busqueda
  renderBooks(await filterBooks(''))
})

// ======================
// RENDERIZADO DE LIBROS
// ======================

function renderBooks (books) {
  booksContainer.innerHTML = ''

  if (books.length === 0) {
    booksContainer.innerHTML = '<p>No se eonctraron libros</p>'
  }

  books.forEach(book => {
    createBookCard(book)
  })
}

function createBookCard (book) {
  const card = document.createElement('div')
  card.className = 'book-card'

  card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Autor:</strong> ${book.author}</p>
      <p><strong>Año:</strong> ${book.year}</p>
      <p><strong>Género:</strong> ${book.genre.join(', ')}</p>
      <p><strong>Páginas:</strong> ${book.pages}</p>
      <div class="actions">
        <button class="btn-edit" data-id="${book.id}">Editar</button>
        <button class="btn-delete" data-id="${book.id}">Eliminar</button>
      </div>
    `

  // Eliminar
  card.querySelector('.btn-delete').addEventListener('click', () => {
    // deleteBook(book.id)
  })

  // Editar libro
  card.querySelector('.btn-edit').addEventListener('click', () => {
    // console.log('Editar libro:', book.id)
    // TODO: abrir modal con datos cargados y luego PATCH
  })

  booksContainer.appendChild(card)
}

// ======================
// BUSQUEDA DE LIBROS
// ======================
searchInput.addEventListener('input', debounce(
  async () => {
    const searchText = searchInput.value.trim()
    // despues de filtrar el texto renderiza los resultados
    renderBooks(await filterBooks(searchText))
  }, 500)
)

function debounce (fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

async function filterBooks (searchText) {
  if (searchText === '') return books
  const filteredBooks = await fetchBookswithFilters(searchText)
  return filteredBooks
}

// ======================
// CONSUMO DE LA API
// ======================

async function fetchBooks () {
  const books = await fetch(API_URL_BASE).then(res => res.json())
  return books
}

async function fetchBookswithFilters (queryText) {
  const [booksByGender, booksByAuthor] = await Promise.all([
    fetch(`${API_URL_BASE}?genre=${queryText}`).then(res => res.json()),
    fetch(`${API_URL_BASE}?author=${queryText}`).then(res => res.json())
  ])

  const uniqueBooks = mergeUniqueById(booksByGender, booksByAuthor)

  return uniqueBooks
}

function mergeUniqueById (arr1, arr2) {
  return Array.from(
    new Map([...arr1, ...arr2].map(item => [item.id, item]))
      .values()
  )
}

// ======================
// MANEJO DEL MODAL
// ======================

// Abrir modal
newBookBtn.addEventListener('click', openModalWindow)

// Cerrar modal
closeModal.addEventListener('click', closeModalWindow)

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === bookModal) closeModalWindow()
})

function openModalWindow () {
  bookModal.style.display = 'flex'
}

function closeModalWindow () {
  bookModal.style.display = 'none'
}

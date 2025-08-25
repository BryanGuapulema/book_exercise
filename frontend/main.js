// ======================
// DECLARACION DE VARIABLES
// ======================
const API_URL_BASE = 'http://localhost:1234/books'
let books = []
let editingBookId = null // bandera para saber si estamos editando o creando

// Elementos del DOM
const booksContainer = document.getElementById('booksContainer')
const searchInput = document.getElementById('searchInput')
const newBookBtn = document.getElementById('newBookBtn')
const bookModal = document.getElementById('bookModal')
const closeModal = document.getElementById('closeModal')
const modalError = document.getElementById('modalError')
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
  card.querySelector('.btn-delete').addEventListener('click', async () => {
    const result = await deleteBook(book.id)
    console.log(result)
    books = await fetchBooks()
    renderBooks(await filterBooks(''))
  })

  // Editar libro
  card.querySelector('.btn-edit').addEventListener('click', () => {
    editingBookId = book.id // guardamos id
    openModalWindow()

    // rellenar formulario con datos del libro
    document.getElementById('title').value = book.title
    document.getElementById('author').value = book.author
    document.getElementById('year').value = book.year
    document.getElementById('pages').value = book.pages

    // marcar géneros seleccionados
    const genreSelect = document.getElementById('genre')
    Array.from(genreSelect.options).forEach(opt => {
      opt.selected = book.genre.includes(opt.value)
    })
  })

  booksContainer.appendChild(card)
}

// ======================
// CREACION / EDICION DE LIBRO
// ======================
bookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const title = document.getElementById('title').value
  const author = document.getElementById('author').value
  const year = parseInt(document.getElementById('year').value)
  const pages = parseInt(document.getElementById('pages').value)
  const genre = Array.from(document.getElementById('genre').selectedOptions).map(opt => opt.value)

  const bookData = { title, author, year, pages, genre }

  if (editingBookId) {
    updateBook(editingBookId, bookData) // EDITAR LIBRO
  } else {
    addBook(bookData) // CREAR LIBRO
  }
})

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

async function addBook (newBook) {
  try {
    const res = await fetch(API_URL_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    })

    if (!res.ok) {
      const { error } = await res.json()
      showErrors(error)
    } else {
      // const book = await res.json()
      closeModalWindow()
      books = await fetchBooks()
      renderBooks(await filterBooks(''))
    }
  } catch (error) {
    console.error(error)
  }
}

async function updateBook (id, updatedBook) {
  try {
    const res = await fetch(`${API_URL_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBook)
    })

    if (!res.ok) {
      const { error } = await res.json()
      showErrors(error)
    } else {
      closeModalWindow()
      books = await fetchBooks()
      renderBooks(await filterBooks(''))
    }
  } catch (error) {
    console.error(error)
  }
}

async function deleteBook (id) {
  try {
    const res = await fetch(`http://localhost:1234/books/${id}`, {
      method: 'DELETE'
    })

    return await res.error
  } catch (error) {
    throw new Error(error)
  }
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
  modalError.innerHTML = ''
  bookModal.style.display = 'flex'
  bookForm.reset()
}

function closeModalWindow () {
  bookModal.style.display = 'none'
  editingBookId = null // EDITAR LIBRO: al cerrar modal, volvemos a modo "crear"
}

function showErrors (error) {
  let errorList = ''
  modalError.innerHTML = ''

  error.forEach(e => {
    errorList += `<strong>${e.path[0]}</strong> ${e.message} <br>`
  })

  modalError.innerHTML = errorList
  modalError.style.color = 'red'
}

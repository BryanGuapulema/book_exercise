const searchInput = document.querySelector('#searchInput')
const searchBtn = document.querySelector('#searchBtn')
const bookForm = document.querySelector('#bookForm')
const booksContainer = document.querySelector('#booksContainer')

const books = fetchBooks()

document.addEventListener('DOMContentLoaded', () => {
  console.log(books)
})

async function fetchBooks () {
  const books = await fetch('http://localhost:1234/books').then(res => res.json)
  return books
}

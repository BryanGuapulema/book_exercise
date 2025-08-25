# 📚 Proyecto: Gestor de Libros (Fullstack)

## 🎯 Objetivo
Construir una pequeña aplicación **fullstack** para gestionar libros, que permita **listar, agregar, actualizar, eliminar y buscar libros**.  

---

## 🛠️ Backend (Node.js + Express)

### Rutas requeridas
- `GET /books`
  - Devuelve todos los libros.✅
  - Permite filtrar por género (`/books?genre=Drama`)✅ o por autor (`/books?author=Asimov`).✅

- `GET /books/:id`
  - Devuelve un libro por su ID.✅
  - Si no existe, responde con `404`.✅

- `POST /books`
  - Crea un nuevo libro.✅
  - El objeto debe tener:
    ```json
    {
      "title": "string (min 3 caracteres)",
      "author": "string",
      "year": "number (1800 - 2025)",
      "genre": ["Drama", "Sci-Fi", "Fantasy", "History", "Horror"],
      "pages": "number (mínimo 10)"
    }
    ```
  - Validar con **Zod**.✅
  - Generar un `id` único con `crypto.randomUUID()`.✅

- `PATCH /books/:id`✅
  - Actualiza parcialmente un libro.
  - Validar con esquema parcial de Zod.

- `DELETE /books/:id`
  - Elimina un libro existente. ✅

### Datos iniciales
- Usar un archivo `books.json` con al menos 5 registros iniciales (IDs en formato UUID).✅

---

## 🖥️ Frontend (HTML + JS)

- ✅Página principal que muestre los libros en **tarjetas** con:
  - Título
  - Autor
  - Año
  - Género(s)
  - Páginas
  - Botón **Eliminar**
  - Botón **Editar**

- Formulario para **agregar un nuevo libro** con validación en el frontend. ✅

- Input de búsqueda:
  - Por **autor** o **género**.✅
  - Hace petición `fetch` a la API (`/books?author=X`).✅

- Confirmación al eliminar (`confirm("¿Seguro que deseas eliminar este libro?")`).✅

- Mostrar mensajes de error o éxito.✅

---


Usar el comando **npm run dev** en la carpeta raiz para desplegar el frontend y backend
al mismo tiempo

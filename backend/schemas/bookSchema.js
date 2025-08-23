const z = require('zod')

const bookSchema = z.object({
  title: z.string().min(3),
  author: z.string(),
  year: z.number().int().min(1800).max(2025),
  genre: z.array(
    z.enum(['Drama', 'Sci-Fi', 'Fantasy', 'History', 'Horror'])
  ),
  pages: z.number().int().min(10)
})

function validateBook (object) {
  return bookSchema.safeParse(object)
}

module.exports = {
  validateBook
}

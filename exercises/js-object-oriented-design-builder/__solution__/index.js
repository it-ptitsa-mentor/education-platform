export const genres = ['classic', 'detective', 'fantasy', 'science fiction'];

const isValidUrl = (value) => {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
};

const isValidBook = (book) => {
  if (typeof book.name !== 'string' || book.name === '') {
    return false;
  }
  if (typeof book.author !== 'string' || book.author === '') {
    return false;
  }
  if (book.pagesCount !== undefined
    && (!Number.isInteger(book.pagesCount) || book.pagesCount <= 0)) {
    return false;
  }
  if (book.link !== undefined
    && (typeof book.link !== 'string' || !isValidUrl(book.link))) {
    return false;
  }
  if (book.genre !== undefined && !genres.includes(book.genre)) {
    return false;
  }
  return true;
};

const getInvalidBooks = (books) => books.filter((book) => !isValidBook(book));

export default getInvalidBooks;

/* eslint-disable max-len */
/* eslint-disable eqeqeq */
const { query } = require('@hapi/hapi/lib/validation');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const id = +new Date();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const data = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  books.push(data);

  const isSucces = books.filter((book) => book.id === id).length > 0;

  if (isSucces) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;
  const filteredBooksByName = books.filter((book) => book.name === name);
  const filteredBooksByReading = books.filter((book) => book.reading === (reading === 1));
  const filteredBooksByFinished = books.filter((book) => book.finished === (reading === 1));

  if (name !== undefined) {
    query(filteredBooksByName, h);
  }

  if (reading !== undefined) {
    query(filteredBooksByReading, h);
  }

  if (finished !== undefined) {
    query(filteredBooksByFinished, h);
  }

  const data = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: data,
    },
  });

  response.code(200);
  return response;
};

const getBooksById = (req, h) => {
  const { bookId } = req.params;
  const data = books.find((book) => book.id == bookId);

  if (data !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: data,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const updateBookById = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id == bookId);
  const { name, pageCount, readPage } = req.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...req.payload,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookById = (req, h) => {
  const { bookId } = req.params;
  const index = books.findIndex((book) => book.id == bookId);

  books.splice(index, 1);

  if (index !== -1) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getBooksHandler, getBooksById, updateBookById, deleteBookById,
};

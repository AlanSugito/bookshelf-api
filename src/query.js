const query = (books, res) => {
  const data = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = res.response({
    status: 'success',
    data: {
      books: data,
    },
  });

  response.code(200);
  return response;
};

module.exports = query;

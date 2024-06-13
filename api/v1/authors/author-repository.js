const Author = require("./author-model");
const { Op } = require("sequelize");
const Book = require("../books/book-model");

const save = async (author) => {
  return Author.create(author);
};

const findAll = async (filter) => {
  const { name, birthDate, biography } = filter;

  const whereClause = {
    ...(name ? { name: { [Op.iLike]: `${name}%` } } : {}),
    ...(birthDate ? { birthDate: { [Op.eq]: birthDate } } : {}),
    ...(biography ? { biography: { [Op.iLike]: `%${biography}%` } } : {}),
  };

  return Author.findAll({
    where: whereClause,
  });
};

const findById = async (id) => {
  return Author.findOne({
    where: {
      id: id,
    },
  });
};

const deleteById = async (id) => {
  const books = await Book.findOne({
    where: {
      authorId: id,
    },
  });

  if (books) {
    throw new Error(
      "Não é possível deletar o autor que possui livros associados"
    );
  }

  await Author.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  save,
  findAll,
  findById,
  deleteById,
};

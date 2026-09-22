// In-memory user store. Data is lost when the server restarts.
let users = [];
let nextId = 1;

function findByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findById(id) {
  return users.find((u) => u.id === Number(id));
}

function createUser({ name, email, passwordHash }) {
  const user = {
    id: nextId++,
    name,
    email,
    passwordHash,
    cart: [], // { productId, quantity }
    wishlist: [], // productId[]
  };
  users.push(user);
  return user;
}

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  toPublicUser,
};

import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@email.com",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "John@email.com",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: false,
  },
  {
    name: "Jane Doer",
    email: "jane@email.com",
    password: bcrypt.hashSync("1234567", 10),
    isAdmin: false,
  },
];

export default users;

const { z } = require("zod");
// harus match dengan schema database di directory "./config/shcema-database"

const userSchema = z.object({
  id: z.number(),
  fullname: z.string().max(100),
  image: z.string().max(255).optional(),
  role: z.string().max(255),
  username: z.string().max(100),
  password: z.string().max(100),
  createat: z.date(),
  updateat: z.date(),
});
const register = userSchema.omit({
  id: true,
});
module.exports = { userSchema, register };

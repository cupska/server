const { z } = require("zod");

exports.productSchema = z.object({
  id: z.number().max(255).optional(),
  name: z.string().max(100),
  image: z.any(),
  sell_price: z.number(),
  buy_price: z.number(),
  category_id: z.number(),
  amount: z.coerce.number(),
  updated_at: z.date().optional(),
  created_at: z.date().optional(),
});

exports.addProductSchema = this.productSchema;

import path from "path";
import express from "express";
import dotevn from "dotenv";
import cookieParser from "cookie-parser";
dotevn.config();
import products from "./data/products.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleWare.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
const port = process.env.PORT || 5000;
connectDB();

const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(cookieParser());

// app.get('/api/products', (req, res) => {
//   res.json(products);
// })

// app.get('/api/products/:id', (req, res) => {
//   const product = products.find((p) => p._id === req.params.id);
//   res.json(product);
// })

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  // any route that is not api will be redirected to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server running on port ${port}`));
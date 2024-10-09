import express from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema.js";
import connectDB from "./db.js";
import cors from "cors";
import path from "path";

const __dirname = path.resolve();

dotenv.config();

const app = express();

connectDB();

const port = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend URL
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    Credentials: "same origin",
  })
);
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "production",
  })
);

// Serve static files in production

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

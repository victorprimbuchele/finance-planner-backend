import express from "express";
import routes from "./routes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(routes);

const port = 3333;

app.listen(port, () => console.log(`[server]: Listening on port ${port}`));

import express from "express";
import { routes } from "./routes";
import { errorHandling } from "./middleware/error-handling";
import cors from "cors";

const app = express();
const PORT = 3333;


app.use(cors());

app.use(express.json())
app.use(routes)

app.use(errorHandling)

app.listen(PORT, () => {
  console.log(`Server esta rodando na porta ${PORT}`);
});

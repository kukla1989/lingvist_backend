import express from "express";
import wordRoutes from "./routes/word";

const app = express();

app.use(express.json());
app.use("/words", wordRoutes);

export default app;

import express from "express";
import helmet from "helmet";
import cors from "cors";

import { PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

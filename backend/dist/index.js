import express from "express";
import cors from "cors";
import { visualizeRouter } from "./routes/visualize.js";
import { analyzeRouter } from "./routes/analyze.js";
const app = express();
const PORT = Number(process.env.PORT) || 4000;
app.use(cors());
app.use(express.json({ limit: "512kb" }));
app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "eduviz-backend" });
});
app.use("/api/visualize", visualizeRouter);
app.use("/api/analyze-code", analyzeRouter);
app.use((err, _req, res, _next) => {
    const message = err instanceof Error ? err.message : "Internal error";
    res.status(500).json({ error: message });
});
app.listen(PORT, () => {
    console.log(`EduViz backend listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get("/", (_req, res) => {
    return res.send("Express Typescript on Vercel");
});
app.get("/ping", (_req, res) => {
    return res.send("pong 🏓");
});
app.get("/api", (_req, res) => {
    const path = `/api/item/${(0, uuid_1.v4)()}`;
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});
app.get("/api/item/:slug", (req, res) => {
    const { slug } = req.params;
    res.end(`Item: ${slug}`);
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map
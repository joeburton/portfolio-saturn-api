"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const pirates_1 = require("./pirates");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: process.env.FRONT_END_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
}));
app.use(express_1.default.json());
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
app.get("/pirates", (_req, res) => {
    try {
        if (pirates_1.pirates && pirates_1.pirates.length > 0) {
            let tableContent = pirates_1.pirates
                .map((user) => `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
            </tr>`)
                .join("");
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
            res.end(`
                <html>
                    <head>
                        <title>Pirates</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-bottom: 15px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                            a {
                                text-decoration: none;
                                color: #0a16f7;
                                margin: 15px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Pirates</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Pirate ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableContent}
                            </tbody>
                        </table>
                        <div>
                            <a href="/add-pirate">Add Pirate</a>
                        </div>
                    </body>
                </html>
            `);
        }
        else {
            res.status(404).send("Pirates not found");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving pirates");
    }
});
app.get("/pirates-data", (_req, res) => {
    res.status(200).json({
        pirates: pirates_1.pirates,
    });
});
app.post("/mailsender", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    const name = (_a = req.body) === null || _a === void 0 ? void 0 : _a.name;
    const email = (_b = req.body) === null || _b === void 0 ? void 0 : _b.email;
    const phoneNumber = (_c = req.body) === null || _c === void 0 ? void 0 : _c.phoneNumber;
    const message = (_d = req.body) === null || _d === void 0 ? void 0 : _d.message;
    const msg = {
        to: "joeburton@gmail.com",
        from: "joeburton@gmail.com",
        subject: `Enquiry from ${email}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}`,
        html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone Number: ${phoneNumber}</p><p>Message: ${message}</p>`,
    };
    try {
        const response = yield mail_1.default.send(msg);
        res.status(200).json({
            message: "Success",
            postData: {
                name,
                email,
                phoneNumber,
                message,
            },
            response,
        });
    }
    catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body);
            res.status(500).send("Email failed to send");
        }
    }
}));
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map
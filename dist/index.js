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
const uuid_1 = require("uuid");
const pirates_1 = require("./pirates");
const mail_1 = __importDefault(require("@sendgrid/mail"));
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
app.get("/pirates", (_req, res) => {
    try {
        if (pirates_1.pirates && pirates_1.pirates.rows.length > 0) {
            let tableContent = pirates_1.pirates.rows
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
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
app.get("sendmail", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = "Jill Hill";
    const email = "jillhill@hotmail.com";
    const phoneNumber = "0668932134";
    const message = "I have a fascinating proposition for you Joe, please do get in touch!";
    const msg = {
        to: "joeburton@gmail.com",
        from: "joeburton@gmail.com",
        subject: "New Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}`,
        html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone Number: ${phoneNumber}</p><p>Message: ${message}</p>`,
    };
    try {
        const response = yield mail_1.default.send(msg);
        res.end(`Mail sent: ${response}`);
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
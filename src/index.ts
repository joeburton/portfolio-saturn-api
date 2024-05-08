import express, { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import { v4 } from "uuid";
import dotenv from "dotenv";
import cors from "cors";

import { pirates } from "./pirates";

const app = express();
const port = process.env.PORT || 8080;

dotenv.config();

app.use(
  cors({
    origin: process.env.FRONT_END_URL, // specify the origin for CORS
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // specify the methods for CORS
    credentials: true, // Access-Control-Allow-Credentials CORS header. Set to true to pass the header, otherwise it is omitted.
  })
);

console.log(process.env.NODE_ENV);

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.get("/api", (_req: Request, res: Response) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

app.get("/pirates", (_req: Request, res: Response) => {
  try {
    if (pirates && pirates.rows.length > 0) {
      let tableContent = pirates.rows
        .map(
          (user) =>
            `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
            </tr>`
        )
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
    } else {
      res.status(404).send("Pirates not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving pirates");
  }
});

app.get("/pirates-data", (_req: Request, res: Response) => {
  res.status(200).json({
    pirates,
  });
});

app.post("/sendmail", (req: Request, res: Response) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  console.log(req.body);

  const name = req.body?.name;
  const email = req.body?.email;
  const phoneNumber = req.body?.phoneNumber;
  const message = req.body?.message;

  const msg = {
    to: "joeburton@gmail.com", // email address that will receive message
    from: "joeburton@gmail.com", // @sendgrid/mail registered email
    subject: `Enquiry from ${email}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}`,
    html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone Number: ${phoneNumber}</p><p>Message: ${message}</p>`,
  };

  try {
    // await sgMail.send(msg);
    res.status(200).json({
      message: "Success",
      data: {
        name,
        email,
        phoneNumber,
        message,
      },
    });
    console.log("email sent");
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
      res.status(500).send("Email failed to send");
    }
  }
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

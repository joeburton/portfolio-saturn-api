import express, { Request, Response } from "express";
import { v4 } from "uuid";
import { pirates } from "./pirates";
import sgMail from "@sendgrid/mail";

const app = express();
const port = process.env.PORT || 8080;

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

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: "maxsmith@gmail.com", // Sender
  from: "joeburton@gmail.com", // Recipient: Use the email address or domain you verified above
  subject: "Senior Frontend Engineer Role",
  text: "We have a whole world of Development challenges waiting for you.",
  html: "<strong>You will be using AI, ohhh wow I hear you cry... removed</strong>",
};

app.get("sendmail", async (_req: Request, res: Response) => {
  try {
    const response = await sgMail.send(msg);
    res.end(`Mail sent: ${response}`);
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

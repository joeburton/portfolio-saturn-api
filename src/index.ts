import express, { Request, Response } from "express";
import { v4 } from "uuid";

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
    const pirates = {
      rows: [
        {
          id: "234234",
          name: "Captain Hook",
          email: "captainhook@hook.com",
        },
        {
          id: "345345",
          name: "Blackbeard",
          email: "blackbeard@pirates.com",
        },
        {
          id: "456456",
          name: "William Kidd",
          email: "williamkidd@pirates.com",
        },
        {
          id: "567567",
          name: "Bartholomew Roberts",
          email: "bartholomewroberts@pirates.com",
        },
        {
          id: "678678",
          name: "Anne Bonny",
          email: "annebonny@pirates.com",
        },
        {
          id: "789789",
          name: "Edward Teach",
          email: "edwardteach@pirates.com",
        },
        {
          id: "890890",
          name: "Calico Jack",
          email: "calicojack@pirates.com",
        },
        {
          id: "901901",
          name: "Henry Morgan",
          email: "henrymorgan@pirates.com",
        },
        {
          id: "012012",
          name: "Francis Drake",
          email: "francisdrake@pirates.com",
        },
        {
          id: "123123",
          name: "Samuel Bellamy",
          email: "samuelbellamy@pirates.com",
        },
      ],
    };

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

app.get("/renegades", (_req: Request, res: Response) => {
  const pirates = {
    rows: [
      {
        id: "234234",
        name: "Captain Hook",
        email: "captainhook@hook.com",
      },
      {
        id: "345345",
        name: "Blackbeard",
        email: "blackbeard@pirates.com",
      },
      {
        id: "456456",
        name: "William Kidd",
        email: "williamkidd@pirates.com",
      },
      {
        id: "567567",
        name: "Bartholomew Roberts",
        email: "bartholomewroberts@pirates.com",
      },
      {
        id: "678678",
        name: "Anne Bonny",
        email: "annebonny@pirates.com",
      },
      {
        id: "789789",
        name: "Edward Teach",
        email: "edwardteach@pirates.com",
      },
      {
        id: "890890",
        name: "Calico Jack",
        email: "calicojack@pirates.com",
      },
      {
        id: "901901",
        name: "Henry Morgan",
        email: "henrymorgan@pirates.com",
      },
      {
        id: "012012",
        name: "Francis Drake",
        email: "francisdrake@pirates.com",
      },
      {
        id: "123123",
        name: "Samuel Bellamy",
        email: "samuelbellamy@pirates.com",
      },
    ],
  };
  const rows = pirates.rows.map(
    (pirate) => `<li>${pirate.name}, ${pirate.email}</li>`
  );
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Display list of pirates: <ul>${rows}</ul>`);
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});

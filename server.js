import express from "express";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send(
    `Swagger UI is located at: <a href="http://localhost:${port}/docs">http://localhost:${port}/docs</a>`
  );
});

app.get("/me", (req, res) => {
  const user = { name: "Stoyan", id: 1 };

  const authentications = [];

  let isAuthenticated = false;

  const authorizationHeaderValue = req.headers["authorization"];

  if (authorizationHeaderValue !== undefined) {
    authentications.push(
      `Header: 'Authorization: ${authorizationHeaderValue}'`
    );

    const [type, value] = authorizationHeaderValue.split(" ");

    if (
      type === "Basic" &&
      value === "c2ltcGxlLXVzZXJuYW1lOnNpbXBsZS1wYXNzd29yZA=="
    ) {
      isAuthenticated = true;
    } else if (type === "Bearer" && value === "simple-bearer-token") {
      isAuthenticated = true;
    }
  }

  const keyQueryValue = req.query["key"];

  if (keyQueryValue !== undefined) {
    authentications.push(`Query: 'key=${keyQueryValue}'`);

    if (keyQueryValue === "simple-api-token") {
      isAuthenticated = true;
    }
  }

  if (isAuthenticated) {
    res.send({ ...user, authentications });
  } else {
    res.status(401).send({
      status: 401,
      title: "Unauthorized",
      detail: "Access denied!",
      authentications,
    });
  }
});

app.use("/docs/swagger.json", async (req, res) =>
  res.send((await import("./swagger.json", { with: { type: "json" } })).default)
);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/docs/swagger.json",
    },
  })
);

app.listen(port, () => {
  console.log(
    `Example app listening on http://localhost:${port}\nSwagger UI listening on http://localhost:${port}/docs`
  );
});

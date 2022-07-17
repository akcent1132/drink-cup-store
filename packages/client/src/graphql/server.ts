import { setupWorker, rest } from "msw";

const worker = setupWorker(
  rest.post("/login", (req, res, ctx) => {
    return res(ctx.json({
      firstName: "John",
    }));
  })
);

// Register the Service Worker and enable the mocking

worker.start();

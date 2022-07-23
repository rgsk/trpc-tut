import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

interface ChatMessage {
  user: string;
  message: string;
}

const messages: ChatMessage[] = [
  { user: "user1", message: "Hello" },
  { user: "user2", message: "Hi" },
];

const appRouter = trpc
  .router()
  .query("hello", {
    resolve() {
      return "Hello world 1234";
    },
  })
  .query("getMessages", {
    input: z.number().default(10),
    resolve({ input }) {
      // this will return last 10 messages
      return messages.slice(-input);
    },
  })
  .mutation("addMessage", {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input: { user, message } }) {
      messages.push({ user, message });
      return { user, message };
    },
  });
export type AppRouter = typeof appRouter;
const app = express();
app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});

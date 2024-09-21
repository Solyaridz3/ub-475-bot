import express from "express";
import "dotenv/config";
import { handler } from "./controller/index.js";

const PORT = process.env.PORT || 4040;
const app = express();

app.use(express.json());

app.post("*", async (req, res) => {
  res.send(await handler(req));
});

app.get("*", async (req, res) => {
  res.send(
    "<h3>That link just a webhook for telegram bot right here <a href='https://t.me/ub_475_bot'>Link</a></h3> ",
  );
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server listening on PORT", PORT);
});

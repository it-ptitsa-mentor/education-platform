import http from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../checker.js");
  const fn = mod.default ?? mod.getBadLinks;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getBadLinks (export default)");
  }
  return fn;
};

let server;
let baseUrl;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<html><body>
        <a href="${baseUrl}/ok">ok</a>
        <a href="${baseUrl}/missing">missing</a>
        <a href="${baseUrl}/error">error</a>
      </body></html>`);
      return;
    }
    if (req.url === "/ok") {
      res.writeHead(200);
      res.end("fine");
      return;
    }
    if (req.url === "/missing") {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    res.writeHead(500);
    res.end("boom");
  });
  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

describe("js-asynchronous-programming-http", () => {
  it("возвращает список битых ссылок", async () => {
    const getBadLinks = await loadFunction();
    const badLinks = await getBadLinks(`${baseUrl}/`);
    expect(badLinks.sort()).toEqual([`${baseUrl}/error`, `${baseUrl}/missing`]);
  });
});

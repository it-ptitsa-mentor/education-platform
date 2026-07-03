import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../TcpConnection.js");
  const TcpConnection = mod.default ?? mod.TcpConnection;
  if (typeof TcpConnection !== "function") {
    throw new Error("Экспортируйте класс TcpConnection (export default)");
  }
  return TcpConnection;
};

describe("js-polymorphism-state-pattern", () => {
  it("переключает состояния connect/disconnect", async () => {
    const TcpConnection = await loadClass();
    const connection = new TcpConnection("132.223.243.88", 2342);
    expect(connection.getCurrentState()).toBe("disconnected");
    connection.connect();
    expect(connection.getCurrentState()).toBe("connected");
    connection.write("data");
    connection.disconnect();
    expect(connection.getCurrentState()).toBe("disconnected");
  });

  it("бросает исключения при недопустимых операциях", async () => {
    const TcpConnection = await loadClass();
    const connection = new TcpConnection("132.223.243.88", 2342);
    expect(() => connection.disconnect()).toThrow();
    expect(() => connection.write("data")).toThrow();
    connection.connect();
    expect(() => connection.connect()).toThrow();
  });
});

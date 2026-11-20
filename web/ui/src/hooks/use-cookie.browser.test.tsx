import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { useCookie } from "./use-cookie";

// Requires Vitest browser (Chromium): cookieStore is not available in jsdom.

function Probe({ name }: { name: string }) {
  const value = useCookie(name);
  return (
    <span data-testid="cookie">{value === null ? "null" : String(value)}</span>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("useCookie", () => {
  let cookieName: string;

  beforeEach(() => {
    cookieName = `use-cookie-${crypto.randomUUID()}`;
  });

  afterEach(async () => {
    cleanup();
    await cookieStore.delete(cookieName);
  });

  test("missing cookie stays null", async () => {
    render(<Probe name={cookieName} />);
    expect(screen.getByTestId("cookie").textContent).toBe("null");
    await delay(50);
    expect(screen.getByTestId("cookie").textContent).toBe("null");
  });

  test("reads an existing cookie", async () => {
    await cookieStore.set({ name: cookieName, value: "en-US" });
    render(<Probe name={cookieName} />);
    await expect
      .poll(() => screen.getByTestId("cookie").textContent)
      .toBe("en-US");
  });

  test("updates when the cookie changes", async () => {
    render(<Probe name={cookieName} />);
    await expect
      .poll(() => screen.getByTestId("cookie").textContent)
      .toBe("null");

    await cookieStore.set({ name: cookieName, value: "he-IL" });
    await expect
      .poll(() => screen.getByTestId("cookie").textContent)
      .toBe("he-IL");
  });

  test("clears when the cookie is deleted", async () => {
    await cookieStore.set({ name: cookieName, value: "es-US" });
    render(<Probe name={cookieName} />);
    await expect
      .poll(() => screen.getByTestId("cookie").textContent)
      .toBe("es-US");

    await cookieStore.delete(cookieName);
    await expect
      .poll(() => screen.getByTestId("cookie").textContent)
      .toBe("null");
  });

  test("does not set state after unmount", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const { unmount } = render(<Probe name={cookieName} />);
    await expect
      .poll(() => screen.getByTestId("cookie").textContent)
      .toBe("null");

    unmount();
    await cookieStore.set({ name: cookieName, value: "after-unmount" });
    await delay(50);

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("tears down the old listener when the name changes", async () => {
    const other = `${cookieName}-b`;
    await cookieStore.set({ name: cookieName, value: "a" });
    await cookieStore.set({ name: other, value: "b" });

    const { rerender } = render(<Probe name={cookieName} />);
    await expect.poll(() => screen.getByTestId("cookie").textContent).toBe("a");

    rerender(<Probe name={other} />);
    await expect.poll(() => screen.getByTestId("cookie").textContent).toBe("b");

    await cookieStore.set({ name: cookieName, value: "stale" });
    await delay(50);
    expect(screen.getByTestId("cookie").textContent).toBe("b");

    await cookieStore.delete(other);
  });

  test("ignores unrelated cookie changes", async () => {
    await cookieStore.set({ name: cookieName, value: "keep" });
    render(<Probe name={cookieName} />);
    await expect
      .poll(() => screen.getByTestId("cookie").textContent)
      .toBe("keep");

    const other = `${cookieName}-other`;
    await cookieStore.set({ name: other, value: "noise" });
    await delay(50);
    expect(screen.getByTestId("cookie").textContent).toBe("keep");

    await cookieStore.delete(other);
  });
});

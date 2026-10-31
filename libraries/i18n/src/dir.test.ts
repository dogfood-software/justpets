import { afterEach, describe, expect, it, vi } from "vitest";
import { dir } from "./dir";

describe("dir", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns ltr for null, undefined, empty, and non-string values", () => {
    expect(dir(null)).toBe("ltr");
    expect(dir(undefined)).toBe("ltr");
    expect(dir("")).toBe("ltr");
    // @ts-expect-error — runtime guard for unexpected callers
    expect(dir(1)).toBe("ltr");
  });

  it("returns rtl for right-to-left locales", () => {
    expect(dir("he")).toBe("rtl");
    expect(dir("ar")).toBe("rtl");
    expect(dir("fa")).toBe("rtl");
    expect(dir("ur")).toBe("rtl");
    expect(dir("yi")).toBe("rtl");
    expect(dir("he-IL")).toBe("rtl");
    expect(dir("ar-EG")).toBe("rtl");
  });

  it("returns ltr for left-to-right locales", () => {
    expect(dir("en")).toBe("ltr");
    expect(dir("fr")).toBe("ltr");
    expect(dir("ja")).toBe("ltr");
    expect(dir("en-US")).toBe("ltr");
    expect(dir("zh-Hans-CN")).toBe("ltr");
  });

  it("prefers script when present on the locale tag", () => {
    expect(dir("en-Arab")).toBe("rtl");
    expect(dir("en-Hebr")).toBe("rtl");
    expect(dir("ar-Latn")).toBe("ltr");
  });

  it("falls back to ltr when Intl.Locale throws", () => {
    vi.stubGlobal("Intl", {
      ...Intl,
      Locale: class {
        constructor() {
          throw new RangeError("Invalid language tag");
        }
      },
    });

    expect(dir("he")).toBe("ltr");
    expect(dir("en")).toBe("ltr");
    expect(dir("not a locale!!!-Hebr")).toBe("ltr");
  });
});

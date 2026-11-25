import { describe, expect, it } from "vitest";
import { PACKAGE_NAME } from "../src/index";

describe("@granary/web scaffold", () => {
  it("exposes its package name", () => {
    expect(PACKAGE_NAME).toBe("@granary/web");
  });
});

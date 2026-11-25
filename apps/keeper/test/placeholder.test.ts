import { describe, expect, it } from "vitest";
import { PACKAGE_NAME } from "../src/index";

describe("@granary/keeper scaffold", () => {
  it("exposes its package name", () => {
    expect(PACKAGE_NAME).toBe("@granary/keeper");
  });
});

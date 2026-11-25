import { describe, expect, it } from "vitest";
import { PACKAGE_NAME } from "../src/index";

describe("@granary/x402-seller scaffold", () => {
  it("exposes its package name", () => {
    expect(PACKAGE_NAME).toBe("@granary/x402-seller");
  });
});

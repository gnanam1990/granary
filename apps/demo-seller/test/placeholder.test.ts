import { describe, expect, it } from "vitest";
import { PACKAGE_NAME } from "../src/index";

describe("@granary/demo-seller scaffold", () => {
  it("exposes its package name", () => {
    expect(PACKAGE_NAME).toBe("@granary/demo-seller");
  });
});

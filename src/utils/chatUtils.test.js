import { normalizeImageUrl, formatChatTimestamp } from "./chatUtils";

describe("chat utilities", () => {
  it("extracts a clean image URL from markdown-style photo values", () => {
    expect(
      normalizeImageUrl(
        "[https://example.com/avatar.png](https://example.com/avatar.png)",
      ),
    ).toBe("https://example.com/avatar.png");
  });

  it("formats recent chat timestamps as compact labels", () => {
    const now = new Date("2026-07-02T06:46:47.126Z");
    const past = new Date(now.getTime() - 1000 * 60 * 15);
    expect(formatChatTimestamp(past, now)).toBe("6:31");
  });
});

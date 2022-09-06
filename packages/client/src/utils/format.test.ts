import { formatValue } from "./format";

describe('replaces "_" with spaces', () => {
  [
    { inp: "foo_bar", out: "foo bar" },
    { inp: "_foo_bar_", out: "foo bar" },
    { inp: "foo__bar", out: "foo  bar" },
    { inp: "foo-bar", out: "foo-bar" },
    { inp: " foo bar ", out: "foo bar" },
  ].forEach(({ inp, out }) => {
    it(`"${inp}" => "${out}"`, () => {
      expect(formatValue(inp)).toBe(out);
    });
  });
});

describe("converts objects to json", () => {
  [
    { inp: { foo: "bar" }, out: '{"foo":"bar"}' },
    { inp: ["foo"], out: '["foo"]' },
  ].forEach(({ inp, out }) => {
    it(`"${inp}" => "${out}"`, () => {
      expect(formatValue(inp)).toBe(out);
    });
  });
});

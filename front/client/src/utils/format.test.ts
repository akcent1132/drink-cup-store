import { formatValue, prettyKey } from "./format";

describe("formatValue", () => {
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
});

describe("prettyKey", () => {
  [
    { inp: "foo_bar", out: "Foo Bar" },
    { inp: "_foo-bar_", out: "Foo Bar" },
    { inp: "foo_barBaz", out: "Foo Barbaz" },
  ].forEach(({ inp, out }) => {
    it(`"${inp}" => "${out}"`, () => {
      expect(prettyKey(inp)).toBe(out);
    });
  });
});

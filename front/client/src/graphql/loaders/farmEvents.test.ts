import { formatValue, prettyKey } from "../../utils/format";
import { convertEventDetails } from "./farmEvents";

describe("remove empty values", () => {
  [null, undefined].forEach((emptyValue) => {
    it(`removes ${JSON.stringify(emptyValue)}`, () => {
      const details = convertEventDetails(
        {
          something: "foo",
          empty: emptyValue,
        },
        "id"
      );
      expect(details).toContainEqual(
        expect.objectContaining({ name: prettyKey("something"), value: "foo" })
      );
      expect(details).not.toContainEqual(
        expect.objectContaining({ name: prettyKey("empty") })
      );
    });
  });
});

describe("converts Quantity values", () => {
  const tests = [
    [
      { "Quantity 1": "(Glyphosate  volume)  Label rate" },
      prettyKey("Glyphosate  volume"),
      "Label rate",
    ],
    [
      { "Quantity 2": " (s weight ) 6 lbs acre" },
      prettyKey("s weight"),
      "6 lbs acre",
    ],
    [{ "Not *uantity": "(foo) bar" }, prettyKey("Not *uantity"), "(foo) bar"],
    [
      { "Quantity 1": "invalid (format)" },
      prettyKey("Quantity 1"),
      "invalid (format)",
    ],
    [{ "Quantity 1": "(   )  " }, prettyKey("Quantity 1"), "(   )"],
  ].forEach(([input, name, value]) => {
    it(`${JSON.stringify(input)} => "${name}": "${value}"`, () => {
      const details = convertEventDetails(input, "id");
      expect(details).toContainEqual(expect.objectContaining({ name, value }));
    });
  });
});

describe("parse Notes", () => {
  const tests = [
    {
      description: "Ignores empty notes",
      input: { Notes: null },
      expected: [],
    },
    {
      description: "Reads values from notes",
      input: { Notes: { value: '{"class":"synth pre emergent"}' } },
      expected: [{ name: prettyKey("class"), value: "synth pre emergent" }],
    },
    {
      description: "Reads multiple values from notes",
      input: { Notes: { value: '{"fuz":"baz","foo":"bar"}' } },
      expected: [
        { name: prettyKey("fuz"), value: "baz" },
        { name: prettyKey("foo"), value: "bar" },
      ],
    },
    {
      description: "Ignores nodes without 'value' field",
      input: { Notes: { format: '{"format":"default"}' } },
      expected: [
        {
          name: prettyKey("Notes"),
          value: formatValue({ format: '{"format":"default"}' }),
        },
      ],
    },
    {
      description: "Keeps Notes if value is invalid json",
      input: { Notes: { value: '{""""""""class":"synth_pre_emergent"}' } },
      expected: [
        {
          name: prettyKey("Notes"),
          value: formatValue({
            value: '{""""""""class":"synth_pre_emergent"}',
          }),
        },
      ],
    },
  ].forEach(({ description, input, expected }) => {
    it(description, () => {
      const details = convertEventDetails(input, "id");
      expect(details).toHaveLength(expected.length);
      expected.forEach((detail) =>
        expect(details).toContainEqual(expect.objectContaining(detail))
      );
    });
  });
});

describe("converts '_' to spaces", () => {
  [
    {
      input: { foo_bar: "bax_baz" },
      name: prettyKey("foo bar"),
      value: "bax baz",
    },
    {
      input: { foo_bar_: "_bax_baz__" },
      name: prettyKey("foo bar"),
      value: "bax baz",
    },
  ].forEach(({ input, name, value }) => {
    it(`${JSON.stringify(input)} => "${name}": "${value}"`, () => {
      const details = convertEventDetails(input, "id");
      expect(details).toContainEqual(expect.objectContaining({ name, value }));
    });
  });
});

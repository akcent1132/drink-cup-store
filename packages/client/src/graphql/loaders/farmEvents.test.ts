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
        expect.objectContaining({ name: "something", value: "foo" })
      );
      expect(details).not.toContainEqual(
        expect.objectContaining({ name: "empty" })
      );
    });
  });
});

describe("converts Quantity values", () => {
  const tests = [
    [
      { "Quantity 1": "(Glyphosate  volume)  Label rate" },
      "Glyphosate  volume",
      "Label rate",
    ],
    [{ "Quantity 2": " (s weight ) 6 lbs acre" }, "s weight", "6 lbs acre"],
    [{ "Not *uantity": "(foo) bar" }, "Not *uantity", "(foo) bar"],
    [{ "Quantity 1": "invalid (format)" }, "Quantity 1", "invalid (format)"],
    [{ "Quantity 1": "(   )  " }, "Quantity 1", "(   )"],
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
      expected: [{ name: "class", value: "synth pre emergent" }],
    },
    {
      description: "Reads multiple values from notes",
      input: { Notes: { value: '{"fuz":"baz","foo":"bar"}' } },
      expected: [
        { name: "fuz", value: "baz" },
        { name: "foo", value: "bar" },
      ],
    },
    {
      description: "Ignores nodes without 'value' field",
      input: { Notes: { format: '{"format":"default"}' } },
      expected: [
        {
          name: "Notes",
          value: JSON.stringify({ format: '{"format":"default"}' }, null, 2),
        },
      ],
    },
    {
      description: "Keeps Notes if value is invalid json",
      input: { Notes: { value: '{""""""""class":"synth_pre_emergent"}' } },
      expected: [
        {
          name: "Notes",
          value: JSON.stringify(
            { value: '{""""""""class":"synth_pre_emergent"}' },
            null,
            2
          ),
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
    { input: { foo_bar: "bax_baz" }, name: "foo bar", value: "bax baz" },
    { input: { foo_bar_: "_bax_baz__" }, name: "foo bar", value: "bax baz" },
  ].forEach(({ input, name, value }) => {
    it(`${JSON.stringify(input)} => "${name}": "${value}"`, () => {
      const details = convertEventDetails(input, "id");
      expect(details).toContainEqual(expect.objectContaining({ name, value }));
    });
  });
});

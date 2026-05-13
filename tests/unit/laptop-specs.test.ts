import { describe, expect, it } from "vitest";
import {
  extractJsonObject,
  parseAiInsight,
} from "@/lib/specs/laptop-specs";

describe("laptop-specs AI JSON parsing", () => {
  it("parses fenced JSON", () => {
    const raw = 'Here you go:\n```json\n{"summary":"Hyvä","specPageUrl":"https://notebookcheck.net/x"}\n```';
    const o = extractJsonObject(raw);
    expect(parseAiInsight(o)).toEqual({
      summary: "Hyvä",
      specUrl: "https://notebookcheck.net/x",
    });
  });

  it("rejects invalid spec URL", () => {
    const o = extractJsonObject('{"summary":"A","specPageUrl":"ftp://bad"}');
    expect(parseAiInsight(o)).toEqual({ summary: "A", specUrl: null });
  });

  it("accepts specUrl and link aliases", () => {
    const o = extractJsonObject(
      '{"summary":"OK","specUrl":"https://dell.com/support/1"}',
    );
    expect(parseAiInsight(o)).toEqual({
      summary: "OK",
      specUrl: "https://dell.com/support/1",
    });
    expect(
      parseAiInsight(
        extractJsonObject(
          '{"yhteenveto":"Fi","link":"https://notebookcheck.net/x"}',
        ),
      ),
    ).toEqual({
      summary: "Fi",
      specUrl: "https://notebookcheck.net/x",
    });
  });

  it("strips BOM before JSON parse", () => {
    const o = extractJsonObject(
      '\uFEFF{"summary":"BOM","specPageUrl":"https://example.com/a"}',
    );
    expect(parseAiInsight(o)).toEqual({
      summary: "BOM",
      specUrl: "https://example.com/a",
    });
  });
});

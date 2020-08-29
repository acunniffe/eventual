import { Event, IEventBuilder } from './EventBuilder';
//@ts-ignore
import jsonic from 'jsonic';
//@ts-ignore
import niceTry from 'nice-try';
// Regexes
const matchAll = require('string.prototype.matchall');
matchAll.shim();

const getLinesFromMarkdown = /^((?:DRAFT |))\[([A-Z]{2,}[-][0-9]{1,5})\](.*)(?:\n```[a-z]*\n([\s\S]*?)\n```|)/gm;
const simpleVariableRegex = /\$([\w]+)/g;

export function extractRawTagsFromMarkdown(
  filePath: string,
  fileContents: string
): ITagParseResult[] {
  const groups = [...fileContents.matchAll(getLinesFromMarkdown)];
  return groups.map((match) => {
    const isDraft = match[1].startsWith('DRAFT');
    const lockKey = match[2];
    const rawSentence = match[3].trim();

    const rawJson = match[4] ? match[4].trim() : undefined;
    const parsedJson = niceTry(() => jsonic(rawJson));

    console.log(rawJson);
    console.log(parsedJson);

    const line =
      Array.from(fileContents.substring(0, match.index!)).filter(
        (i) => i === '\n'
      ).length + 1;

    return {
      isDraft,
      filePath,
      lockKey,
      line,
      rawSentence,
      rawJson,
      parsedJson,
      eventBuilder: Event(
        rawSentence,
        lockKey,
        isDraft,
        filePath,
        line,
        parsedJson
      ),
    };
  });
}

export interface ITagParseResult {
  isDraft: boolean;
  filePath: string;
  line: number;
  lockKey: string;
  rawSentence: string;
  eventBuilder: IEventBuilder;
  rawJson: string | undefined;
  parsedJson: any | undefined;
}

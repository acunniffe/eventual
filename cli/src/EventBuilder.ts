import Ajv from 'ajv';
import pascalCase from 'pascal-case';
import * as path from 'path';

export function Event(
  rawSentence: string,
  lockKey: string,
  isDraft: boolean = false,
  filePath: string,
  line: number,
  overrideSchema?: any
): IEventBuilder {
  const tags = extractTags(rawSentence);
  const { variables, templateString } = replaceVariablesWithTemplateSyntax(
    rawSentence
  );

  const eventName = (() => {
    const mock: any = {};
    variables.map((i) => (mock[i] = i));

    const slug = pascalCase(rawSentence);
    return slug;
  })();

  const hasOverrideSchema = typeof overrideSchema === 'object';
  const schema = hasOverrideSchema
    ? overrideSchema
    : buildDefaultSchema(variables);

  const event: IEventBuilder = {
    eventName,
    lockKey,
    isDraft,
    tags,
    line,
    filePath,
    variables,
    rawSentence,
    toSentenceCode: buildSentenceCode(templateString, variables),
    schema,
  };

  return event;
}

// Regexes
const metaParserTemplateString = /([`"'])(?:(?=(\\?))\2.)*?\1/;
const tagRegex = /#(\w+)/g;
const simpleVariableRegex = /\$([\w]+)/g;

function buildSentenceCode(templateString: string, variables: string[]) {
  const arg = `{${variables.join(', ')}}`;
  return `(${arg}) => \`${templateString}\``;
}

export function buildDefaultSchema(variables: string[]) {
  const properties: { [key: string]: any } = {};
  variables.forEach((key) => (properties[key] = { type: 'string' }));
  return {
    type: 'object',
    required: variables,
    additionalProperties: false,
    properties,
  };
}

export function extractTags(rawSentence: string): string[] {
  const groups = [...rawSentence.matchAll(tagRegex)];
  return Array.from(new Set([...groups.map((i) => i[1].toLowerCase())])).sort();
}

export function replaceVariablesWithTemplateSyntax(
  rawSentence: string
): { variables: string[]; templateString: string } {
  useStringPolyfills();

  let result = rawSentence;
  let variables: string[] = [];
  //reverse it so inserts don't break indexes
  const groups = [...rawSentence.matchAll(simpleVariableRegex)].reverse();

  groups.forEach((match) => {
    const start: number = match.index!;
    const end = start + match[0].length;

    variables.push(match[1]);

    //@ts-ignore
    result = result.insert(end, '}');
    //@ts-ignore
    result = result.insert(start + 1, '{');
  });

  return {
    templateString: result,
    variables: Array.from(new Set([...variables])).sort(),
  };
}

export interface IEventBuilder {
  toSentenceCode: string;
  rawSentence: string;
  filePath: string;
  line: number;
  lockKey: string;
  eventName: string;
  variables: string[];
  isDraft: boolean;
  tags: string[];
  schema: any;
}

export interface IMetaSentenceParse {
  variables: string[];
  tags: string[];
  sentenceRaw: string;
}

// /// Generator
// export function generateCodeTo(outputPathProvided: string) {
//   const resolvedOutputPath = path.join(outputPathProvided);
//   const lockPath = path.join(resolvedOutputPath, '.lock.json');
//   console.log('lock at: ' + lockPath);
//   const outputPath = path.join(resolvedOutputPath);
//   const lockFile = getLockFile(lockPath);
//   if (lockFile) {
//     const updatedEventDefinitions = updateEventNamesFromLockFile(
//       __DefinedEvents,
//       lockFile
//     );
//     const newLockFile = checkLockFile(updatedEventDefinitions, lockFile);
//
//     saveLockFile(newLockFile, lockPath);
//   } else {
//     saveLockFile(generateLockFile(__DefinedEvents), lockPath);
//   }
// }

// utils
function useStringPolyfills() {
  //@ts-ignore
  String.prototype.insert = function (
    index: number,
    fullString: string
  ): string {
    if (index > 0) {
      return (
        this.substring(0, index) +
        fullString +
        this.substring(index, this.length)
      );
    }

    return fullString + this;
  };
}

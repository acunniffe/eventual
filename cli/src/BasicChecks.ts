import { ITagParseResult } from './Parser';
import colors from 'colors';
//@ts-ignore
import groupBy from 'lodash.groupby';
export function checkDuplicateLockKeys(tags: ITagParseResult[]): string[] {
  const groups = groupBy(tags, 'lockKey');
  const duplicates = Object.entries(groups)
    .filter((i) => {
      const [key, events] = i;
      //@ts-ignore
      return events.length > 1;
    })
    .map((i) => i[0]);

  return duplicates;
}

export function checkCustomSchemas(tags: ITagParseResult[]): void {
  tags.forEach((i) => {
    if (i.rawJson && !i.parsedJson) {
      throw new Error(
        `Invalid JSON provided as custom schema to ${i.lockKey} at Line(${i.line}) ${i.filePath}`
      );
    }
    if (i.rawJson && i.parsedJson) {
      validateOverrideSchema(
        i.parsedJson,
        i.eventBuilder.variables,
        `${i.lockKey} at Line(${i.line}) ${i.filePath}`
      );
    }
  });
}

export function validateOverrideSchema(
  schema: any,
  variables: string[],
  errorLocation: string
) {
  if (schema.type === 'object') {
    const keys = Object.keys(schema.properties);
    const hasAllKeys = variables.every((i) => keys.includes(i));
    const hasAllRequired = variables.every((i) => schema.required.includes(i));
    if (!hasAllKeys) {
      throw new Error(
        `Schema must have properties for all variables in the sentence ${errorLocation} \n` +
          JSON.stringify(schema)
      );
    }
    if (!hasAllRequired) {
      throw new Error(
        `Schema must have required properties for all variables in the sentence ${errorLocation} \n` +
          JSON.stringify(schema)
      );
    }
  } else {
    throw new Error(
      `Schema must be an object ${errorLocation} \n` + JSON.stringify(schema)
    );
  }
}

export function printDuplicateKeys(
  tags: ITagParseResult[],
  duplicateKeys: string[]
) {
  duplicateKeys.forEach((key) => {
    console.log(
      colors.red(`Error: ${colors.underline(key)} used multiple times`)
    );
    tags
      .filter((i) => i.lockKey === key)
      .forEach((i) => {
        console.log(colors.red(`Line ${i.line} ${i.filePath}`));
      });

    console.log('\n\n');
  });
}

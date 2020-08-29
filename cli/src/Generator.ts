import { IEventBuilder } from './EventBuilder';
import { compile } from 'json-schema-to-typescript';
import prettier from 'prettier';
import * as path from 'path';
export async function Generate(events: IEventBuilder[]) {
  const allEventCodePromises = events.map((i) => {
    return GenerateRuntimeDeclarationForEvent(i);
  });

  const resolved = await Promise.all(allEventCodePromises);
  const unformattedCode = `
${"import EventualEventType from '@eventual/runtime';"}
${resolved.join('')}`;
  return prettier.format(unformattedCode, {
    semi: false,
    parser: 'typescript',
  });
}

export async function GenerateRuntimeDeclarationForEvent(
  event: IEventBuilder
): Promise<string> {
  const tsInterfaceName = `I${event.eventName}`;
  const tsInterface = await compile(event.schema, tsInterfaceName, {
    bannerComment: '',
  });

  process.cwd();
  const leadingComment = `// [${event.tags}] ${
    event.rawSentence
  }\n// source: (Line ${event.line}) ${path.relative(
    process.cwd(),
    event.filePath
  )}`;

  const runtimeClassInstantiation = `export const ${
    event.eventName
  } = new EventualEventType<${tsInterfaceName}>('${event.eventName}', ${
    event.toSentenceCode
  }, ${JSON.stringify(event.schema)}, ${JSON.stringify(event.tags)}, '${
    event.lockKey
  }')`;

  return `\n\n\n${leadingComment}\n${tsInterface}\n\n${runtimeClassInstantiation}\n\n//////////////////////////////////////////////////////////`;
}

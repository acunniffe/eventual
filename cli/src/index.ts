#!/usr/bin/env node
import { extractRawTagsFromMarkdown, ITagParseResult } from './Parser';

const { program } = require('commander');
const pJson = require('../package.json');
import fs from 'fs-extra';
import path from 'path';
//@ts-ignore
import flatten from 'lodash.flatten';
import colors from 'colors';
import {
  checkCustomSchemas,
  checkDuplicateLockKeys,
  printDuplicateKeys,
} from './BasicChecks';
import {
  checkLockFile,
  generateLockFile,
  getLockFile,
  saveLockFile,
  updateEventNamesFromLockFile,
} from './Lockfile';
import { Generate } from './Generator';
import { IEventBuilder } from './EventBuilder';
program.version(pJson.version);

//@ts-ignore
program
  .command('generate [files...]')
  .option(
    '-s, --stage',
    'pass this flag when you only want to verify, but not generate any code'
  )
  .option('-o, --output <file>', 'where the file should be generated')
  .action(async (files: string[], cmdObj: any) => {
    const outputFile = cmdObj.output || path.join(process.cwd(), 'output.ts');
    const outputDirectory = path.dirname(outputFile);
    //@ts-ignore
    return await processFiles(files, true, outputFile, outputDirectory);
  });

program.parse(process.argv);

async function processFiles(
  files: string[],
  generate: boolean,
  outputFile: string,
  outputDirectory: string
) {
  const allFiles: string[] = files.map((i: string) => {
    return path.resolve(path.join(process.cwd(), i));
  });

  const nonExistent: string[] = allFiles.filter(
    (i: string) => !fs.existsSync(i)
  );
  if (nonExistent.length > 0) {
    return console.log(
      colors.red.bold('File(s) not found ' + JSON.stringify(nonExistent))
    );
  }

  const allFilesContents = await Promise.all(
    allFiles.map((path) =>
      fs.readFile(path).then((contents) => [path, contents.toString()])
    )
  );

  const flattened = flatten(
    allFilesContents.map(([filePath, fileContents]) => {
      return extractRawTagsFromMarkdown(filePath, fileContents);
    })
  );

  //basic checks
  const duplicates = checkDuplicateLockKeys(flattened);
  if (duplicates.length > 0) {
    return printDuplicateKeys(flattened, duplicates);
  }

  try {
    checkCustomSchemas(flattened);
  } catch (e) {
    console.log(colors.red(e.message));
    console.log(
      colors.red.bold('\n\nTerminating. Please fix the schemas and try again')
    );
  }

  const flattenedEventBuilders = flattened.map(
    (i: ITagParseResult) => i.eventBuilder
  );

  //use lock file
  const lockPath = path.join(outputDirectory, 'eventual.lock.json');
  console.log(colors.bold('Looking for lock at: ' + lockPath));
  const lockFile = getLockFile(lockPath);
  if (lockFile) {
    console.log(colors.green('Lock file found at ' + lockPath));

    const updatedEventDefinitions = updateEventNamesFromLockFile(
      flattenedEventBuilders,
      lockFile
    );

    try {
      const newLockFile = checkLockFile(updatedEventDefinitions, lockFile);
      saveLockFile(newLockFile, lockPath);

      if (generate) {
        return generateCode(updatedEventDefinitions);
      }
    } catch (e) {
      console.log(colors.red(e.message));
      console.log(
        colors.red.bold('\n\nTerminating. You can not break your domain')
      );
    }
  } else {
    console.log(colors.yellow('No lock file found. Creating one now.'));
    saveLockFile(generateLockFile(flattenedEventBuilders), lockPath);
    if (generate) {
      return generateCode(flattenedEventBuilders);
    }
  }

  async function generateCode(updatedEventBuilders: IEventBuilder[]) {
    const code = await Generate(updatedEventBuilders);

    await fs.writeFile(outputFile, code);

    console.log(
      `\n\n${colors.bold.green('Success!\n')}Types for ${
        updatedEventBuilders.length
      } events generated to ${colors.bold(
        outputFile
      )}\nLock file updated ${colors.bold(lockPath)}`
    );
  }
}

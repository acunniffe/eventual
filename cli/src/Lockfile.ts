import path from 'path';
import { IEventBuilder } from './EventBuilder';
import * as fs from 'fs-extra';
//@ts-ignore
import deepEqual from 'deep-equal';
//@ts-ignore
import stringify from 'json-stable-stringify';

export function getLockFile(lockFilePath: string): ILockfile | undefined {
  if (fs.existsSync(lockFilePath)) {
    const lockFileContents: ILockfile = JSON.parse(
      fs.readFileSync(lockFilePath).toString()
    );
    return lockFileContents;
  }
}

export function saveLockFile(lockFile: ILockfile, lockFilePath: string) {
  fs.ensureFileSync(lockFilePath);
  fs.writeFileSync(lockFilePath, stringify(lockFile, { space: 1 }));
}

export function updateEventNamesFromLockFile(
  events: IEventBuilder[],
  lockFile: ILockfile
): IEventBuilder[] {
  return events.map((event) => {
    if (lockFile[event.lockKey]) {
      return { ...event, eventName: lockFile[event.lockKey].eventName };
    } else {
      return event;
    }
  });
}

export function checkLockFile(
  events: IEventBuilder[],
  currentLockFile: ILockfile
) {
  const newLockFile = generateLockFile(events);
  compareLockFiles(currentLockFile, newLockFile);
  return newLockFile;
}

export function compareLockFiles(base: ILockfile, head: ILockfile) {
  const { added, removed, intersect } = compareLockFileKeys(base, head);
  assertNoNonDraftRemovals(removed, base);
  assertNoSchemaChanges(intersect, base, head);

  return true;
}

function assertNoNonDraftRemovals(
  removed: string[],
  lockFileContents: ILockfile
) {
  const result: ILockfileEntry[] = Object.entries(lockFileContents)
    .filter((i) => removed.includes(i[0]))
    .map((i) => i[1]);

  const removedProds = result.filter((i) => !i.isDraft);
  if (removedProds.length > 0) {
    throw new Error(
      'You can not remove published events...ever! ' + removedProds.join(', ')
    );
  }
}
function assertNoSchemaChanges(
  intersection: string[],
  baseLockfile: ILockfile,
  headLockfile: ILockfile
) {
  intersection.forEach((lockKey) => {
    const baseSchema = baseLockfile[lockKey].schema;
    const headSchema = headLockfile[lockKey].schema;

    if (!deepEqual(baseSchema, headSchema)) {
      throw new Error(`Schema for ${lockKey} has changed! This is not allowed`);
    }
  });
}

export function compareLockFileKeys(
  base: ILockfile,
  head: ILockfile
): { removed: string[]; intersect: string[]; added: string[] } {
  const baseLockKeys = [...Object.keys(base)];
  const headLockKeys = [...Object.keys(head)];

  const removed = baseLockKeys.filter((x: string) => !headLockKeys.includes(x));
  const intersect = baseLockKeys.filter((x: string) =>
    headLockKeys.includes(x)
  );
  const added = headLockKeys.filter((x: string) => !baseLockKeys.includes(x));

  return {
    added,
    removed,
    intersect,
  };
}

export function generateLockFile(events: IEventBuilder[]): ILockfile {
  const contents: ILockfile = {};
  events.forEach(
    (i) =>
      (contents[i.lockKey] = {
        eventName: i.eventName,
        schema: i.schema,
        isDraft: i.isDraft,
      })
  );

  return contents;
}

interface ILockfile {
  [key: string]: ILockfileEntry;
}
interface ILockfileEntry {
  isDraft: boolean;
  eventName: string;
  schema: any;
}

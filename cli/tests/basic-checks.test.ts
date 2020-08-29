import {
  checkCustomSchemas,
  checkDuplicateLockKeys,
  printDuplicateKeys,
} from '../src/BasicChecks';
import { ITagParseResult } from '../src/Parser';

test('finds no duplicate tags when there are none', () => {
  expect(checkDuplicateLockKeys(tags)).toMatchSnapshot();
});

test('finds a duplicate tags when there is one', () => {
  expect(checkDuplicateLockKeys(tags2)).toMatchSnapshot();
});

test('custom schemas work when they are valid json, and have required defaults', () => {
  expect(checkCustomSchemas(tags3)).toBeUndefined();
});

test('custom schemas fail when they are invalid json', () => {
  expect(() => checkCustomSchemas(tags4)).toThrowErrorMatchingSnapshot();
});

test('custom schemas fail when they do not include required fields', () => {
  expect(() => checkCustomSchemas(tags5)).toThrowErrorMatchingSnapshot();
});

const tags: ITagParseResult[] = [
  {
    isDraft: false,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 7,
    lockKey: 'USER-1',
    rawJson: undefined,
    parsedJson: undefined,
    rawSentence: 'A #user with $email and $userId was created.',
    eventBuilder: {
      rawSentence: 'A #user with $email and $userId was created.',
      eventName: 'AUserWithEmailAndUserIdWasCreated',
      lockKey: 'USER-1',
      isDraft: false,
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 7,
      tags: ['user'],
      variables: ['userId', 'email'],
      toSentenceCode:
        '(props: any) => `A #user with ${email} and ${userId} was created.`',
      schema: {
        type: 'object',
        required: ['email', 'userId'],
        additionalProperties: false,
        properties: { email: { type: 'string' }, userId: { type: 'string' } },
      },
    },
  },
  {
    isDraft: false,
    rawJson: undefined,
    parsedJson: undefined,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 8,
    lockKey: 'USER-2',
    rawSentence: '#user $userId verified their email',
    eventBuilder: {
      rawSentence: '#user $userId verified their email',
      eventName: 'UserUserIdVerifiedTheirEmail',
      lockKey: 'USER-2',
      isDraft: false,
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 7,
      tags: ['user'],
      variables: ['userId'],
      toSentenceCode: '(props: any) => `#user ${userId} verified their email`',
      schema: {
        type: 'object',
        required: ['userId'],
        additionalProperties: false,
        properties: { userId: { type: 'string' } },
      },
    },
  },
  {
    isDraft: true,
    rawJson: undefined,
    parsedJson: undefined,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 9,
    lockKey: 'USER-3',
    rawSentence: '#user $userId deleted their account',
    eventBuilder: {
      rawSentence: '#user $userId deleted their account',
      eventName: 'UserUserIdDeletedTheirAccount',
      lockKey: 'USER-3',
      isDraft: true,
      tags: ['user'],
      variables: ['userId'],
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 7,
      toSentenceCode: '(props: any) => `#user ${userId} deleted their account`',
      schema: {
        type: 'object',
        required: ['userId'],
        additionalProperties: false,
        properties: { userId: { type: 'string' } },
      },
    },
  },
];

const tags2: ITagParseResult[] = [
  {
    isDraft: false,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 7,
    lockKey: 'USER-1',
    rawJson: undefined,
    parsedJson: undefined,
    rawSentence: 'A #user with $email and $userId was created.',
    eventBuilder: {
      rawSentence: 'A #user with $email and $userId was created.',
      eventName: 'AUserWithEmailAndUserIdWasCreated',
      lockKey: 'USER-1',
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 7,
      isDraft: false,
      tags: ['user'],
      variables: ['userId', 'email'],
      toSentenceCode:
        '(props: any) => `A #user with ${email} and ${userId} was created.`',
      schema: {
        type: 'object',
        required: ['email', 'userId'],
        additionalProperties: false,
        properties: { email: { type: 'string' }, userId: { type: 'string' } },
      },
    },
  },
  {
    isDraft: false,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 8,
    lockKey: 'USER-1',
    rawJson: undefined,
    parsedJson: undefined,
    rawSentence: '#user $userId verified their email',
    eventBuilder: {
      rawSentence: '#user $userId deleted their account',
      eventName: 'UserUserIdVerifiedTheirEmail',
      lockKey: 'USER-1',
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 8,
      isDraft: false,
      variables: ['userId'],
      tags: ['user'],
      toSentenceCode: '(props: any) => `#user ${userId} verified their email`',
      schema: {
        type: 'object',
        required: ['userId'],
        additionalProperties: false,
        properties: { userId: { type: 'string' } },
      },
    },
  },
  {
    isDraft: true,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 9,
    lockKey: 'USER-3',
    rawJson: undefined,
    parsedJson: undefined,
    rawSentence: '#user $userId deleted their account',
    eventBuilder: {
      rawSentence: '#user $userId deleted their account',
      eventName: 'UserUserIdDeletedTheirAccount',
      lockKey: 'USER-3',
      variables: ['userId'],
      isDraft: true,
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 9,
      tags: ['user'],
      toSentenceCode: '(props: any) => `#user ${userId} deleted their account`',
      schema: {
        type: 'object',
        required: ['userId'],
        additionalProperties: false,
        properties: { userId: { type: 'string' } },
      },
    },
  },
];

const tags3: ITagParseResult[] = [
  {
    isDraft: false,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 7,
    lockKey: 'USER-1',
    rawJson:
      '{\n' +
      "        type: 'object',\n" +
      "        required: ['email', 'userId'],\n" +
      '        additionalProperties: false,\n' +
      "        properties: { email: { type: 'string' }, userId: { type: 'string' } },\n" +
      '      }',
    parsedJson: {
      type: 'object',
      required: ['email', 'userId'],
      additionalProperties: false,
      properties: { email: { type: 'string' }, userId: { type: 'string' } },
    },
    rawSentence: 'A #user with $email and $userId was created.',
    eventBuilder: {
      rawSentence: 'A #user with $email and $userId was created.',
      eventName: 'AUserWithEmailAndUserIdWasCreated',
      lockKey: 'USER-1',
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 7,
      isDraft: false,
      tags: ['user'],
      variables: ['userId', 'email'],
      toSentenceCode:
        '(props: any) => `A #user with ${email} and ${userId} was created.`',
      schema: {
        type: 'object',
        required: ['email', 'userId'],
        additionalProperties: false,
        properties: { email: { type: 'string' }, userId: { type: 'string' } },
      },
    },
  },
];
const tags4: ITagParseResult[] = [
  {
    isDraft: false,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 7,
    lockKey: 'USER-1',
    rawJson: '{{{{{me: "uo}',
    parsedJson: undefined,
    rawSentence: 'A #user with $email and $userId was created.',
    eventBuilder: {
      rawSentence: 'A #user with $email and $userId was created.',
      eventName: 'AUserWithEmailAndUserIdWasCreated',
      lockKey: 'USER-1',
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 7,
      isDraft: false,
      tags: ['user'],
      variables: ['userId', 'email'],
      toSentenceCode:
        '(props: any) => `A #user with ${email} and ${userId} was created.`',
      schema: {
        type: 'object',
        required: ['email', 'userId'],
        additionalProperties: false,
        properties: { email: { type: 'string' }, userId: { type: 'string' } },
      },
    },
  },
];

const tags5: ITagParseResult[] = [
  {
    isDraft: false,
    filePath:
      '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
    line: 7,
    lockKey: 'USER-1',
    rawJson:
      '{\n' +
      "        type: 'object',\n" +
      "        required: ['userId'],\n" +
      '        additionalProperties: false,\n' +
      "        properties: {userId: { type: 'string' } },\n" +
      '      }',
    parsedJson: {
      type: 'object',
      required: ['email'],
      additionalProperties: false,
      properties: { userId: { type: 'string' } },
    },
    rawSentence: 'A #user with $email and $userId was created.',
    eventBuilder: {
      rawSentence: 'A #user with $email and $userId was created.',
      eventName: 'AUserWithEmailAndUserIdWasCreated',
      lockKey: 'USER-1',
      filePath:
        '/Users/aidancunniffe/Developer/eventual/tests/examples/domain.md',
      line: 7,
      isDraft: false,
      tags: ['user'],
      variables: ['userId', 'email'],
      toSentenceCode:
        '(props: any) => `A #user with ${email} and ${userId} was created.`',
      schema: {
        type: 'object',
        required: ['email', 'userId'],
        additionalProperties: false,
        properties: { email: { type: 'string' }, userId: { type: 'string' } },
      },
    },
  },
];

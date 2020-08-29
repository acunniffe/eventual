import { Event } from '../src/EventBuilder';
import { compareLockFileKeys, compareLockFiles } from '../src/Lockfile';

test('key comparison empty when some intersect', () => {
  const result = compareLockFileKeys(
    { a: { eventName: 'A', isDraft: true, schema: {} } },
    { a: { eventName: 'A', isDraft: true, schema: {} } }
  );

  expect(result).toMatchSnapshot();
});

test('key comparison has one added, when one added', () => {
  const result = compareLockFileKeys(
    { a: { eventName: 'A', isDraft: true, schema: {} } },
    {
      a: { eventName: 'A', isDraft: true, schema: {} },
      b: { eventName: 'B', isDraft: true, schema: {} },
    }
  );

  expect(result).toMatchSnapshot();
});

test('key comparison when one removed', () => {
  const result = compareLockFileKeys(
    { a: { eventName: 'A', isDraft: true, schema: {} } },
    {}
  );

  expect(result).toMatchSnapshot();
});

test('error when a schema is changed', () => {
  expect(() =>
    compareLockFiles(
      {
        'ORG-1': {
          eventName:
            'an-api-named-name-was-created-by-user-with-id-userid-org-1',
          isDraft: false,
          schema: {
            properties: {
              name: { type: 'string' },
              userId: { type: 'string' },
            },
            required: ['name', 'userId'],
            type: 'object',
          },
        },
      },
      {
        'ORG-1': {
          eventName:
            'an-api-named-name-was-created-by-user-with-id-userid-org-1',
          isDraft: false,
          schema: {
            properties: { name: { type: 'string' } },
            required: ['name'],
            type: 'object',
          },
        },
      }
    )
  ).toThrowErrorMatchingSnapshot();
});

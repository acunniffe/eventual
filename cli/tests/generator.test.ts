import { Event } from '../src/EventBuilder';
import { Generate, GenerateRuntimeDeclarationForEvent } from '../src/Generator';

const event1 = Event(
  'An #api with $id was created by #user $userId',
  'ORG-1',
  false,
  'example-file',
  15,
  undefined
);
const event2 = Event(
  'The #api $id was deprecated',
  'ORG-2',
  false,
  'example-file',
  15,
  undefined
);

test('can generate declaration code from Event', () => {
  expect(GenerateRuntimeDeclarationForEvent(event1)).toMatchSnapshot();
});
test('can generate a declaration file from Events', async () => {
  expect(await Generate([event1, event2])).toMatchSnapshot();
});

test('can generate a declaration file from Events. user events', async () => {
  const e1 = Event(
    'An #api with $id was created by #user $userId',
    'USR-1',
    false,
    'example-file',
    15,
    undefined
  );
  const e2 = Event(
    'The #api $id was deprecated',
    'USR-2',
    false,
    'example-file',
    15,
    undefined
  );

  expect(await Generate([event1, event2])).toMatchSnapshot();
});

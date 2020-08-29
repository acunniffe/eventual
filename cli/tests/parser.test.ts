import { extractRawTagsFromMarkdown } from '../src/Parser';
import { replaceVariablesWithTemplateSyntax } from '../src/EventBuilder';

const markdownExample = `
# Domain Events
These are the events in our domain

## User Management Events
Users in our domain can be created and deleted.

[USER-1] A #user with $email and $userId was created.
[USER-2] #user $userId verified their email
DRAFT [USER-3] #user $userId deleted their account

`;

const markdownExampleWithACustomSchemaThrownIn = `
# Domain Events
These are the events in our domain

## User Management Events
Users in our domain can be created and deleted.

[USER-1] A #user with $email and $userId was created.
[USER-2] #user $userId verified their email
\`\`\`json
{
  "type": "object",
  "properties": {
    "userId": {
      "type": "string"
    },
    "date": {
      "type": "string"
    }
  }
}
\`\`\`
DRAFT [USER-3] #user $userId deleted their account

`;

test('can extract eventual tags from markdown', () => {
  expect(
    extractRawTagsFromMarkdown('example-file.js', markdownExample)
  ).toMatchSnapshot();
});

test('can build executable toSentence from raw', () => {
  expect(
    replaceVariablesWithTemplateSyntax(
      'A #user with $email and $userId was created.'
    )
  ).toMatchSnapshot();
});

test('can extract eventual tags with custom schemas from markdown', () => {
  console.log(
    extractRawTagsFromMarkdown(
      'example-file.js',
      markdownExampleWithACustomSchemaThrownIn
    )
  );
});

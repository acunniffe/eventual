# eventual
Event modeling by sentence.

**You Write Events in Markdown:**
```markdown
# Domain Events
These are the events in our domain

## User Management Events
Our domain has users!

[USERS-1] A #user with $email and $userId was created.
[USERS-2] #user $userId verified their email
DRAFT [USERS-3] #user $userId deleted their account
```
**eventual provides:**
- A Typescript Interface
- Sane, consistent, immutable names for the events.
- A lockfile to make sure the schemas and event names of published events never change, even if you update the sentence or reorganize your events.
- A JSON Schema
- Tags (powered by `#` to group and organize your events)
- A `toSentence` method for debugging events.
```javascript
const apiCreatedEvent = AnAPINamedNameWasCreatedByUserWithId.new({name: 'First API', userId: 'user1'}) // valid!
apiCreatedEvent.toSentence() // An #API named First API was created by #User with ID user1}
```

### Principles
1. Events are best described as sentences that explain what took place. Designing domains and communicating the meaning of events to others is easiest when you can work in sentences.
2. Most of the time your the properties of your event are a small number of string keys. For most domains converting your sentence into a schema is straightforward. When you need something more complicated, override the schema manually -- eventual makes sure you still include the keys from your sentence.
3. Sentences are by definition less explicit than code, so to make up for it, a lockfile is used to break your build if a published event is removed or if its schema is changed.

### Document your Domain
Eventual allows you to document the events in your domain using markdown files. Usually one file per bounded context is a good way to break things up. For each bounded context, pick a 2+ letter shortcode ie `USERS`, `ORDER`, `LISTING`.

You can document an event using the Eventual Tag Syntax:
- A lock-key ie `[USERS-1]`. This is the primary key for each event and used to track the schema, name and stability of this event in the lockfile.
- Followed by, a sentence describing the event
- Properties of the event can be set using `$variableName` syntax. By default these will be `required` and of type `string`
- You can also tag the event using `#tag` syntax. This is useful for grouping events and understanding which (if any) cross boundaries.
```markdown
DRAFT [USERS-1] A #user with $email and $userId was created.
```
- Once you are ready to publish the event, remove `DRAFT` and the lockfile will start enforcing consistency between versions.
```markdown
[USERS-1] A #user with $email and $userId was created.
```

**Example**
```markdown
# Domain Events
These are the events in our domain

## User Management Events
Our domain has users!

[USERS-1] A #user with $email and $userId was created.
[USERS-2] #user $userId verified their email
DRAFT [USERS-3] #user $userId deleted their account
```

## Installing & Generating Types
Install eventual CLI as a `devDependency`:
```bash
npm install @eventual/cli --save-dev
// or
yarn add @eventual/cli --save-dev
```

Install the eventual runtime as a `dependency` in any project you want to use the generated types in:

```bash
npm install @eventual/runtime --save
// or
yarn add @eventual/runtime --save
```

**Run generate command:**
```bash
npx eventual generate file1.md file2.md --output domain-events.ts
```
- All files you pass as arguments will be combined into the same output / lock file.
- Make sure you check the lock file into version control `eventual.lock.json`

## Use the Generated Domain Types
The generated event types make it easy to:
- Create new instances of each event
- Check if an event's types are valid
- Log the event as a sentence
- Serialize JSON from each event

```typescript
import {AUserWithEmailAndUserIdWasCreated} from './generated/domain-events'

AUserWithEmailAndUserIdWasCreated.new({wrongProps: true}) // throws!

const eventInstance = AUserWithEmailAndUserIdWasCreated.new({email: 'you@example.com', id: '123'}) //valid
eventInstance.toSentence() //A #user with $email you@example.com and $userId 123 was created.
eventInstance.toJSON()
/*
{
  "type": "AUserWithEmailAndUserIdWasCreated",
  "data": {
    "email: "you@example.com",
    "id": "123"
  }
}
*/

```

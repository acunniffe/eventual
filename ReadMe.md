# eventual [wip]
Event modeling by sentence.

**You Write:**
```javascript
Event((props) => `An #API named ${props.name} was created by #User with ID ${props.userId}`,'ORG-1');
```
**eventual provides:**
- A Typescript Interface
- A JSON Schema
- Tags (powered by `#` to group and organize your events)
- A `toSentence` method for debugging events.
- A lockfile to make sure the schemas and event names of published events never change, even if you update the sentence or reorganize your events.

```javascript
const apiCreatedEvent = AnAPINamedNameWasCreatedByUserWithId.new({name: 'First API', userId: 'user1'}) // valid!
apiCreatedEvent.toSentence() // An #API named First API was created by #User with ID user1}
```

### Drafting Events
1. For each bounded context, pick a 2-3 letter prefix for each event's key. The event keys get used in the lockfile. ie for user events, I might choose `USR-X` and increment my events by a set int `USR-1` `USR-2`.

Write your first sentences!
- Properties get set using template strings. Each variable you specify will (by default) be added to your Typescript interface and JSON Schema as a required string.
- `#` hashtag should be used to refer to the resources in your domain. These tags are case-insensitive and can be used later to group your events.
```typescript
Event((props) => `A #user with ${props.email} and ${props.id} signed-up`,'USR-1');
Event((props) => `The #user with ${props.id} verified their email`,'USR-2');


/// Generated Interfaces and Runtime Events
export interface IAUserWithEmailAndIdSignedUpUsr_1 {
  email: string;
  id: string;
}
export const AUserWithEmailAndIdSignedUpUsr_1 = new EventualEventType<IAUserWithEmailAndIdSignedUpUsr_1>(...)

export interface ITheUserWithIdVerifiedTheirEmailUsr_2 {
  id: string;
}
export const TheUserWithIdVerifiedTheirEmailUsr_2 = new EventualEventType<ITheUserWithIdVerifiedTheirEmailUsr_2>(...)
```


### Principles
1. Events are best described as sentences that explain what took place. Designing domains and communicating the meaning of events to others is easiest when you can work in sentences.
2. Most of the time your the properties of your event are a small number of string keys. For most domains converting your sentence into a schema is straightforward. When you need something more complicated, override the schema manually -- eventual makes sure you still include the keys from your sentence.
3. Sentences are by definition less explicit than code, so to make up for it and keep your events from arbitrarily changing when you update your grammar, a lockfile is used to break your build if a published event is removed or if its schema is changed.


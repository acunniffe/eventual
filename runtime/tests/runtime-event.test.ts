/// Example generated code

import EventualEventType from '../src/index';

export interface IAUserWithEmailAndIdSignedUp {
  email: string;
  id: string;
}
export const AUserWithEmailAndIdSignedUp = new EventualEventType<
  IAUserWithEmailAndIdSignedUp
>(
  'AUserWithEmailAndIdSignedUp',
  (props) => `A #user with ${props.email} and ${props.id} signed-up`,
  {
    type: 'object',
    required: ['email', 'id'],
    additionalProperties: false,
    properties: { email: { type: 'string' }, id: { type: 'string' } },
  },
  ['user'],
  'USR-1'
);

test('runtime events can be created with valid props', () => {
  const newInstance = AUserWithEmailAndIdSignedUp.new({
    email: 'a@gmail.com',
    id: 'abcdefg',
  });
  expect(newInstance.toSentence()).toMatchSnapshot();
  expect(newInstance.toJson()).toMatchSnapshot();
});

test('runtime events will throw is created with wrong data', () => {
  expect(() =>
    AUserWithEmailAndIdSignedUp.new({ world: 'hello' })
  ).toThrowErrorMatchingSnapshot();
});

test('can validate invalid data w/o throwing', () => {
  expect(AUserWithEmailAndIdSignedUp.validate({ world: 'hello' })).toBe(false);
});

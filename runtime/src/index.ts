import Ajv from 'ajv';
const ajv = new Ajv();
import colors from 'colors';

export default class EventualEventType<T> implements IEventualEventType {
  public readonly eventName: string;
  public readonly lockKey: string;
  public readonly tags: string[];

  private readonly schema: any;
  private readonly _toSentence: (props: any) => string;

  constructor(
    eventName: string,
    toSentence: (props: any) => string,
    schema: any,
    tags: string[],
    lockKey: string
  ) {
    this.eventName = eventName;
    this.tags = tags;
    this.lockKey = lockKey;
    this._toSentence = toSentence;
    this.schema = schema;
  }

  validate(props: any): boolean {
    const validate = ajv.compile(this.schema);
    return Boolean(validate(props));
  }

  new(props: any): IEventualEvent<T> {
    if (this.validate(props)) {
      return {
        type: this.eventName,
        data: props,
        toSentence: () =>
          this._toSentence(new Proxy(props, variableNameEchoProxy(props))),
        toJson: () => {
          return {
            type: this.eventName,
            data: props,
          };
        },
      };
    } else {
      throw new Error(`Invalid props for Event Type ${this.eventName}`);
    }
  }
}

const variableNameEchoProxy = (target: any) => ({
  get: function (target: any, prop: string) {
    return `\$${prop} ${colors.bold.underline(target[prop])}`;
  },
});

export interface IEventualEventType {
  eventName: string;
  tags: string[];
  lockKey: string;
}

export interface IEventualEvent<T> {
  type: string;
  data: T;
  toSentence: () => string;
  toJson(): any;
}

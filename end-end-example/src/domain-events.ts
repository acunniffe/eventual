import EventualEventType from "@eventual/runtime"

// [user] A #user with $email and $userId was created.
// source: (Line 7) src/domain.md
export interface IAUserWithEmailAndUserIdWasCreated {
  email: string
  userId: string
}

export const AUserWithEmailAndUserIdWasCreated = new EventualEventType<
  IAUserWithEmailAndUserIdWasCreated
>(
  "AUserWithEmailAndUserIdWasCreated",
  ({ email, userId }) => `A #user with ${email} and ${userId} was created.`,
  {
    type: "object",
    required: ["email", "userId"],
    additionalProperties: false,
    properties: { email: { type: "string" }, userId: { type: "string" } },
  },
  ["user"],
  "USERS-1"
)

//////////////////////////////////////////////////////////

// [user] #user $userId verified their email
// source: (Line 8) src/domain.md
export interface IUserUserIdVerifiedTheirEmail {
  userId: string
}

export const UserUserIdVerifiedTheirEmail = new EventualEventType<
  IUserUserIdVerifiedTheirEmail
>(
  "UserUserIdVerifiedTheirEmail",
  ({ userId }) => `#user ${userId} verified their email`,
  {
    type: "object",
    required: ["userId"],
    additionalProperties: false,
    properties: { userId: { type: "string" } },
  },
  ["user"],
  "USERS-2"
)

//////////////////////////////////////////////////////////

// [user] #user $userId deleted their account
// source: (Line 9) src/domain.md
export interface IUserUserIdDeletedTheirAccount {
  userId: string
}

export const UserUserIdDeletedTheirAccount = new EventualEventType<
  IUserUserIdDeletedTheirAccount
>(
  "UserUserIdDeletedTheirAccount",
  ({ userId }) => `#user ${userId} deleted their account`,
  {
    type: "object",
    required: ["userId"],
    additionalProperties: false,
    properties: { userId: { type: "string" } },
  },
  ["user"],
  "USERS-3"
)

//////////////////////////////////////////////////////////

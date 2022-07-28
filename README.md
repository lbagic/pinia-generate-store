# Pinia Generate store

Generate pinia stores with actions based on state.

## Installation

```bash
npm i @lbagic/pinia-generate-store
```

## Example

```js
import { generateStore } from "@lbagic/pinia-generator";

export const useUserStore = generateStore({
  id: "user",
  state: () => ({
    count: 0,
    users: [
      { id: 1, type: "odd" },
      { id: 2, type: "even" },
      { id: 3, type: "odd" },
      { id: 4, type: "even" },
    ],
  }),
});

const userStore = useUserStore();

// every state gets a reset method
userStore.;

// list properties get additional methods
userStore.usersAdd({ id: 5, type: "new" });
userStore.usersFind({ id: 2 });
userStore.usersFindMany({ type: "odd" });
userStore.usersRemove({ type: "even" });
userStore.usersReset();
```

## Method signatures

| Name         | Paramters                     | Return value      |
| ------------ | ----------------------------- | ----------------- |
| itemAdd      | `item \| item[]`, `uniqueKey` | void              |
| itemFind     | `Partial<item>`               | item \| undefined |
| itemFindMany | `Partial<item>`               | item[]            |
| itemRemove   | `Partial<item>`               | void              |
| itemReset    | -                             | void              |

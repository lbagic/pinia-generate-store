import { defineStore } from "pinia";
import { generateStore } from "../src";

export const useUserStore = generateStore({
  id: "user",
  state: () => ({
    counter: 0,
    users: [{id: 1, type: 'asdf'}],
    numbers: [1, 2, 3]
  }),
  actions: {
    a() {
      // this.
    }
  }
});

const userStore = useUserStore();
userStore.users;
userStore.usersAdd({ id: 5, type: 'asd' });
userStore.usersFind({ id: 5 });
userStore.usersFindMany({ type: "odd" });
userStore.usersRemove({ type: "even" });
userStore.usersReset();

export const useDefaultStore = defineStore({
  id: "user",
  state: () => ({
    counter: 0,
    users: [{id: 1, type: 'asdf'}],
    numbers: [1, 2, 3]
  }),
  actions: {
    a() {
      // this.
    }
  }
});

const defaultStore = useDefaultStore();
userStore.users;
userStore.usersAdd({ id: 5, type: 'asd' });
userStore.usersFind({ id: 5 });
userStore.usersFindMany({ type: "odd" });
userStore.usersRemove({ type: "even" });
userStore.usersReset();


// type ActionType<Id, S, G, A> = A & ThisType<A & UnwrapRef<S> & _StoreWithState<Id, S, G, A> & _StoreWithGetters<G> & PiniaCustomProperties & GenerateActions<A, S>>
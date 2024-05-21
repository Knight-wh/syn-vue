<script setup lang="ts">
import { RemoteUser, LocalUser } from "../type";
const props = defineProps<{
  remoteUsers: RemoteUser[];
  localUser: LocalUser | null;
}>();
const emit = defineEmits<{
  login: [username: string];
}>();
const onSubmit = (event: Event) => {
  event.preventDefault();
  const data = new FormData(event.target as HTMLFormElement);
  const username = data.get("username") as string;
  emit("login", username);
};
</script>

<template>
  <aside class="flex flex-col gap-4 py-4 px-3 w-2/12 bg-rp-surface">
    <h1 class="text-3xl font-bold">Who's online?</h1>
    <div v-show="props.localUser === null">
      <form @submit="onSubmit">
        <label for="login-username" class="block mb-2 font-semibold"
          >Username</label
        >
        <input
          type="text"
          class="block mb-2 py-2 px-3 bg-rp-overlay rounded"
          id="login-username"
          name="username"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
    <ul>
      <li v-show="props.localUser !== null">
        {{ props.localUser?.name }} <span class="italic">(you)</span>
      </li>
      <li v-for="user in props.remoteUsers">{{ user.name }}</li>
    </ul>
  </aside>
</template>

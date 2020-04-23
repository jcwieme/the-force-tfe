import Vue from "vue";
import VueRouter from "vue-router";
import Loader from "@/views/Loader.vue";
import Choice from "@/views/Choice.vue";
import Words from "@/views/Words.vue";
import Dialogues from "@/views/Dialogues.vue";
import Numbers from "@/views/Numbers.vue";
import History from "@/views/History.vue";
import Credits from "@/views/Credits.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Loader",
    component: Loader
  },
  {
    path: "/choice",
    name: "Choice",
    component: Choice
  },
  {
    path: "/movie/:id/history",
    name: "History",
    component: History
  },
  {
    path: "/movie/:id/dialogues",
    name: "Dialogues",
    component: Dialogues
  },
  {
    path: "/movie/:id/words",
    name: "Words",
    component: Words
  },
  {
    path: "/movie/:id/numbers",
    name: "Numbers",
    component: Numbers
  },
  {
    path: "/movie/:id/credits",
    name: "Credits",
    component: Credits
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

// src/router.js

import { createRouter, createWebHistory } from "vue-router";
import ResultTable from "./components/ResultTable.vue";
import DetailPage from "./components/DetailPage.vue";
import Whitelist from "./components/Whitelist.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: ResultTable,
  },
  {
    path: "/details/:id",
    name: "Details",
    component: DetailPage,
    props: true,
  },
  {
    path: "/whitelist",
    name: "Whitelist",
    component: Whitelist,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
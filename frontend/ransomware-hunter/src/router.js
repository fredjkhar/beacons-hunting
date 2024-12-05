// src/router.js

import { createRouter, createWebHistory } from "vue-router";
import ResultTable from "./components/ResultTable.vue";
import DetailPage from "./components/DetailPage.vue";
import Whitelist from "./components/Whitelist.vue";
import GenerateReport from "./components/GenerateReport.vue";
import HomePage from "./components/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
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
  {
    path: "/generate",
    name: "GenerateReport",
    component: GenerateReport,
  },
  {
    path: "/report",
    name: "ViewReport",
    component: ResultTable,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
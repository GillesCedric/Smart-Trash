/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Trash from "views/Trash.js";
import Users from "views/Users.js";
import Bouncers from "views/Bouncers.js";
import UserProfile from "views/UserProfile.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/trash",
    name: "Les Poubelles",
    icon: "fa fa-trash",
    component: Trash,
    layout: "/admin"
  },
  {
    path: "/users",
    name: "Les Utilisateurs",
    icon: "fa fa-users",
    component: Users,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "Mon Profil",
    icon: "fa fa-user",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/bouncers",
    name: "Les Videurs",
    icon: "fa fa-truck",
    component: Bouncers,
    layout: "/admin"
  }
];
export default routes;

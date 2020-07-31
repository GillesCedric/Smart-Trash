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
import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { withCookies } from 'react-cookie';

import AdminLayout from "layouts/Admin/Admin.js";
import Login from "views/Login"
import Logout from "views/Logout";
import NewUser from 'views/NewUser';
import NewBouncer from 'views/NewBouncer';

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";

import "assets/css/style.css";


class App extends React.Component {
	render() {
		const hist = createBrowserHistory();
		return (
			<Router history={hist}>
				<Switch>
					<Route path="/admin" render={props => <AdminLayout {...props} />} />
					<Route path="/add-bouncer" render={props => <NewBouncer {...props} />} />
					<Route path="/add-user" render={props => <NewUser {...props} />} />
					<Route path="/login" render={props => <Login {...props} />} />
					<Route path="/logout" render={props => <Logout {...props} />} />
					<Redirect from="/" to="/admin/dashboard" />
				</Switch>
			</Router>
		)

	}
}

export default withCookies(App)

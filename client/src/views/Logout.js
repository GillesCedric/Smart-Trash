import React from "react";
import { Cookies } from "react-cookie";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
	render() {
		let cookie = new Cookies()
		cookie.remove('token')
		cookie.remove('numCni')
		cookie.remove('isAdmin')
		return (
			<Redirect to='/login' />
		)
	}
}
export default Logout

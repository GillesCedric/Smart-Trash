import React from 'react';
import wave from "assets/img/wave.png";
import bg from "assets/img/bg.svg";
import Axios from "axios";
import logo from 'assets/img/react-logo.png';
import { Redirect } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import NotificationAlert from "react-notification-alert";




class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login: '',
			password: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	redirect = () => { return <Redirect to='/admin' ref="notificationAlert" /> }


	notify = (place, color = 5, error = 'Impossible de récupérer les informations') => {
		//var color = Math.floor(Math.random() * 5 + 1);
		var type;
		switch (color) {
			case 1:
				type = "primary";
				break;
			case 2:
				type = "success";
				break;
			case 3:
				type = "danger";
				break;
			case 4:
				type = "warning";
				break;
			case 5:
				type = "info";
				break;
			default:
				break;
		}
		var options = {
			place: place,
			message: (
				<div>
					<div>
						{error}
					</div>
				</div>
			),
			type: type,
			icon: "tim-icons icon-bell-55",
			autoDismiss: 7
		};
		this.refs.notificationAlert.notificationAlert(options);
	};

	async componentDidMount() {

		const inputs = document.querySelectorAll(".input");


		function addcl() {
			let parent = this.parentNode.parentNode;
			parent.classList.add("focus");
		}

		function remcl() {
			let parent = this.parentNode.parentNode;
			if (this.value == "") {
				parent.classList.remove("focus");
			}
		}


		inputs.forEach(input => {
			input.addEventListener("focus", addcl);
			input.addEventListener("blur", remcl);
		});
	}

	handleChange(key) {
		return function (e) {
			var state = {};
			state[key] = e.target.value;
			this.setState(state);
		}.bind(this);
	}

	handleSubmit(event) {
		let cookie = new Cookies()

		var data = {
			login: this.state.login,
			password: this.state.password,
		}

		Axios.post('http://localhost:8080/api/utilisateurs/login/', data
		)
			.then(result => {
				cookie.set('token', result.data.token, { maxAge: 60 * 60 * 2 })
				cookie.set('numCni', result.data.utilisateurNumCni, { maxAge: 60 * 60 * 2 })
				cookie.set('isAdmin', result.data.isAdmin, { maxAge: 60 * 60 * 2 })
				this.props.history.push('/dashboard/admin')
			})
			.catch(err => {
				this.setState({ password: '' })
				this.notify('tr', 3, "Impossible de se connecter")
			})

		event.preventDefault();
	}

	render() {
		return (
			<>
				<img className="wave" src={wave}></img>
				<div className="container">
					<div className="react-notification-alert-container">
						<NotificationAlert ref="notificationAlert" />
					</div>
					<div className="img">
						<img className="wave" src={bg}></img>
					</div>
					<div className="login-content">
						<form onSubmit={this.handleSubmit} className='form' >
							<img src={logo} style={{ borderRadius: '50%', width: '150px', height: '150px' }} alt="..." />
							<h2 className="title" style={{ color: 'white' }}>Bienvenue</h2>
							<div className="input-div one">
								<div className="i">
									<i className="fas fa-user"></i>
								</div>
								<div className="div">
									<h5 style={{ color: 'white' }}>Nom d'utilisateur</h5>
									<input type="text" className="input" name="login" value={this.state.login} onChange={this.handleChange('login')} style={{ color: 'rgb(134, 134, 134)' }} />
								</div>
							</div>
							<div className="input-div pass">
								<div className="i">
									<i className="fas fa-lock"></i>
								</div>
								<div className="div">
									<h5 style={{ color: 'white' }}>Mot de passe</h5>
									<input type="password" className="input" name="password" value={this.state.password} onChange={this.handleChange('password')} style={{ color: 'rgb(134, 134, 134)' }} />
								</div>
							</div>
							<input type="submit" className="button" value="Se connecter" name="submit" />
							<a className='a' href="inscription.php" style={{ fontSize: '17px', marginTop: '10px' }}>Mot de passe oublié?</a>
						</form>
					</div>

				</div>
			</>
		);
	}
}

export default Login;

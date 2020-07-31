import React from 'react';
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	Form,
	Input,
	Row,
	Col,
	Label
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import { Cookies } from 'react-cookie';
import Axios from "axios";

class NewUser extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			notify: 0,
			token: 'Bearer ' + new Cookies().get('token'),
			userReady: false,
			numCni: '',
			nom: '',
			prenom: '',
			tel: '',
			login: '',
			mail: '',
			password: '',
			confirmPassword: '',
			isAdmin: 0
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}


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


	handleChange(key) {
		return function (e) {
			var state = {};
			state[key] = e.target.value;
			this.setState(state);
		}.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();

		const headers = {
			Authorization: this.state.token
		}

		var data = {
			numCni: this.state.numCni,
			nom: this.state.nom,
			prenom: this.state.prenom,
			login: this.state.login,
			tel: this.state.tel,
			mail: this.state.mail,
			isAdmin: this.state.isAdmin,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
		}

		if (data.numCni == "" || data.nom == "" || data.prenom == "" || data.tel == "" || data.login == "" || data.mail == "" || data.password == "" || data.confirmPassword == "") {
			this.notify("tr", 3, "Veuillez remplir tous les champs")
			return null
		}

		if (data.login.length > 10 || data.login.length < 4) {
			this.notify("tr", 3, "Le login doit avoir entre 4 et 10 caractères")
			return null
		}

		if (data.password != data.confirmPassword) {
			this.notify("tr", 3, "Le mot de passe et la confirmation ne correspondent pas")
			return null
		}

		Axios.post('http://localhost:8080/api/utilisateurs/register/', data, { headers: headers }
		)
			.then(result => {
				this.notify("tr", null, "Inscription de l'utilisateur réussie")
			})
			.catch(err => {
				this.setState({ password: '', confirmPassword: '' })
				this.notify('tr', 3, "Impossible d'inscrire l'utilisateur")
			})


	}

	render() {
		return (
			<>
				<Col md="8" style={{ margin: "0 auto", marginTop: 50 }} >
					<div className="react-notification-alert-container">
						<NotificationAlert ref="notificationAlert" />
					</div>
					<Card>
						<h5 style={{ margin: "0 auto", marginTop: 30, marginBottom: 10 }} className="title">AJOUTER UN NOUVEL UTILISATEUR</h5>
						<CardHeader>
							<Button title="Retournez sur le dashboard" onClick={() => this.props.history.goBack()} style={{ margin: "0 auto" }} className="btn-fill" color="info" type="button">
								<i className="fa fa-arrow-left" />
							</Button>
						</CardHeader>
						<CardBody>
							<Form onSubmit={(e) => this.handleSubmit(e)}>
								<Row>
									<Label style={{ marginLeft: 20 }}>Numéro de CNI</Label>
									<Input
										placeholder="Numéro de CNI"
										type="text"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('numCni')}
										value={this.state.numCni}
									/>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Nom</Label>
									<Input
										placeholder="Nom"
										type="text"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('nom')}
										value={this.state.nom}
									/>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Prénom</Label>
									<Input
										placeholder="Prénom"
										type="text"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('prenom')}
										value={this.state.prenom}
									/>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Tél</Label>
									<Input
										placeholder="Tél"
										type="text"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('tel')}
										value={this.state.tel}
									/>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Login</Label>
									<Input
										placeholder="Login"
										type="text"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('login')}
										value={this.state.login}
									/>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Adresse Mail</Label>
									<Input
										placeholder="Adresse Mail"
										type="email"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('mail')}
										value={this.state.mail}
									/>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Rôle</Label>
									<select value={this.state.isAdmin} className="form-control" style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }} onChange={this.handleChange('isAdmin')}>
										<option value={1}>Administrateur</option>
										<option value={0}>Utilisateur</option>
									</select>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Mot de passe</Label>
									<Input
										placeholder="Mot de passe"
										type="password"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('password')}
										value={this.state.password}
									/>
								</Row>
								<Row>
									<Label style={{ marginLeft: 20 }}>Confirmez le mot de passe</Label>
									<Input
										placeholder="Confirmation du mot de passe"
										type="password"
										style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}
										onChange={this.handleChange('confirmPassword')}
										value={this.state.login}
										value={this.state.confirmPassword}
									/>
								</Row>
								<Button className="btn-fill" color="primary" type="submit" style={{ width: "100%", marginTop: 10, marginRight: 20, marginBottom: 20 }}>
									Enregistrer
               </Button>
							</Form>
							{/* <form onSubmit={this.handleSubmit} className='form' >
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
							</form> */}
						</CardBody>

					</Card>
				</Col>
			</>
		)
	}

}

export default NewUser

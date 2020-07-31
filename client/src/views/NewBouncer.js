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

class NewBouncer extends React.Component {
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
			tel: this.state.tel,
		}

		if (data.numCni == "" || data.nom == "" || data.prenom == "" || data.tel == "") {
			this.notify("tr", 3, "Veuillez remplir tous les champs")
			return null
		}

		if (data.tel.length != 9) {
			this.notify("tr", 3, "Le numéro de téléphone doit avoir 9 chiffres")
			return null
		}


		Axios.post('http://localhost:8080/api/utilisateurs/videurs/add', data, { headers: headers }
		)
			.then(result => {
				this.notify("tr", null, "Inscription de du videur réussie")
			})
			.catch(err => {
				this.setState({ password: '', confirmPassword: '' })
				this.notify('tr', 3, "Impossible d'inscrire le videur")
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
						<h5 style={{ margin: "0 auto", marginTop: 30, marginBottom: 10 }} className="title">AJOUTER UN NOUVEAU VIDEUR</h5>
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
								<Button className="btn-fill" color="primary" type="submit" style={{ width: "100%", marginTop: 10, marginRight: 20, marginBottom: 20 }}>
									Enregistrer
               </Button>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</>
		)
	}

}

export default NewBouncer

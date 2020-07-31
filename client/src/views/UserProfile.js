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

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

import NotificationAlert from "react-notification-alert";
import loader from "assets/img/loader.svg";
import { Cookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';

import Axios from "axios";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notify: 0,
      token: 'Bearer ' + new Cookies().get('token'),
      userReady: false,
      user: {},
    };
  }

  notify = (place, color = 5, error = 'Impossible de récupérer les informations') => {
    //var color = Math.floor(Math.random() * 5 + 1);
    if (this.state.token.length < 20) {
      return null
    }
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
    await this.updateComponent()
  }
  async updateData() {
    const headers = {
      Authorization: this.state.token
    }

    await Axios.get('http://localhost:8080/api/utilisateurs/perso/', { headers: headers }
    )
      .then(result => {
        console.log(result)
        this.setState({ user: result.data, userReady: true })
      })
      .catch(err => {
        console.log(err)
        this.notify("tr", 3)
      });
  }
  async updateComponent() {
    await this.updateData()
    setInterval(() => {
      this.updateData()
    }, 60000)

  }

  render() {

    if (this.state.token.length < 20) {
      return <Redirect to='/login' ref="notificationAlert" />
    }

    return (
      <>
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="8">
              <Card>
                <CardHeader>
                  <h5 className="title">Modifiez votre profil</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <label>CNI (désactivé)</label>
                          <Input
                            defaultValue={this.state.user.numCni}
                            disabled
                            placeholder="Numéro de CNI"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="" md="6">
                        <FormGroup>
                          <label>Nom</label>
                          <Input
                            defaultValue={this.state.user.nom}
                            placeholder="Nom"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Prénom
                          </label>
                          <Input defaultValue={this.state.user.prenom} placeholder="Prénom" type="text" />
                        </FormGroup>
                      </Col>
                      <Col className="" md="6">
                        <FormGroup>
                          <label>Tél</label>
                          <Input
                            defaultValue={this.state.user.tel}
                            placeholder="Numéro de téléphone"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <label>Login</label>
                          <Input
                            defaultValue={this.state.user.login}
                            placeholder="Login"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="" md="6">
                        <FormGroup>
                          <label>Adresse Mail</label>
                          <Input
                            defaultValue={this.state.user.mail}
                            placeholder="Adresse Mail"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Mot de passe</label>
                          <Input
                            placeholder="Mot de passe"
                            type="password"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* {<Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Privilège</label>
                          <select name="privilege" className="form-control">
                            <option value={1}>Administrateur</option>
                            <option value={0}>Utilisateur</option>
                          </select>
                        </FormGroup>
                      </Col>
                    </Row>} */}
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit">
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </Col>
            <Col md="4">
              <Card className="card-user">
                <CardBody>
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    {!this.state.userReady ?
                      <div><img src={loader} width={60} className='mt-5'></img></div>
                      :
                      <a href="#pablo" onClick={e => e.preventDefault()}>
                        <img
                          alt="..."
                          className="avatar"
                          src={require("assets/img/développeur.png")}
                        />
                        <h5 className="title">{this.state.user.nom + " " + this.state.user.prenom}</h5>
                      </a>
                    }
                    {this.state.userReady ?
                      <p className="description">{this.state.user.isAdmin ? "Administrateur" : "Utilisateur"}</p>
                      :
                      null
                    }

                  </div>
                  <div className="card-description">
                    Do not be scared of the truth because we need to restart the
                    human foundation in truth And I love you like Kanye loves
                    Kanye I love Rick Owens’ bed design but the back is...
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="button-container">
                    <Button className="btn-icon btn-round" color="facebook">
                      <i className="fab fa-facebook" />
                    </Button>
                    <Button className="btn-icon btn-round" color="twitter">
                      <i className="fab fa-twitter" />
                    </Button>
                    <Button className="btn-icon btn-round" color="google">
                      <i className="fab fa-google-plus" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default UserProfile;

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
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";

import loader from "assets/img/loader.svg";
import { Cookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';

import Axios from "axios";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notify: 0,
      token: 'Bearer ' + new Cookies().get('token'),
      userReady: false,
      user: [],
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

    await Axios.get('http://localhost:8080/api/utilisateurs/get/', { headers: headers }
    )
      .then(result => {
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

  async updateUser(id) {
    const headers = {
      Authorization: this.state.token
    }

    const data = {
      idUser: id
    }
    await Axios.post('http://localhost:8080/api/utilisateurs/activate/', data, { headers: headers }
    )
      .then(result => {
        this.notify("tr", 2, 'Mise à jour éffectuuée')
        this.updateData()
      })
      .catch(err => {
        console.log(err)
        this.notify("tr", 3, 'Impossible de mettre à jour les données')
      })
  }

  async updateAdmin(id) {
    const headers = {
      Authorization: this.state.token
    }

    const data = {
      idUser: id
    }
    await Axios.post('http://localhost:8080/api/utilisateurs/admin/', data, { headers: headers }
    )
      .then(result => {
        this.notify("tr", 2, 'Mise à jour éffectuuée')
        this.updateData()
      })
      .catch(err => {
        console.log(err)
        this.notify("tr", 3, 'Impossible de mettre à jour les données')
      })
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
          <Row className='text-right'>
            <Button className='mb-3 ml-3' onClick={() => this.props.history.push('/add-user')}>Nouvel Utilisateur</Button>
          </Row>
          <Row>
            <Col >
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Liste des utilisateurs</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Id</th>
                        <th>Cni</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Login</th>
                        <th>Tél</th>
                        <th>Mail</th>
                        <th className='text-center'>Administrateur</th>
                        <th className='text-center'>Activé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!this.state.userReady ?
                        <tr><td colSpan={9} align='center'><img src={loader} width={60} className='mt-5'></img></td></tr> :
                        this.state.user.map((values, key) => (
                          <tr key={key}>
                            <td>{values.id}</td>
                            <td>{values.numCni}</td>
                            <td>{values.nom}</td>
                            <td>{values.prenom}</td>
                            <td>{values.login}</td>
                            <td>{values.tel}</td>
                            <td>{values.mail}</td>
                            <td className='text-center'>
                              {
                                values.numCni != new Cookies().get('numCni') ?
                                  values.isAdmin ?
                                    <a title="Destituer Administrateur" onClick={() => this.updateAdmin(values.id)} className="text-decoration-none">
                                      <i className="fas fa-times fa-sm text-danger text-lg"></i>
                                    </a>
                                    :
                                    <a title="Nommer Administrateur" onClick={() => this.updateAdmin(values.id)} className="text-decoration-none">
                                      <i className="fas fa-check-square fa-sm text-success text-lg"></i>
                                    </a>
                                  :
                                  <a aria-disabled={true} title="Vous ne pouvez pas effectuer une action sur votre propre compte" onClick={(e) => e.preventDefault()} className="text-decoration-none">
                                    <i className="fas fa-ban fa-sm text-danger text-lg"></i>
                                  </a>
                              }
                            </td>
                            <td className='text-center'>
                              {
                                values.numCni != new Cookies().get('numCni') ?
                                  values.isActivated ?
                                    <a title="Désactiver l'utiisateur" onClick={() => this.updateUser(values.id)} className="text-decoration-none">
                                      <i className="fas fa-times fa-sm text-danger text-lg"></i>
                                    </a>
                                    :
                                    <a title="Activer l'utiisateur" onClick={() => this.updateUser(values.id)} className="text-decoration-none">
                                      <i className="fas fa-check-square fa-sm text-success text-lg"></i>
                                    </a>
                                  :
                                  <a aria-disabled={true} title="Vous ne pouvez pas effectuer une action sur votre propre compte" onClick={(e) => e.preventDefault()} className="text-decoration-none">
                                    <i className="fas fa-ban fa-sm text-danger text-lg"></i>
                                  </a>
                              }
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Users;

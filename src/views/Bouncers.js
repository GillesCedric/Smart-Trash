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
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";

import NotificationAlert from "react-notification-alert";
import loader from "assets/img/loader.svg";
import { Cookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';

import Axios from "axios";

class Bouncers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notify: 0,
      token: 'Bearer ' + new Cookies().get('token'),
      videursReady: false,
      videurs: [],
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

    await Axios.get('http://localhost:8080/api/utilisateurs/videurs/', { headers: headers }
    )
      .then(result => {
        this.setState({ videurs: result.data, videursReady: true })
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

  async updateVideur(id) {
    const headers = {
      Authorization: this.state.token
    }

    const data = {
      idVideur: id
    }
    await Axios.post('http://localhost:8080/api/utilisateurs/videurs/activate/', data, { headers: headers }
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
            <Button className='mb-3 ml-3' onClick={() => this.props.history.push('/add-bouncer')}>Nouveau Videur</Button>
          </Row>
          <Row>
            <Col >
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Liste des Videurs</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Id</th>
                        <th>Cni</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Tel</th>
                        <th>Utilisateur</th>
                        <th className='text-center'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!this.state.videursReady ?
                        <tr><td colSpan={8} align='center'><img alt='loader' src={loader} width={60} className='mt-5'></img></td></tr> :
                        this.state.videurs.map((values, key) => (
                          <tr key={key}>
                            <td>{values.id}</td>
                            <td>{values.numCni}</td>
                            <td>{values.nom}</td>
                            <td>{values.prenom}</td>
                            <td>{values.tel}</td>
                            <td>{values.Utilisateur.nom + ' ' + values.Utilisateur.prenom}</td>
                            <td className='text-center'>
                              {values.isActivated ?
                                <a title="Désactiver le videur" href="#" onClick={(e) => { e.preventDefault(); return this.updateVideur(values.id) }} className="text-decoration-none">
                                  <i className="fas fa-times fa-sm text-danger text-lg"></i>
                                </a>
                                :
                                <a title="Activer le videur" href="#" onClick={(e) => { e.preventDefault(); return this.updateVideur(values.id) }} className="text-decoration-none">
                                  <i className="fas fa-check-square fa-sm text-success text-lg"></i>
                                </a>
                              }
                            </td>
                          </tr>
                        ))}
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

export default Bouncers;

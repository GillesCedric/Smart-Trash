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
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <NavItem>
              <NavLink href="https://www.creative-tim.com/?ref=bdr-user-archive-footer">Smart-Trash</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.creative-tim.com/presentation?ref=bdr-user-archive-footer">Aide</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.creative-tim.com/blog?ref=bdr-user-archive-footer">Contactez le développeur</NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
            © {new Date().getFullYear()} Développé avec{" "}
            <i className="tim-icons icon-heart-2" /> par{" "}
            <a
              href="https://www.gillescedricdev.neway-agency.com/"
              target="_blank"
            >
              Gilles Cédric
            </a>{" "}
            pour une meilleure gestion.
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;

import {
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
  Modal
} from "reactstrap";
import React, {useState} from "react";
import listGroupClasses from '../../../../components/Notifications/notifications-demo/ListGroup.module.scss';
import notificationsClasses from '../../../../components/Notifications/Notifications.module.scss';
import { connect } from "react-redux";

const ResultsModal = props => {
  const [activeTab, setActiveTab] = useState("foundCountries")
  let countries = props[activeTab]
  if (activeTab === "countries")
    countries = countries.sort((a, b) => a.name > b.name ? 1 : -1)


  return <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <section
      className={`${notificationsClasses.notifications} navbar-notifications`}>
      <header
        className={[notificationsClasses.cardHeader, 'card-header'].join(' ')}>
        <div className="text-center mb-sm text-white">
          <strong >
            You found <span className="text-danger"> {props.foundCountries?.length || 0} </span> countries!
          </strong>
        </div>
        <ButtonGroup className={notificationsClasses.notificationButtons}>
          <Button
            outline
            color="default"
            size="sm"
            className={notificationsClasses.notificationButton}
            onClick={() => setActiveTab("foundCountries")}
            active={activeTab === "foundCountries"}
          >
            Found countries
          </Button>
          <Button
            outline color="default" size="sm"
            className={notificationsClasses.notificationButton}
            onClick={() => setActiveTab("countries")}
            active={activeTab === "countries"}
          >
            Remaining countries
          </Button>
        </ButtonGroup>
      </header>
      <ListGroup className={[listGroupClasses.listGroup, 'thin-scroll'].join(' ')}>
        {
          countries
            ? countries.map((c, i) =>
              <ListGroupItem className={listGroupClasses.listGroupItem} key={i}>
                <span className={[listGroupClasses.notificationIcon, 'thumb-sm'].join(' ')}>
                  <i
                    className={
                    `fa fa-${
                      activeTab === "foundCountries"
                        ? "check" : "map-marker"
                    } text-${
                      activeTab === "foundCountries"
                        ? "success" : "info"
                    } fa-lg`}/>
                </span>
                <p className="m-0 overflow-hidden">
                  {c.name}
                  {
                    activeTab === "foundCountries" && <time className="help-block m-0">
                      {c.time}
                    </time>
                  }
                </p>
              </ListGroupItem>
            )
            : <ListGroupItem className={listGroupClasses.listGroupItem}>
              <span className={[listGroupClasses.notificationIcon, 'thumb-sm'].join(' ')}>
              </span>
              <p className="text-center">
                <i className="fa fa-times text-danger fa-lg"/>
                {" "}
                No countries found
              </p>
            </ListGroupItem>
        }
      </ListGroup>
    </section>
  </Modal>
}
export default connect(s => s.map)(ResultsModal)

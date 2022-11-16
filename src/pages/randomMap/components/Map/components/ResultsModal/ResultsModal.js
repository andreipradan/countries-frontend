import {
  Badge,
  Button,
  ButtonGroup, Input, InputGroup, InputGroupAddon, InputGroupText,
  ListGroup,
  ListGroupItem,
  Modal
} from "reactstrap";
import React, {useEffect, useState} from "react";
import s from './Results.module.scss';
import MapClasses from "../../../../../freeGuessing/components/Map/Map.module.scss";

import listGroupClasses from '../../../../../../components/Notifications/notifications-demo/ListGroup.module.scss';
import notificationsClasses from '../../../../../../components/Notifications/Notifications.module.scss';
import { connect } from "react-redux";
import { setState } from "../../../../../../actions/map";
import SearchIcon
  from "../../../../../../components/Icons/HeaderIcons/SearchIcon";

const ResultsModal = props => {
  const [activeTab, setActiveTab] = useState("foundCountries")
  const [countryList, setCountryList] = useState(null)
  const [searchText, setSearchText] = useState("")

  let countries = props[activeTab]
  if (activeTab === "countries")
    countries = countries.sort((a, b) => a.name > b.name ? 1 : -1)

  useEffect(() => {
    // if (!props.isOpen) return searchText && setSearchText("")  // TODO: bring this back?
    setCountryList(countries?.filter(c => c.name.toLowerCase().includes(searchText)))
  }, [countries, props.isOpen, searchText])


  const color = props.foundCountries?.length < props.totalCountries * 10 / 100
    ? "danger"
    : props.foundCountries?.length < props.totalCountries * 35 /100
      ? "warning"
      : "success"
  return <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <section
      className={`${s.resultsModal} navbar-notifications`}>
      <header
        className={[notificationsClasses.cardHeader, 'card-header'].join(' ')}>
        <div className="text-center mb-sm text-white">
          <strong >
            You found {!props.countries?.length && !props.skippedCountries?.length && "all"}
            <span className={`text-${color}`}> {props.foundCountries?.length || 0} </span>
            countries!
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
            Found
            <Badge className="d-sm-down-none ml" style={{borderRadius: "50%"}} color="success">
              {props.foundCountries?.length || 0}
            </Badge>
          </Button>
          {
            props.skippedCountries?.length && <Button
              outline
              color="default"
              size="sm"
              className={notificationsClasses.notificationButton}
              onClick={() => setActiveTab("skippedCountries")}
              active={activeTab === "skippedCountries"}
            >
              Skipped
              <Badge className="d-sm-down-none ml" style={{borderRadius: "50%"}} color="warning">
                {props.skippedCountries?.length || 0}
              </Badge>
            </Button>
          }
          <Button
            outline color="default" size="sm"
            className={notificationsClasses.notificationButton}
            onClick={() => setActiveTab("countries")}
            active={activeTab === "countries"}
          >
            Remaining
            <Badge className={`d-sm-down-none ml`} style={{borderRadius: "50%"}} color="info">
              {props.countries?.length || 0}
            </Badge>
          </Button>
        </ButtonGroup>
        <InputGroup className={`input-group-no-border ${MapClasses.searchForm}`}>
					<InputGroupAddon addonType="prepend">
						<InputGroupText className={MapClasses.inputGroupText}>
							<SearchIcon className={MapClasses.headerIcon}/>
						</InputGroupText>
					</InputGroupAddon>
					<Input
						id="search-input"
						className="input-transparent"
						placeholder="Search"
						onKeyUp={event => {event.key === "Escape" && setSearchText("")}
					}
						onInput={e => {
							e.preventDefault()
              setSearchText(e.target.value.toLowerCase().trim())
						}}
						autoFocus
					/>
				</InputGroup>
      </header>
      <ListGroup className={[listGroupClasses.listGroup, 'thin-scroll'].join(' ')}>
        {
          countryList
            ? countryList.map((c, i) =>
              <ListGroupItem
                className={listGroupClasses.listGroupItem}
                key={i}
                onClick={() => props.dispatch(setState({currentCountry: c}))}
              >
                <span className={[listGroupClasses.notificationIcon, 'thumb-sm'].join(' ')}>
                  <i
                    className={
                    `fa fa-${
                      activeTab === "foundCountries"
                        ? "check"
                        : activeTab === "skippedCountries"
                          ? "step-forward"
                          : "map-marker"
                    } text-${
                      activeTab === "foundCountries"
                        ? "success"
                        : activeTab === "skippedCountries"
                          ? "warning"
                          : "info"
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

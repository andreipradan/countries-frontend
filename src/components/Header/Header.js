import { connect } from "react-redux";
import React, {useState} from "react";
import { withRouter } from "react-router";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  UncontrolledAlert,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  ButtonGroup,
  Button,
} from "reactstrap";
import Notifications from "../Notifications";
import PowerIcon from "../Icons/HeaderIcons/PowerIcon";
import BellIcon from "../Icons/HeaderIcons/BellIcon";
import SettingsIcon from "../Icons/HeaderIcons/SettingsIcon";
import MessageIcon from "../Icons/HeaderIcons/MessageIcon";
import BurgerIcon from "../Icons/HeaderIcons/BurgerIcon";
import ArrowIcon from "../Icons/HeaderIcons/ArrowIcon";


import {logout} from "../../actions/user";
import {
  openSidebar,
  closeSidebar,
  changeSidebarPosition,
  changeSidebarVisibility,
} from "../../actions/navigation";

import sender1 from "../../assets/people/a1.jpg";
import sender2 from "../../assets/people/a5.jpg";
import sender3 from "../../assets/people/a4.jpg";

import avatar from "../../assets/people/a7.jpg";

import s from "./Header.module.scss";
import "animate.css";
import {getDisplayName} from "../../pages/dashboard/utils";

const Header = props => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const toggleSidebar = () => {
    props.isSidebarOpened
      ? props.dispatch(closeSidebar())
      : props.dispatch(openSidebar());
  }

  const moveSidebar = position => {
    props.dispatch(changeSidebarPosition(position));
  }

  const toggleVisibilitySidebar = visibility => {
    props.dispatch(changeSidebarVisibility(visibility));
  }

  return <Navbar className={`d-print-none `}>
    <div className={s.burger}>
      <NavLink
          onClick={toggleSidebar}
          className={`d-md-none ${s.navItem} text-white`}
          href="#"
        >
          <BurgerIcon className={s.headerIcon} />
        </NavLink>
    </div>
    <div className={`d-print-none ${s.root}`}>
      <UncontrolledAlert
        className={`${s.alert} mr-3 d-lg-down-none animate__animated animate__bounceIn animate__delay-1s`}
      >
        Check out Light Blue{" "}
        <button
          className="btn-link"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <SettingsIcon className={s.settingsIcon} />
        </button>{" "}
        on the right!
      </UncontrolledAlert>

      <Nav className="ml-md-0">
        <Dropdown
          nav
          isOpen={notificationsOpen}
          toggle={() => setNotificationsOpen(!notificationsOpen)}
          id="basic-nav-dropdown"
          className={`${s.notificationsMenu}`}
        >
          <DropdownToggle nav caret style={{ color: "#C1C3CF", padding: 0 }}>
            <span className={`${s.avatar} rounded-circle thumb-sm float-left`}>
              <img src={`https://ui-avatars.com/api/?color=d5d5d5&background=474d84&length=2&rounded=true&size=128&font-size=0.35&bold=true&name=${getDisplayName(props.user, '+')}`} alt="..." />
            </span>
            <span className={`small d-sm-down-none ${s.accountCheck}`}>{getDisplayName(props.user)}</span>
            <Badge className={`d-sm-down-none ${s.badge}`} color="danger">
              9
            </Badge>
          </DropdownToggle>
          <DropdownMenu
            right
            className={`${s.notificationsWrapper} py-0 animate__animated animate__faster animate__fadeInUp`}
          >
            <Notifications />
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          className="d-none d-sm-block"
          nav
          isOpen={messagesOpen}
          toggle={() => setMessagesOpen(!messagesOpen)}
        >
          <DropdownToggle nav className={`d-sm-down-none ${s.navItem} text-white`}>
            <MessageIcon className={s.headerIcon} />
          </DropdownToggle>
          <DropdownMenu className={`${s.dropdownMenu} ${s.messages}`}>
            <DropdownItem>
              <img className={s.image} src={sender1} alt="" />
              <div className={s.details}>
                <div>Jane Hew</div>
                <div className={s.text}>Hey, John! How is it going? ...</div>
              </div>
            </DropdownItem>
            <DropdownItem>
              <img className={s.image} src={sender2} alt="" />
              <div className={s.details}>
                <div>Alies Rumiancaŭ</div>
                <div className={s.text}>
                  I will definitely buy this template
                </div>
              </div>
            </DropdownItem>
            <DropdownItem>
              <img className={s.image} src={sender3} alt="" />
              <div className={s.details}>
                <div>Michał Rumiancaŭ</div>
                <div className={s.text}>
                  Is it really Lore ipsum? Lore ...
                </div>
              </div>
            </DropdownItem>
            <DropdownItem>
              {/* eslint-disable-next-line */}
              <a href="#" className="text-white">
                See all messages <ArrowIcon className={s.headerIcon} maskName="messagesArrow" />
              </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavItem className={`${s.divider} d-none d-sm-block`} />
        <Dropdown
          className="d-none d-sm-block"
          nav
          isOpen={settingsOpen}
          toggle={() => setSettingsOpen(!settingsOpen)}
        >
          <DropdownToggle nav className={`${s.navItem} text-white`}>
            <SettingsIcon addId='header-settings' className={s.headerIcon} />
          </DropdownToggle>
          <DropdownMenu className={`${s.dropdownMenu} ${s.settings}`}>
            <h6>Sidebar on the</h6>
            <ButtonGroup size="sm">
              <Button
                color="primary"
                onClick={() => moveSidebar("left")}
                className={props.sidebarPosition === "left" ? "active" : ""}
              >
                Left
              </Button>
              <Button
                color="primary"
                onClick={() => moveSidebar("right")}
                className={props.sidebarPosition === "right" ? "active" : ""}
              >
                Right
              </Button>
            </ButtonGroup>
            <h6 className="mt-2">Sidebar</h6>
            <ButtonGroup size="sm">
              <Button
                color="primary"
                onClick={() => toggleVisibilitySidebar("show")}
                className={props.sidebarVisibility === "show" ? "active" : ""}
              >
                Show
              </Button>
              <Button
                color="primary"
                onClick={() => toggleVisibilitySidebar("hide")}
                className={props.sidebarVisibility === "hide" ? "active" : ""}
              >
                Hide
              </Button>
            </ButtonGroup>
          </DropdownMenu>
        </Dropdown>
        <Dropdown
          className="d-none d-sm-block"
          nav
          isOpen={supportOpen}
          toggle={() => setSupportOpen(!supportOpen)}
        >
          <DropdownToggle nav className={`${s.navItem} text-white`}>
            <BellIcon className={s.headerIcon} />
            <div className={s.count}></div>
          </DropdownToggle>
          <DropdownMenu right className={`${s.dropdownMenu} ${s.support}`}>
            <DropdownItem>
              <Badge color="danger">
                <i className="fa fa-bell-o" />
              </Badge>
              <div className={s.details}>Check out this awesome ticket</div>
            </DropdownItem>
            <DropdownItem>
              <Badge color="warning">
                <i className="fa fa-question-circle" />
              </Badge>
              <div className={s.details}>What is the best way to get ...</div>
            </DropdownItem>
            <DropdownItem>
              <Badge color="success">
                <i className="fa fa-info-circle" />
              </Badge>
              <div className={s.details}>
                This is just a simple notification
              </div>
            </DropdownItem>
            <DropdownItem>
              <Badge color="info">
                <i className="fa fa-plus" />
              </Badge>
              <div className={s.details}>12 new orders has arrived today</div>
            </DropdownItem>
            <DropdownItem>
              <Badge color="danger">
                <i className="fa fa-tag" />
              </Badge>
              <div className={s.details}>
                One more thing that just happened
              </div>
            </DropdownItem>
            <DropdownItem>
              {/* eslint-disable-next-line */}
              <a href="#" className="text-white">
                See all tickets <ArrowIcon className={s.headerIcon} maskName="bellArrow" />
              </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavItem>
          <NavLink
            onClick={() => props.dispatch(logout())}
            className={`${s.navItem} text-white`}
            href="#"
          >
            <PowerIcon className={s.headerIcon} />
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </Navbar>
}

function mapStateToProps(store) {
  return {
    isSidebarOpened: store.navigation.sidebarOpened,
    sidebarVisibility: store.navigation.sidebarVisibility,
    sidebarPosition: store.navigation.sidebarPosition,
    user: store.auth.user,
  };
}

export default withRouter(connect(mapStateToProps)(Header));

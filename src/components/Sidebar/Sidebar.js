import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Progress, Alert} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {dismissAlert} from '../../actions/alerts';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';

import {changeActiveSidebarItem} from '../../actions/navigation';


class Sidebar extends React.Component {
	static propTypes = {
		sidebarStatic: PropTypes.bool,
		sidebarOpened: PropTypes.bool,
		dispatch: PropTypes.func.isRequired,
		activeItem: PropTypes.string,
		location: PropTypes.shape({
			pathname: PropTypes.string,
		}).isRequired,
	};

	static defaultProps = {
		sidebarStatic: false,
		activeItem: '',
	};

	componentDidMount() {
		this.element.addEventListener('transitionend', () => {
			if (this.props.sidebarOpened) {
				this.element.classList.add(s.sidebarOpen);
			}
		}, false);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.sidebarOpened !== this.props.sidebarOpened) {
			if (nextProps.sidebarOpened) {
				this.element.style.height = `${this.element.scrollHeight}px`;
			} else {
				this.element.classList.remove(s.sidebarOpen);
				setTimeout(() => {this.element.style.height = ''}, 0);
			}
		}
	}

	dismissAlert(id) {
		this.props.dispatch(dismissAlert(id));
	}

	render() {
		return (
			<nav
				className={cx(s.root)}
				ref={(nav) => {this.element = nav}}
			>
				<header className={s.logo}>
					<a href="https://demo.flatlogic.com/light-blue-react/">Country <span
						className="fw-bold">Guess</span></a>
				</header>
				<ul className={s.nav}>
					<LinksGroup
						onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
						activeItem={this.props.activeItem}
						header="Home"
						isHeader
						iconName="flaticon-home"
						link="/app/dashboard"
						index="main"
					/>
					<h5 className={[s.navTitle, s.groupTitle].join(' ')}>TEMPLATE</h5>
					<LinksGroup
						onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
						activeItem={this.props.activeItem}
						header="Typography"
						isHeader
            iconName="flaticon-network"
						link="/app/typography"
						index="core"
					/>
					<LinksGroup
						onActiveSidebarItemChange={t => this.props.dispatch(changeActiveSidebarItem(t))}
						activeItem={this.props.activeItem}
						header="Tables Basic"
						isHeader
            iconName="flaticon-map-location"
						link="/app/tables"
						index="tables"
					/>
					<LinksGroup
						onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
						activeItem={this.props.activeItem}
						header="Notifications"
						isHeader
            iconName="flaticon-layers"
						link="/app/notifications"
						index="ui"
					/>
					<LinksGroup
						onActiveSidebarItemChange={activeItem => this.props.dispatch(changeActiveSidebarItem(activeItem))}
						activeItem={this.props.activeItem}
						header="Components"
						isHeader
            iconName="flaticon-list"
						link="/app/components"
						index="components"
						childrenLinks={[
							{
								header: 'Charts', link: '/app/components/charts',
							},
							{
								header: 'Icons', link: '/app/components/icons',
							},
							{
								header: 'Maps', link: '/app/components/maps',
							},
						]}
					/>
				</ul>
				<h5 className={s.navTitle}>
					LABELS
					{/* eslint-disable-next-line */}
				</h5>
				{/* eslint-disable */}
				<ul className={s.sidebarLabels}>
					<li>
						<a href="#">
							<i className="fa fa-circle text-success mr-2"/>
							<span className={s.labelName}>My Recent</span>
						</a>
					</li>
					<li>
						<a href="#">
							<i className="fa fa-circle text-primary mr-2"/>
							<span className={s.labelName}>Starred</span>
						</a>
					</li>
					<li>
						<a href="#">
							<i className="fa fa-circle text-danger mr-2"/>
							<span className={s.labelName}>Background</span>
						</a>
					</li>
				</ul>
				{/* eslint-enable */}
				<h5 className={s.navTitle}>
					PROJECTS
				</h5>
				<div className={s.sidebarAlerts}>
					{this.props.alertsList.map(alert => // eslint-disable-line
						<Alert
							key={alert.id}
							className={s.sidebarAlert}
							color="transparent"
							isOpen={true} // eslint-disable-line
							toggle={() => {
								this.dismissAlert(alert.id);
							}}
						>
							<span>{alert.title}</span><br/>
							<Progress className={`bg-subtle-blue progress-xs mt-1`}
												color={alert.color}
												value={alert.value}/>
							<span className={s.alertFooter}>{alert.footer}</span>
						</Alert>,
					)}
				</div>
			</nav>
		);
	}
}

function mapStateToProps(store) {
	return {
		sidebarOpened: store.navigation.sidebarOpened,
		sidebarStatic: store.navigation.sidebarStatic,
		alertsList: store.alerts.alertsList,
		activeItem: store.navigation.activeItem,
	};
}

export default withRouter(connect(mapStateToProps)(Sidebar));

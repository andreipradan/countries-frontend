import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


import '../styles/theme.scss';
import ErrorPage from '../pages/error';
import LayoutComponent from '../components/Layout';
import Login from '../pages/login';
import Register from '../pages/register';

const PrivateRoute = ({isAuthenticated, component, ...rest }) => {
    if (!isAuthenticated) {
        return (<Redirect to="/login"/>)
    } else {
        return ( // eslint-disable-line
            <Route {...rest} render={props => (React.createElement(component, props))}/>
        );
    }
};

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

const App = props => <div>
    <ToastContainer
        autoClose={5000}
        hideProgressBar
        closeButton={<CloseButton/>}
    />
    <HashRouter>
        <Switch>
            <Route path="/" exact render={() => <Redirect to="/app/main"/>}/>
            <Route path="/app" exact render={() => <Redirect to="/app/main"/>}/>
            <PrivateRoute path="/app" isAuthenticated={props.isAuthenticated} component={LayoutComponent}/>
            <Route path="/register" exact component={Register}/>
            <Route path="/login" exact component={Login}/>
            <Route path="/error" exact component={ErrorPage}/>
            <Route component={ErrorPage}/>
            <Redirect from="*" to="/app/main/dashboard"/>
        </Switch>
    </HashRouter>
</div>

const mapStateToProps = state => ({
  isAuthenticated: Boolean(state.auth.token),
});

export default connect(mapStateToProps)(App);

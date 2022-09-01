import React, {useState} from 'react';
import {withRouter, Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {
	Container,
	Alert,
	Button,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input,
	InputGroupText
} from 'reactstrap';
import Widget from '../../components/Widget';
import {loginUser} from '../../actions/user';
import microsoft from '../../assets/microsoft.png';

const Login = props => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const changeEmail = e => setEmail(e.target.value)
	const changePassword = e => setPassword(e.target.value)
	const doLogin = e => {
		e.preventDefault();
		props.dispatch(loginUser({email: email, password: password}))
	}

	const {from} = props.location.state || {from: {pathname: '/app'}}; // eslint-disable-line

	if (props.isAuthenticated) {return (<Redirect to={from}/>)}

	return <div className="auth-page">
		<Container>
			<Widget
				className="widget-auth mx-auto"
				title={<h3 className="mt-0">Login to your Web App</h3>}
			>
				<p className="widget-auth-info">
					Use your email to sign in.
				</p>
				<form onSubmit={doLogin}>
					{
						props.errors?.map((item, index) => (
							<Alert
								className="alert-sm widget-middle-overflow rounded-0"
								color="danger"
								key={index}
							>{item}</Alert>
						))
					}
					<FormGroup className="mt">
						<Label for="email">Email</Label>
						<InputGroup className="input-group-no-border">
							<InputGroupAddon addonType="prepend">
								<InputGroupText>
									<i className="la la-user text-white"/>
								</InputGroupText>
							</InputGroupAddon>
							<Input id="email" className="input-transparent pl-3"
										 value={email} onChange={changeEmail}
										 type="email"
										 required name="email" placeholder="Email"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="password">Password</Label>
						<InputGroup className="input-group-no-border">
							<InputGroupAddon addonType="prepend">
								<InputGroupText>
									<i className="la la-lock text-white"/>
								</InputGroupText>
							</InputGroupAddon>
							<Input id="password" className="input-transparent pl-3"
										 value={password}
										 onChange={changePassword} type="password"
										 required name="password" placeholder="Password"/>
						</InputGroup>
					</FormGroup>
					<div className="bg-widget auth-widget-footer">
						<Button type="submit" color="danger" className="auth-btn"
										size="sm" style={{color: '#fff'}}>
															<span className="auth-btn-circle"
																		style={{marginRight: 8}}>
																<i className="la la-caret-right"/>
															</span>
							{props.isFetching ? 'Loading...' : 'Login'}
						</Button>
						<p className="widget-auth-info mt-4">
							Don't have an account? Sign up now!
						</p>
						<Link className="d-block text-center mb-4" to="register">Create
							an Account</Link>
						<div className="social-buttons">
							<Button color="primary" className="social-button">
								<i className="social-icon social-google"/>
								<p className="social-text">GOOGLE</p>
							</Button>
							<Button color="success" className="social-button">
								<i className="social-icon social-microsoft"
									 style={{backgroundImage: `url(${microsoft})`}}/>
								<p className="social-text"
									 style={{color: '#fff'}}>MICROSOFT</p>
							</Button>
						</div>
					</div>
				</form>
			</Widget>
		</Container>
		<footer className="auth-footer">
			{new Date().getFullYear()} &copy; Light Blue Template - React Admin
			Dashboard Template Made by <a href="https://flatlogic.com"
																		rel="noopener noreferrer"
																		target="_blank">Flatlogic LLC</a>.
		</footer>
	</div>
}

function mapStateToProps(state) {
	return {
		isFetching: state.auth.loading,
		isAuthenticated: Boolean(state.auth.token),
		errors: state.auth.errors,
	};
}

export default withRouter(connect(mapStateToProps)(Login));


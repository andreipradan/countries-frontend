import React, {useState} from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap';
import Widget from '../../components/Widget';
import { registerUser, registerErrors } from '../../actions/user';

const Register = props => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')

	const changeEmail = e => setEmail(e.target.value)
	const changePassword = e => setPassword(e.target.value)
	const changeConfirmPassword = e => setPassword2(e.target.value)

	const checkPassword = () => {
		if (!password) {
			props.dispatch(registerErrors(["Password field is empty"]));
		} else {
			props.dispatch(registerErrors(["Passwords must match"]));
		}
	}

  const doRegister = e => {
			e.preventDefault();
			if (password !== password2) {
				checkPassword();
			} else {
				props.dispatch(registerUser({
					creds: {email: email, password: password, password2: password2},
					history: props.history
				}))
			}
    }

		const {from} = props.location.state || {from: {pathname: '/app'}}; // eslint-disable-line
		if (Boolean(props.token)) { return <Redirect to={from}/>}

		return <div className="auth-page">
			<Container>
				<Widget className="widget-auth mx-auto"
								title={<h3 className="mt-0">Login to your Web App</h3>}>
					<p className="widget-auth-info">
						Please fill all fields below.
					</p>
					<form onSubmit={doRegister}>
						{
							props.errors && (
								<Alert className="alert-sm widget-middle-overflow rounded-0"
											 color="danger">
									{props.errors}
								</Alert>
							)
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
											 value={email}
											 onChange={changeEmail} type="email"
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
						<FormGroup>
							<Label for="confirmPassword">Confirm</Label>
							<InputGroup className="input-group-no-border">
								<InputGroupAddon addonType="prepend">
									<InputGroupText>
										<i className="la la-lock text-white"/>
									</InputGroupText>
								</InputGroupAddon>
								<Input id="confirmPassword" className="input-transparent pl-3"
											 value={password2}
											 onChange={changeConfirmPassword}
											 type="password"
											 required name="confirmPassword" placeholder="Confirm"/>
							</InputGroup>
						</FormGroup>
						<div className="bg-widget-transparent auth-widget-footer">
							<Button type="submit" color="danger" className="auth-btn"
											size="sm"
											style={{color: '#fff'}}>{props.loading ? 'Loading...' : 'Register'}</Button>
							<p className="widget-auth-info mt-4">
								Already have the account? Login now!
							</p>
							<Link className="d-block text-center mb-4" to="login">Enter the
								account</Link>
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

export default withRouter(connect(state => state.auth)(Register));


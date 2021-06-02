import React from "react";
import axios from "axios";
import { Switch, Route, Redirect } from "react-router-dom";
import { Row, Col, Form } from "reactstrap";
import background from "../../assets/background.svg";
import doctor from "../../assets/doctor_2.jpg";
import Header from "../header";
import LogIn from "../loginIn";
import SecNavBar from "../Patient/secNavBar";
import LoginNav from "../LoginNav";
import DoctorRoutes from "../../Routes/doctorRoutes";
import LoginCard from "../LoginCard";
import jwt from "jwt-decode";
class DoctorLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			role: "doctor",
			auth: false,
			admin_id: "",
			error: "",
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	async handleSubmit(childEmail, childPswrd) {
		await this.setState({ email: childEmail, password: childPswrd });
		axios.post("http://localhost:12347/login", this.state).then((res) => {
			console.log(jwt(res.data.token));
			if (res.data) {
				sessionStorage.setItem("token", res.data.token);
				sessionStorage.setItem("docName", jwt(res.data.token).name);
				sessionStorage.setItem("doc_id", jwt(res.data.token).Id);
				sessionStorage.setItem("auth", jwt(res.data.token).auth);
				this.setState({ docredirectReq: true });
			} else {
				alert(res.data.error);
			}
		});
	}

	render() {
		if (sessionStorage.getItem("auth")) {
			return (
				<div>
					<SecNavBar
						data="doctorData"
						name="docName"
						link="/doctorLogin"
					/>
					<Header msg={sessionStorage.getItem("docName")} />
					<DoctorRoutes />
				</div>
			);
		}
		return (
			<div style={{ backgroundImage: `url(${background})` }}>
				<div>
					<Switch>
						<Route exact path="/doctorLogin">
							<LoginNav />
							<Row>
								<LoginCard src={doctor} msg="Doctor" />
								<Col md="6">
									<Form
										style={{
											marginTop: "200px",
											marginLeft: "200px",
										}}
									>
										<LogIn fun={this.handleSubmit} />
									</Form>
								</Col>
							</Row>
						</Route>
						<Route>
							<Redirect to="/doctorLogin" />
						</Route>
					</Switch>
				</div>
			</div>
		);
	}
}
export default DoctorLogin;

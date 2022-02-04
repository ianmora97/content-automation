import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Menu from "./views/components/Menu.jsx";
import MainContainer from "./views/components/MainContainer.jsx";
import Cosy from "./views/main/Cosy.jsx";
import Offers from "./views/main/Offers.jsx";

class App extends Component {
	render() {
		return (
			<Router>
				<Routes>
					<Route path="/cosy" element={
						<div id="wrapper">
							<Menu location={"cosy"}/>
							<MainContainer headline={"Cosy Images"}>
								<Cosy/>
							</MainContainer>
						</div>
					}/>
					<Route path="/offers" element={
						<div id="wrapper">
							<Menu location={"offers"}/>
							<MainContainer headline={"Offers"}>
								<Offers/>
							</MainContainer>
						</div>
					}/>
				</Routes>
			</Router>
		);
	}
}

export default App;
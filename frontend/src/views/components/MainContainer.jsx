import React, { Component } from "react";

export class MainContainer extends Component {
	render() {
		const { headline } = this.props;
		return (
			<div className="container-fluid h-100" id="mainContent">
				<div className="bg-dark-light p-3 rounded-15">
					<h2 class="fw-bold mb-0">{headline}</h2>
					<hr />
					<div style={{ height: "calc(100vh - 140px)", overflowY: "auto" }}>
						{this.props.children}
					</div>
				</div>
			</div>
		);
  }
}

export default MainContainer;

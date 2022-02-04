import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
    faImage,
	faHashtag,
	faThLarge,
	faRedoAlt,
	faCog,
	faAlignJustify,
} from "@fortawesome/free-solid-svg-icons";
import { faConfluence, faJira } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from '@tippyjs/react';

import logo from "../../img/logo.svg";

export class Menu extends Component {
	animateCSS = (element, animation, prefix = 'animate__') => {
        return new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = document.querySelector(element);
            node.classList.add(`${prefix}animated`, animationName);
            function handleAnimationEnd(event) {
                event.stopPropagation();
                node.classList.remove(`${prefix}animated`, animationName);
                resolve('Animation ended');
            }
            node.addEventListener('animationend', handleAnimationEnd, {once: true});
        });
	}
	componentDidMount(){
		this.animateCSS('#menu-item-cosy', 'fadeInLeft');
		this.animateCSS('#menu-item-offers', 'fadeInLeft');
		this.animateCSS('#menu-item-techspecs', 'fadeInLeft');
		this.animateCSS('#menu-item-sitemap', 'fadeInLeft');
		this.animateCSS('#menu-item-texteditor', 'fadeInLeft');
		this.animateCSS('#menu-item-confluence', 'fadeInLeft');
		this.animateCSS('#menu-item-settings', 'fadeInLeft');
	}
	render() {
		const {location} = this.props;
		return (
			<div className="" id="menuTabs">
				<div id="logo" className="d-flex justify-content-start">
					<img src={logo} alt="Content Automation Logo"/>
					<div className="d-flex flex-column pt-1 ps-2">
						<h4 className="fw-bold text-white mb-0">Content Automation</h4>
						<small className="text-light mt-1">BMW</small>
					</div>
				</div>
				<hr/>
				<p className="text-light m-0 fst-italic fw-light small">Tasks</p>
				<div className="d-flex flex-column px-2" style={{height:"calc(100vh - 134px)"}}>
					<div className="me-3">
						<div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
							<Tippy content="Cosy" placement="right" animation="shift-away-extreme">
								<Link to="/cosy" className={`nav-link menu-item-side ${location === "cosy" ? "active" :""}`} aria-current="page" id="menu-item-cosy">
									<FontAwesomeIcon icon={faImage} className="me-2"/><span className="noTextToggle">Cosy Images</span>
								</Link>
							</Tippy>
							<Tippy content="Offers" placement="right" animation="shift-away-extreme">
								<Link to="/offers" className={`nav-link menu-item-side ${location === "offers" ? "active" :""}`} aria-current="page" style={{animationDelay:"0.2s"}} id="menu-item-offers" >
									<FontAwesomeIcon icon={faHashtag} className="me-2"/><span className="noTextToggle">Offers</span>
								</Link>
							</Tippy>
							<Tippy content="Techspecs" placement="right" animation="shift-away-extreme">
								<Link to="/techspecs" className={`nav-link menu-item-side ${location === "techspecs" ? "active" :""}`} aria-current="page" style={{animationDelay:"0.4s"}} id="menu-item-techspecs">
									<FontAwesomeIcon icon={faThLarge} className="me-2"/><span className="noTextToggle">TechSpecs</span>
								</Link>
							</Tippy>
							<Tippy content="Sitemap" placement="right" animation="shift-away-extreme">
								<Link to="/sitemap" className={`nav-link menu-item-side ${location === "sitemap" ? "active" :""}`} aria-current="page" style={{animationDelay:"0.6s"}} id="menu-item-sitemap">
									<FontAwesomeIcon icon={faRedoAlt} className="me-2"/><span className="noTextToggle">Sitemap</span>
								</Link>
							</Tippy>
							<Tippy content="URLs Paths" placement="right" animation="shift-away-extreme">
								<Link to="/texteditor" className={`nav-link menu-item-side ${location === "texteditor" ? "active" :""}`} aria-current="page" style={{animationDelay:"0.8s"}} id="menu-item-texteditor">
									<FontAwesomeIcon icon={faAlignJustify} className="me-2"/><span className="noTextToggle">Text Editor</span>
								</Link>
							</Tippy>
							<hr/>
							<p className="text-light m-0 fst-italic fw-light small">Personal</p>
							<Tippy content="Deployments" placement="right" animation="shift-away-extreme">
								<Link to="/confluence" className={`nav-link menu-item-side ${location === "confluence" ? "active" :""}`} aria-current="page" style={{animationDelay:"1s"}} id="menu-item-confluence">
									<FontAwesomeIcon icon={faConfluence} className="me-2"/><span className="noTextToggle">Confluence</span>
								</Link>
							</Tippy>
							<Tippy content="Settings" placement="right" animation="shift-away-extreme">
								<Link to="/settings" className={`nav-link menu-item-side ${location === "settings" ? "active" :""}`} aria-current="page" style={{animationDelay:"1.2s"}} id="menu-item-settings">
									<FontAwesomeIcon icon={faCog} className="me-2"/><span className="noTextToggle">Settings</span>
								</Link>
							</Tippy>
						</div>
					</div>
					<div className="mt-auto">
						<hr/>
						<div className="d-flex justify-content-start">
							<div className="jiraSearch">
								<button className="btn btn-primary btn-sm btn-cls" type="button" data-bs-toggle="offcanvas" 
								data-bs-target="#jiraTicketOffcanvas" aria-controls="jiraTicketOffcanvas">
									<FontAwesomeIcon icon={faJira} className="text-white"/>
								</button>
							</div>         
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Menu;
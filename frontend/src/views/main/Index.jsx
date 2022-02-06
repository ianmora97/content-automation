import React, { Component } from "react";
import icon from "../../img/logo.svg";
import axios from "axios";

export class Index extends Component {
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
        this.animateCSS('#logo', 'fadeInDown');
        this.animateCSS('#title', 'fadeIn').then(() => {
            document.querySelector('#title').style.animationDelay = "0s";
        });
        this.animateCSS('#subtitle', 'fadeIn').then(() => {
            document.querySelector('#subtitle').style.animationDelay = "0s";
        });
        this.loadConfigDB();
    }
    navigateToHome = () => {
        document.getElementsByClassName("curtain")[0].classList.add("active");
        this.animateCSS("#logo", "fadeOut").then(()=>{document.querySelector("#logo").style.display = "none"})
        this.animateCSS("#title", "fadeOut").then(()=>{document.querySelector("#title").style.display = "none"})
        this.animateCSS("#subtitle", "fadeOut").then(()=>{
            document.querySelector("#subtitle").style.display = "none";
            window.location.href = "/cosy";
        })
    }
    loadConfigDB = async () =>{
        const url = 'http://localhost:8895/api/v1/get/config';
        try {
            const res = await axios.get(url);
            if (res.status === 200) {
                localStorage.setItem('email_auth', res.data.data.c_email);
                localStorage.setItem('token_auth', res.data.data.c_token);
                localStorage.setItem('cosyYear', res.data.data.p_year);
                localStorage.setItem('favView', res.data.data.fav_view);
            } else {
                console.log('Error');
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="curtain">
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <div className="spinner-border text-light me-2" role="status"></div>
                        <span>Loading...</span>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-center text-center">
                <img
                    src={icon}
                    alt="Content Automation Icon"
                    className="p-1 bg-dark-light hoverImageIcon mx-auto"
                    style={{ width: "200px", height: "200px", borderRadius: "30px", cursor: "pointer" }}
                    id="logo"
                    onClick={this.navigateToHome}
                />
                <h1
                    className="text-white mt-4"
                    style={{ animationDelay: "0.5s" }}
                    id="title"
                >
                    Content Automation
                </h1>
                <p
                    className="text-muted"
                    style={{ animationDelay: "0.7s" }}
                    id="subtitle"
                >
                    Optimize processes and tasks
                </p>
                </div>
            </div>
        );
    }
}

export default Index;

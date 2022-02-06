import React, { Component } from 'react';
import axios from 'axios';
import {
    faQuestionCircle, faSave
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class Settings extends Component {
    state = {
        form:{
            email: "",
            token: "",
        },
        cosyYear: 0,
        favView: "",
        domain: "",
        modelList: "",
        start: "",
        options: "",
    }
    handleChange = async e => {
        const { name, value } = e.target;
        await this.setState({
            form: {
                ...this.state.form,
                [name]: value
            }
        })
    }
    setConfigJsonJira = async () => {
        const { email, token } = this.state.form;
        const url = 'http://localhost:8895/api/v1/set/jira';
        const data = {email,token}
        try {
            const res = await axios.post(url, data);
            if (res.status === 200) {
                localStorage.setItem('token_auth', email);
                localStorage.setItem('user_auth', token);
            } else {
                console.log('Error: ', res.status);
            }
        } catch (error) {
            console.log(error);
        }
    }
    fillDropdown = () => {
        // TODO: Fill 2 years between today's Year
        let lo_year = parseInt(new Date().getFullYear().toString().slice(2,4));
        let lo_vecYears = [];
        lo_vecYears.push(lo_year);
        for(let i = 1; i < 3; i++){lo_vecYears.push(lo_year - i, lo_year + i)}
        lo_vecYears.sort(function(a,b){if(a>b)return -1;return 0})
        return lo_vecYears;
    }
    componentDidMount(){
        this.loadConfigDB();
    }
    loadConfigDB = async () =>{
        const url = 'http://localhost:8895/api/v1/get/config';
        try {
            const res = await axios.get(url);
            if (res.status === 200) {
                this.setState({
                    form:{
                        email: res.data.data.c_email,
                        token: res.data.data.c_token,
                    },
                    cosyYear: res.data.data.p_year,
                    favView: res.data.data.fav_view,
                });
            } else {
                console.log('Error');
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div>
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="pb-2">Jira</h4>
                    <button type="button" className="btn btn-primary btn-sm rounded-15" data-bs-toggle="modal" data-bs-target="#jiratokenmodal">
                        <FontAwesomeIcon icon={faQuestionCircle} /> Get Jira Token
                    </button>
                </div>
                <div className="mb-3">
                    <label htmlFor="emailJira" className="form-label text-light small mb-1">Email</label>
                    <input type="email" className="form-control bg-dark border-0" name="email" onChange={this.handleChange} placeholder="Email..." value={this.state.form.email} />
                    <small>Your Jira email</small>
                </div>
                <div className="mb-3">
                    <label htmlFor="jiraToken" className="form-label text-light small mb-1">Token</label>
                    <input type="password" className="form-control bg-dark border-0" name="token" onChange={this.handleChange} placeholder="Token..." value={this.state.form.token}/>
                </div>
                <button type="button" className="btn btn-primary" onClick={this.setConfigJsonJira} id="validateButton">
                    <span id="saveJiraBtn"><FontAwesomeIcon icon={faSave} /></span> Save
                </button>
                <div className="py-2">
                    <hr/>
                </div>
                <h4 className="pb-2">In-App</h4>
                <div className="mb-3">
                    <label htmlFor="cosyYear" className="form-label text-light small mb-1">CoSy Year</label>
                    {/* onchange="setCondigJsonCosyYear(this)" */}
                    <select className="form-select bg-dark border-0" aria-label="cosyYear"  id="cosyYear">
                        {
                            this.fillDropdown().map(e => {
                                if(this.state.cosyYear === e){
                                    return(<option key={e} value={e} selected>{e}</option>)
                                }else{
                                    return(<option key={e} value={e}>{e}</option>)
                                }
                            })
                        }
                    </select>
                </div>
            </div>
        );
    }
}

export default Settings;
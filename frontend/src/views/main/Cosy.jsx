import React, { Component } from 'react';
import axios from 'axios';

export class Cosy extends Component {
    state = {
        naCodes: [],
        naCodesShow: [],
        currentSelectedNaCode: null
    }
    componentDidMount(){
        this.loadNACodes();
    }
    loadNACodes = async () => {
        const url = 'http://localhost:8895/api/v1/get/nacodes';
        try {
            const res = await axios.get(url);
            if (res.status === 200) {
                this.setState({
                    naCodes: res.data.data,
                    naCodesShow: res.data.data
                })
            } else {
                console.log('Error: ', res.status);
            }
        } catch (error) {
            console.log(error);
        }
    }
    selectNACode = (e) => {
        const naCode = e.target.dataset.na;
        this.setState({
            currentSelectedNaCode: naCode,
            naCodesShow: this.state.naCodes.filter(elem => elem.code === naCode)
        })
    }
    closeNACODEsearch = (e) => {
        console.log(e.target.checked);
        e.target.checked = false;
        this.setState({
            currentSelectedNaCode: null,
            naCodesShow: this.state.naCodes
        })
    }
    render() {
        return (
            <div style={{overflowX:"auto"}}>
                <div className="bg-dark rounded-15 w-100 my-2" style={{height: "180px"}}>
                    <div className="px-3">
                        <label htmlFor="searchBaronModelCodes" className="my-2">Search model</label>
                        <input className="form-control bg-dark-light" style={{width: "400px"}} name="searchCosyNaCode" type="text" placeholder="Search" aria-label="Search Tab"/>
                    </div>
                    <div className="position-relative" style={{overflowX: "auto"}}>
                        <div className="p-3" style={{overflowX: "auto",width:"max-content"}}>
                            {
                                this.state.naCodesShow.map((elem, index) => {
                                    return (
                                        <div key={`modelCodeCosy-${elem.code}`} className="d-inline-block me-2 position-relative">
                                            {this.state.currentSelectedNaCode ? <button className="btn btn-primary no-shadow btn-xs position-absolute top-0 end-0" onClick={this.closeNACODEsearch} style={{width:"20px", height:"20px"}}> X </button> : null}
                                            <input type="radio" className="btn-check" name="modelCodesSearch-option" id={`modelCodesSearch-option-${elem.code}`} data-na={elem.code} onChange={this.selectNACode} checked={this.state.currentSelectedNaCode ? true : false }/>
                                            <label className="btn btn-outline-primary text-center h-100" htmlFor={`modelCodesSearch-option-${elem.code}`} style={{width:"120px",minHeight:'63px'}}>
                                                <b>{elem.code}</b>
                                                <small className="mb-0 d-block">{elem.name}</small>
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Cosy;

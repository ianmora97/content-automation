import React, { Component } from 'react';
import axios from 'axios';

export class Cosy extends Component {
    state = {
        naCodes: [],
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
                })
            } else {
                console.log('Error: ', res.status);
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div style={{overflowX:"auto"}}>
                <div className="bg-dark rounded-15 w-100 my-2" style={{height: "180px", overflow: "auto"}}>
                    <div className="px-3">
                        <label htmlFor="searchBaronModelCodes" className="my-2">Search model</label>
                        <input className="form-control bg-dark-light" style={{width: "400px"}} name="searchCosyNaCode" type="text" placeholder="Search" aria-label="Search Tab"/>
                    </div>
                    <div className="position-relative">
                        <div className="p-3" style={{overflowX: "auto",width:"90%"}}>
                            {
                                this.state.naCodes.map((elem, index) => {
                                    return (
                                        <div key={`modelCodeCosy-${elem.code}`} className="d-inline">
                                            <input type="radio" class="btn-check" name="modelCodesSearch-option" id={`modelCodesSearch-option-${elem.code}`} autocomplete="off" />
                                            <label className="btn btn-outline-primary text-center h-100" onClick={this.getPathFromNaCode} htmlFor={`modelCodesSearch-option-${elem.code}`} style={{width:"120px", height:"63px"}}>
                                                <b>${elem.code}</b>
                                                <small className="mb-0 d-block">${elem.name}</small>
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

import React, { Component } from 'react';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCopy, faSquare } from '@fortawesome/free-solid-svg-icons';
import Clipboard from 'react-clipboard.js';
import { intersectionBy } from 'loadash';


import rim from '../../img/rim.png';
export class Cosy extends Component {
    domain = "https://cache.bmwusa.com/cosy.arox?";
    state = {
        naCodes: [],
        naCodesShow: [],
        currentSelectedNaCode: null,
        searchBar: "",
        isLoading: true,
        nacodeSelected: {
            colors: [],
            fabrics: [],
            wheels: [],
            path: "",
            g_addParams: "",
            g_angle: "",
            g_fotoType: "",
            g_bg: "",
            g_color: "",
            g_fabric: "",
            g_wheel: "",
        }
    }
    componentDidMount(){
        this.loadNACodes();
    }
    handdleSearch = async e => {
        const { value } = e.target;
        await this.setState({
            searchBar: value,
            naCodesShow: this.state.naCodes.filter(elem => {
                return elem.code.toLowerCase().includes(value.toLowerCase()) || elem.name.toLowerCase().includes(value.toLowerCase())
            })
        })
    }
    loadNACodes = async () => {
        const url = 'http://localhost:8895/api/v1/get/nacodes';
        try {
            const res = await axios.get(url);
            if (res.status === 200) {
                this.setState({
                    naCodes: res.data.data,
                    naCodesShow: res.data.data,
                    isLoading: false
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
    getCosyOptions = async () => {
        const { currentSelectedNaCode } = this.state;
        const url = 'http://localhost:8895/api/v1/get/cosy/info';
        const data = { nacode: currentSelectedNaCode }
        try {
            const res = await axios.get(url,data);
            if (res.status === 200) {
                let colors = res.data.data.options.filter(obj => obj.isPaint);
                let fabrics = res.data.data.options.filter(obj => obj.isUpholstery);
                let wheels = res.data.data.options.filter(obj => obj.isWheel);
                let c_t = {};
                let cur_config = res.data.data.start.configuration.selectedOptions;
                let ej = intersectionBy(wheels, cur_config, 'code')
                if(ej.length > 0){
                    c_t = {
                        code: ej[0].code,
                        name: ej[0].name,
                    }
                }else{
                    c_t = {code:"",name:""}
                }
                let walk360 = res.data.data.start.configuration.walkaround360DegViewUrlPart;
                let paintName = walk360.split('&paint=')[1].split('&')[0];
                let upholName = walk360.split('&fabric=')[1].split('&')[0];
                let paint = colors.filter(obj => {return obj.code === paintName;});
                let uphol = fabrics.filter(obj => {return obj.code === upholName;});
                this.setState({
                    nacodeSelected: {
                        colors: colors,
                        fabrics: fabrics,
                        wheels: wheels,
                        g_wheel: c_t.code,
                        g_color: paint[0].code,
                        g_fabric: uphol[0].code,

                    }
                })
            } else {
                console.log('Error: ', res.status);
            }
        }catch (error) {
            console.log(error);
        }
    }
    changeBackgroundColor = (e) => {

    }
    changeCosyType = (e) => {

    }
    render() {
        return (
            <div style={{overflowX:"auto"}}>
                <div className="bg-dark rounded-15 w-100 my-2" style={{height: "180px"}}>
                    <div className="px-3">
                        <label htmlFor="searchBaronModelCodes" className="my-2">Search model</label>
                        <input className="form-control bg-dark-light" style={{width: "400px"}} name="searchBar" 
                        onChange={this.handdleSearch} type="text" placeholder="Search" aria-label="Search Tab"/>
                    </div>
                    <div className="position-relative" style={{overflowX: "auto"}}>
                        <div className="p-3" style={{overflowX: "auto",width:"max-content", margin:"0 auto"}}>
                            {
                                this.state.isLoading ?
                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                        <div className="spinner-border text-white spinner-border-sm me-2" role="status"></div>
                                        <span>Loading...</span>
                                    </div>
                                :
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
                <div className="row mx-auto mt-3 align-items-stretch">
                    <div className="col-7 ps-0 d-flex flex-column">
                        <div className="bg-dark rounded-15 w-100 p-3">
                            <small className="d-block small">Color: 
                                <span className="fw-bold text-secondary mx-1" id="colorCosyModel">
                                    {
                                        this.state.currentSelectedNaCode ?
                                        "Color Selected":
                                        <small className="small text-muted text-center m-0">Please Choose a Model</small>
                                    }
                                </span>
                            </small>
                            <small className="d-block small">Upholstery: 
                                <span className="fw-bold text-secondary mx-1" id="upholCosyModel">
                                    {
                                        this.state.currentSelectedNaCode ?
                                        "Color Selected":
                                        <small className="small text-muted text-center m-0">Please Choose a Model</small>
                                    }
                                </span>
                            </small>
                            <small className="d-block small">Trim: 
                                <span className="fw-bold text-secondary mx-1" id="trimCosyModel">
                                    {
                                        this.state.currentSelectedNaCode ?
                                        "Color Selected":
                                        <small className="small text-muted text-center m-0">Please Choose a Model</small>
                                    }
                                </span>
                            </small>
                            <hr/>
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="d-block small">Path:</small>
                                <Tippy content="Copied!" placement="top" animation="shift-away-extreme" trigger="click">
                                    <button type="button" className="btn btn-primary btn-xs shadow-none btn-to-clip" data-clipboard-target="#pathCosyModel" 
                                    id="pathCosyModelBtn">
                                        <FontAwesomeIcon icon={faCopy} className="me-1"/>Copy Path
                                    </button>
                                </Tippy>
                            </div>
                            <small className="d-block small text-primary">
                                <span id="pathCosyModelContainer">
                                    {
                                        this.state.currentSelectedNaCode ?
                                        "Color Selected":
                                        <small className="fw-bold small text-muted text-center m-0">Please Choose a Model</small>
                                    }
                                </span>
                            </small>
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <div className="d-flex justify-content-start">
                                    <Tippy content="Transparent" placement="top" animation="shift-away-extreme">
                                        <div>
                                            <input type="radio" className="btn-check" name="cosy-background" onChange={this.changeBackgroundColor} 
                                            id="trans-cosy-checkbox-outlined" data-bg="t" checked/>
                                            <label className="btn btn-sm btn-outline-primary-cus" htmlFor="trans-cosy-checkbox-outlined">
                                                <FontAwesomeIcon icon={faSquare} />
                                            </label>
                                        </div>
                                    </Tippy>
                                    <Tippy content="White" placement="top" animation="shift-away-extreme">
                                        <div>
                                            <input type="radio" className="btn-check" name="cosy-background" onChange={this.changeBackgroundColor} 
                                            id="white-cosy-checkbox-outlined" data-bg="1" />
                                            <label className="btn btn-sm btn-outline-primary-cus ms-2" htmlFor="white-cosy-checkbox-outlined">
                                                <FontAwesomeIcon icon={faSquare} className="text-white"/>
                                            </label>
                                        </div>
                                    </Tippy>
                                    <Tippy content="Dark" placement="top" animation="shift-away-extreme">
                                        <div>
                                            <input type="radio" className="btn-check" name="cosy-background" onChange={this.changeBackgroundColor} 
                                            id="black-cosy-checkbox-outlined" data-bg="2"/>
                                            <label className="btn btn-sm btn-outline-primary-cus ms-2" htmlFor="black-cosy-checkbox-outlined">
                                                <FontAwesomeIcon icon={faSquare} className="text-dark"/>
                                            </label>
                                        </div>
                                    </Tippy>
                                </div>
                                <select className="form-select form-select-sm bg-dark-light" style={{width: "200px"}} id="cosyTypeModel" onChange={this.changeCosyType}>
                                    <option value="0" defaultValue>Select type</option>
                                    <option value="1">Model Lineup</option>
                                    <option value="2">Localnav</option>
                                    <option value="3">Globalnav</option>
                                    <option value="3">All BMWs</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-dark rounded-15 w-100 p-3 mt-3 flex-fill d-flex justify-content-center align-items-center" id="imagePreview" style={{overflow: "hidden"}}>
                            {
                                this.state.currentSelectedNaCode ?
                                "Color Selected":
                                <small className="fw-bold small text-muted text-center m-0">Please Choose a Model</small>
                            }
                        </div>
                        <div id="imagePreviewCache" className="d-none">
                            {
                                this.state.currentSelectedNaCode
                                
                            }
                        </div>
                    </div>
                    <div className="col-5 pe-0">
                        <div className="bg-dark rounded-15 w-100 p-3" style={{height: "calc(100vh - 345px)", overflowY: "hidden"}}>
                            <h6>Colors:</h6>
                            <hr/>
                            <div>
                                <ul className="nav nav-pills mb-3" id="pills-tab-Cosy" role="tablist">
                                    <li className="nav-item me-3" role="presentation">
                                        <button className="nav-link active" id="pills-color-tab" data-bs-toggle="pill" data-bs-target="#pills-color" 
                                        type="button" role="tab" aria-controls="pills-color" aria-selected="true">
                                            <FontAwesomeIcon icon={faCircle}/> Color
                                        </button>
                                    </li>
                                    <li className="nav-item me-3" role="presentation">
                                        <button className="nav-link" id="pills-upholstery-tab" data-bs-toggle="pill" data-bs-target="#pills-upholstery" 
                                        type="button" role="tab" aria-controls="pills-upholstery" aria-selected="false">
                                            <FontAwesomeIcon icon={faCircle} /> Upholstery
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="pills-trims-tab" data-bs-toggle="pill" data-bs-target="#pills-trims" 
                                        type="button" role="tab" aria-controls="pills-trims" aria-selected="false"><img src={rim} width="20px" height="20px" style={{filter: "invert(1)"}} alt="Wheels"/> Wheels</button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tab-CosyContent">
                                    <div className="tab-pane fade show active" id="pills-color" role="tabpanel" aria-labelledby="pills-color-tab" style={{height: "calc(100vh - 500px)", overflowY: "auto"}}>
                                        <div id="colorsPreview" className="d-flex flex-column">
                                            {
                                                this.state.currentSelectedNaCode ?
                                                "Color Selected":
                                                <p className="small text-muted text-center mt-3">Please Choose a Model</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-upholstery" role="tabpanel" aria-labelledby="pills-upholstery-tab" style={{height: "calc(100vh - 500px)", overflowY: "auto"}}>
                                        <div id="upholsteryPreview" className="d-flex flex-column">
                                            {
                                                this.state.currentSelectedNaCode ?
                                                "Color Selected":
                                                <p className="small text-muted text-center mt-3">Please Choose a Model</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-trims" role="tabpanel" aria-labelledby="pills-trims-tab" style={{height: "calc(100vh - 500px)", overflowY: "auto"}}>
                                        <div id="trimsPreview" className="d-flex flex-column">
                                            {
                                                this.state.currentSelectedNaCode ?
                                                "Color Selected":
                                                <p className="small text-muted text-center mt-3">Please Choose a Model</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Cosy;

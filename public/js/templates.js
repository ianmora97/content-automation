var template_SAV = (model) => {
    return `
    <div class="row animate__animated animate__fadeIn">
        <div class="col-6">
            <h5 class="hl">Engine</h5>
            <p>
                <span class="text-light small">LITERS/TYPE:</span><br> 
                <span class="fw-bold">${model.engine.engineType != undefined ? model.engine.engineType : 'TBA'}</span>
            </p>
            <p> 
                <span class="text-light small">DISPLACEMENT (cc):</span><br> 
                <span class="fw-bold">${model.engine.displacement != undefined ? model.engine.displacement : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">HORSEPOWER (bhp @ rpm):</span><br>
                <span class="fw-bold">${model.engine.engineHorsePower != undefined ? model.engine.engineHorsePower : 'TBA'} @ 
                ${model.engine.engineHorsePowerMinRPM != undefined ? model.engine.engineHorsePowerMinRPM : 'TBA'} -
                ${model.engine.engineHorsePowerMaxRPM != undefined ? model.engine.engineHorsePowerMaxRPM : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">TORQUE (lb-ft @ rpm):</span><br>
                <span class="fw-bold">${model.engine.engineTorque != undefined ? model.engine.engineTorque : 'TBA'} @
                ${model.engine.engineTorqueMinRPM != undefined ? model.engine.engineTorqueMinRPM : 'TBA'} -
                ${model.engine.engineTorqueMaxRPM != undefined ? model.engine.engineTorqueMaxRPM : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">COMPRESSION RATIO (:1):</span><br>
                <span class="fw-bold">${model.engine.compressionRatio != undefined ? model.engine.compressionRatio : 'TBA'}</span>
            </p>
        </div>
        <div class="col-6">
            <h5 class="hl">Transmission</h5>
            <p>
                <span class="text-light small">TYPE:</span><br>
                <span class="fw-bold">${model.transmission.automatic.transmissionType != undefined ? model.transmission.automatic.transmissionType : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - I / II / III:</span><br>
                <span class="fw-bold">${model.transmission.automatic.gearRatioOne != undefined ? model.transmission.automatic.gearRatioOne : 'TBA'} / 
                ${model.transmission.automatic.gearRatioTwo != undefined ? model.transmission.automatic.gearRatioTwo : 'TBA'} /
                ${model.transmission.automatic.gearRatioThree != undefined ? model.transmission.automatic.gearRatioThree : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - IV / V / VI:</span><br>
                <span class="fw-bold">${model.transmission.automatic.gearRatioFour != undefined ? model.transmission.automatic.gearRatioFour : 'TBA'} /
                ${model.transmission.automatic.gearRatioFive != undefined ? model.transmission.automatic.gearRatioFive : 'TBA'} /
                ${model.transmission.automatic.gearRatioSix != undefined ? model.transmission.automatic.gearRatioSix : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - VII / VIII / R:</span><br>
                <span class="fw-bold">${model.transmission.automatic.gearRatioSeven != undefined ? model.transmission.automatic.gearRatioSeven : 'TBA'} /
                ${model.transmission.automatic.gearRatioEight != undefined ? model.transmission.automatic.gearRatioEight : 'TBA'} /
                ${model.transmission.automatic.gearRatioReverse != undefined ? model.transmission.automatic.gearRatioReverse : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - FINAL DRIVE RATIO:</span><br>
                <span class="fw-bold">${model.transmission.automatic.finalDriveRatio != undefined ? model.transmission.automatic.finalDriveRatio : 'TBA'}</span>
            </p>
        </div>
    </div>
    <hr class="my-5">
    <div class="row animate__animated animate__fadeIn">
        <div class="col-4">
            <h5 class="hl">Performance</h5>
            <p>
                <span class="text-light small">ACCELERATION 0 - 60 mph AUTOMATIC (sec):</span><br>
                <span class="fw-bold">${model.performance.acceleration != undefined ? model.performance.acceleration : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">TOP SPEED (mph):</span><br>
                <span class="fw-bold">${model.performance.topSpeedOne != undefined ? model.performance.topSpeedOne : 'TBA'} 
                ${model.performance.topSpeedTwo != undefined ? '['+model.performance.topSpeedTwo+']' : ''}</span>
            </p>
        </div>
        <div class="col-4">
            <h5 class="hl">Fuel Consumption</h5>
            <p>
                <span class="text-light small">AUTOMATIC COMBINED (mpg):</span><br>
                <span class="fw-bold">${model.fuelConsumption.mpgCombined != undefined ? model.fuelConsumption.mpgCombined : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC CITY / HIGHWAY (mpg):</span><br>
                <span class="fw-bold">${model.fuelConsumption.mpgCity != undefined ? model.fuelConsumption.mpgCity : 'TBA'} /
                ${model.fuelConsumption.mpgHighway != undefined ? model.fuelConsumption.mpgHighway : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">FUEL TANK CAPACITY (gallons):</span><br>
                <span class="fw-bold">${model.fuelConsumption.tankCapacity != undefined ? model.fuelConsumption.tankCapacity : 'TBA'}</span>
            </p>
        </div>
        <div class="col-4">
            <h5 class="hl">Wheels & Tires</h5>
            <p>
                <span class="text-light small">TIRE / TYPE:</span><br>
                <span class="fw-bold">${model.wheelsAndTires.tireType != undefined ? model.wheelsAndTires.tireType : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">WHEEL DIMENSIONS (in):</span><br>
                <span class="fw-bold">${model.wheelsAndTires.wheelDimensionsFront != undefined ? model.wheelsAndTires.wheelDimensionsFront+' front' : 'TBA'}
                | ${model.wheelsAndTires.wheelDimensionsRear != undefined ? model.wheelsAndTires.wheelDimensionsRear+' rear' : 'TBA'}
                </span>
            </p>
            <p>
                <span class="text-light small">TIRE DIMENSIONS (mm):</span><br>
                <span class="fw-bold">${model.wheelsAndTires.tireDimensionsFront != undefined ? model.wheelsAndTires.tireDimensionsFront+' front' : 'TBA'}
                | ${model.wheelsAndTires.tireDimensionsRear != undefined ? model.wheelsAndTires.tireDimensionsRear+' rear' : 'TBA'}
                </span>
            </p>
        </div>
    </div>
    <hr class="my-5">
    <div class="row animate__animated animate__fadeIn">
        <div class="col-6">
            <h5 class="hl">Exterior Dimensions</h5>
            <p>
                <span class="text-light small">LENGTH / WIDTH / HEIGHT (in):</span><br>
                <span class="fw-bold">${model.exterior.length != undefined ? model.exterior.length : 'TBA'} / 
                ${model.exterior.width != undefined ? model.exterior.width : 'TBA'} / 
                ${model.exterior.height != undefined ? model.exterior.height : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">CURB WEIGHT - AUTOMATIC TRANSMISSION (lbs):</span><br>
                <span class="fw-bold">${model.exterior.curbWeight != undefined ? model.exterior.curbWeight : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">WEIGHT DISTRIBUTION, FRONT/REAR - AUTOMATIC TRANSMISSION (%):</span><br>
                <span class="fw-bold">${model.exterior.weightDistributionFront != undefined ? model.exterior.weightDistributionFront : 'TBA'} /
                ${model.exterior.weightDistributionRear != undefined ? model.exterior.weightDistributionRear : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">PAYLOAD (lbs):</span><br>
                <span class="fw-bold">${model.exterior.payload != undefined ? model.exterior.payload : 'TBA'}</span>
            </p>
        </div>
        <div class="col-6">
            <h5 class="hl">Interior Dimensions</h5>
            <p>
                <span class="text-light small">HEADROOM:</span><br>
                <span class="fw-bold">${model.interior.headroomFront != undefined ? model.interior.headroomFront : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">LEGROOM, FRONT/REAR (in):</span><br>
                <span class="fw-bold">${model.interior.legroomFront != undefined ? model.interior.legroomFront : 'TBA'} /
                ${model.interior.legroomRear != undefined ? model.interior.legroomRear : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">SHOULDER ROOM, FRONT/REAR (in):</span><br>
                <span class="fw-bold">${model.interior.shoulderRoomFront != undefined ? model.interior.shoulderRoomFront : 'TBA'} /
                ${model.interior.shoulderRoomRear != undefined ? model.interior.shoulderRoomRear : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">CARGO CAPACITY (cu ft):</span><br>
                <span class="fw-bold">${model.interior.cargoCapacity != undefined ? model.interior.cargoCapacity : 'TBA'}</span>
            </p>
        </div>
    </div>
    `
}

var template_SEDAN = (model) => {
    return `
    <div class="row mx-0 animate__animated animate__fadeIn">
        <div class="col-6">
            <h5 class="hl">Engine</h5>
            <p>
                <span class="text-light small">LITERS/TYPE:</span><br> 
                <span class="fw-bold">${model.engine.engineType != undefined ? model.engine.engineType : 'TBA'}</span>
            </p>
            <p> 
                <span class="text-light small">DISPLACEMENT (cc):</span><br> 
                <span class="fw-bold">${model.engine.displacement != undefined ? model.engine.displacement : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">HORSEPOWER (bhp @ rpm):</span><br>
                <span class="fw-bold">${model.engine.engineHorsePower != undefined ? model.engine.engineHorsePower : 'TBA'} @ 
                ${model.engine.engineHorsePowerMinRPM != undefined ? model.engine.engineHorsePowerMinRPM : 'TBA'} -
                ${model.engine.engineHorsePowerMaxRPM != undefined ? model.engine.engineHorsePowerMaxRPM : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">TORQUE (lb-ft @ rpm):</span><br>
                <span class="fw-bold">${model.engine.engineTorque != undefined ? model.engine.engineTorque : 'TBA'} @
                ${model.engine.engineTorqueMinRPM != undefined ? model.engine.engineTorqueMinRPM : 'TBA'} -
                ${model.engine.engineTorqueMaxRPM != undefined ? model.engine.engineTorqueMaxRPM : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">COMPRESSION RATIO (:1):</span><br>
                <span class="fw-bold">${model.engine.compressionRatio != undefined ? model.engine.compressionRatio : 'TBA'}</span>
            </p>
        </div>
        <div class="col-6">
            <h5 class="hl">Transmission</h5>
            <p>
                <span class="text-light small">TYPE:</span><br>
                <span class="fw-bold">${model.transmission.automatic.transmissionType != undefined ? model.transmission.automatic.transmissionType : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - I / II / III:</span><br>
                <span class="fw-bold">${model.transmission.automatic.gearRatioOne != undefined ? model.transmission.automatic.gearRatioOne : 'TBA'} / 
                ${model.transmission.automatic.gearRatioTwo != undefined ? model.transmission.automatic.gearRatioTwo : 'TBA'} /
                ${model.transmission.automatic.gearRatioThree != undefined ? model.transmission.automatic.gearRatioThree : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - IV / V / VI:</span><br>
                <span class="fw-bold">${model.transmission.automatic.gearRatioFour != undefined ? model.transmission.automatic.gearRatioFour : 'TBA'} /
                ${model.transmission.automatic.gearRatioFive != undefined ? model.transmission.automatic.gearRatioFive : 'TBA'} /
                ${model.transmission.automatic.gearRatioSix != undefined ? model.transmission.automatic.gearRatioSix : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - VII / VIII / R:</span><br>
                <span class="fw-bold">${model.transmission.automatic.gearRatioSeven != undefined ? model.transmission.automatic.gearRatioSeven : 'TBA'} /
                ${model.transmission.automatic.gearRatioEight != undefined ? model.transmission.automatic.gearRatioEight : 'TBA'} /
                ${model.transmission.automatic.gearRatioReverse != undefined ? model.transmission.automatic.gearRatioReverse : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC GEAR RATIOS - FINAL DRIVE RATIO:</span><br>
                <span class="fw-bold">${model.transmission.automatic.finalDriveRatio != undefined ? model.transmission.automatic.finalDriveRatio : 'TBA'}</span>
            </p>
        </div>
    </div>
    <hr class="my-5">
    <div class="row animate__animated animate__fadeIn">
        <div class="col-4">
            <h5 class="hl">Performance</h5>
            <p>
                <span class="text-light small">ACCELERATION 0 - 60 mph AUTOMATIC (sec):</span><br>
                <span class="fw-bold">${model.performance.acceleration != undefined ? model.performance.acceleration : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">TOP SPEED (mph):</span><br>
                <span class="fw-bold">${model.performance.topSpeedOne != undefined ? model.performance.topSpeedOne : 'TBA'} 
                ${model.performance.topSpeedTwo != undefined ? '['+model.performance.topSpeedTwo+']' : ''}</span>
            </p>
        </div>
        <div class="col-4">
            <h5 class="hl">Fuel Consumption</h5>
            <p>
                <span class="text-light small">AUTOMATIC COMBINED (mpg):</span><br>
                <span class="fw-bold">${model.fuelConsumption.mpgCombined != undefined ? model.fuelConsumption.mpgCombined : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">AUTOMATIC CITY / HIGHWAY (mpg):</span><br>
                <span class="fw-bold">${model.fuelConsumption.mpgCity != undefined ? model.fuelConsumption.mpgCity : 'TBA'} /
                ${model.fuelConsumption.mpgHighway != undefined ? model.fuelConsumption.mpgHighway : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">FUEL TANK CAPACITY (gallons):</span><br>
                <span class="fw-bold">${model.fuelConsumption.tankCapacity != undefined ? model.fuelConsumption.tankCapacity : 'TBA'}</span>
            </p>
        </div>
        <div class="col-4">
            <h5 class="hl">Wheels & Tires</h5>
            <p>
                <span class="text-light small">TIRE / TYPE:</span><br>
                <span class="fw-bold">${model.wheelsAndTires.tireType != undefined ? model.wheelsAndTires.tireType : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">WHEEL DIMENSIONS (in):</span><br>
                <span class="fw-bold">${model.wheelsAndTires.wheelDimensionsFront != undefined ? model.wheelsAndTires.wheelDimensionsFront+' front' : 'TBA'}
                | ${model.wheelsAndTires.wheelDimensionsRear != undefined ? model.wheelsAndTires.wheelDimensionsRear+' rear' : 'TBA'}
                </span>
            </p>
            <p>
                <span class="text-light small">TIRE DIMENSIONS (mm):</span><br>
                <span class="fw-bold">${model.wheelsAndTires.tireDimensionsFront != undefined ? model.wheelsAndTires.tireDimensionsFront+' front' : 'TBA'}
                | ${model.wheelsAndTires.tireDimensionsRear != undefined ? model.wheelsAndTires.tireDimensionsRear+' rear' : 'TBA'}
                </span>
            </p>
        </div>
    </div>
    <hr class="my-5">
    <div class="row animate__animated animate__fadeIn">
        <div class="col-6">
            <h5 class="hl">Exterior Dimensions</h5>
            <p>
                <span class="text-light small">LENGTH / WIDTH / HEIGHT (in):</span><br>
                <span class="fw-bold">${model.exterior.length != undefined ? model.exterior.length : 'TBA'} / 
                ${model.exterior.width != undefined ? model.exterior.width : 'TBA'} / 
                ${model.exterior.height != undefined ? model.exterior.height : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">CURB WEIGHT - AUTOMATIC TRANSMISSION (lbs):</span><br>
                <span class="fw-bold">${model.exterior.curbWeight != undefined ? model.exterior.curbWeight : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">WEIGHT DISTRIBUTION, FRONT/REAR - AUTOMATIC TRANSMISSION (%):</span><br>
                <span class="fw-bold">${model.exterior.weightDistributionFront != undefined ? model.exterior.weightDistributionFront : 'TBA'} /
                ${model.exterior.weightDistributionRear != undefined ? model.exterior.weightDistributionRear : 'TBA'}</span>
            </p>
        </div>
        <div class="col-6">
            <h5 class="hl">Interior Dimensions</h5>
            <p>
                <span class="text-light small">HEADROOM:</span><br>
                <span class="fw-bold">${model.interior.headroomFront != undefined ? model.interior.headroomFront : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">LEGROOM, FRONT/REAR (in):</span><br>
                <span class="fw-bold">${model.interior.legroomFront != undefined ? model.interior.legroomFront : 'TBA'} /
                ${model.interior.legroomRear != undefined ? model.interior.legroomRear : 'TBA'}</span>
            </p>
            <p>
                <span class="text-light small">SHOULDER ROOM, FRONT/REAR (in):</span><br>
                <span class="fw-bold">${model.interior.shoulderRoomFront != undefined ? model.interior.shoulderRoomFront : 'TBA'} /
                ${model.interior.shoulderRoomRear != undefined ? model.interior.shoulderRoomRear : 'TBA'}</span>
            </p>
        </div>
    </div>
    `
}

var template_standardFeatures = (model) => {
    console.log(model)
    return `
    <div class="row justify-content-center mx-0 animate__animated animate__fadeIn">
        <div class="col-7">
            <div class="accordion" id="accordionExample">
                <div class="accordion-item text-light border-bottom border-dark-light">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            <div class="position-absolute" style="top:0.7rem;left:-200px;">
                                <h5 class="fw-light text-light">01 Driver</h4>
                            </div>
                            <div>
                                <span class="hl d-block small mb-2">01.1</span>
                                <h4 class="mb-2"><b><u>${model["Performance and efficiency"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Engine, transmission, and aerodynamic features.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Performance and efficiency"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                    `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item text-light border-bottom border-dark-light">
                    <h2 class="accordion-header" id="headingTwo">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <div>
                                <span class="hl d-block small mb-2">01.2</span>
                                <h4 class="mb-2"><b><u>${model["Handling, ride and braking"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Ensuring a smooth, safe, comfortable drive.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Handling, ride and braking"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="accordion-item text-light border-bottom border-dark-light mt-4">
                    <h2 class="accordion-header" id="headingThree">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            <div class="position-absolute" style="top:0.7rem;left:-200px;">
                                <h5 class="fw-light text-light">02 Appearance</h4>
                            </div>
                            <div>
                                <span class="hl d-block small mb-2">02.1</span>
                                <h4 class="mb-2"><b><u>${model["Exterior"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Paint, accents, and lights.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Exterior"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item text-light border-bottom border-dark-light">
                    <h2 class="accordion-header" id="headingFour">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                            <div>
                                <span class="hl d-block small mb-2">02.2</span>
                                <h4 class="mb-2"><b><u>${model["Interior trim"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Upholstery and trim.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Interior trim"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="accordion-item text-light border-bottom border-dark-light mt-4">
                    <h2 class="accordion-header" id="headingFive">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                            <div class="position-absolute" style="top:0.7rem;left:-200px;">
                                <h5 class="fw-light text-light">03 Technology</h4>
                            </div>
                            <div>
                                <span class="hl d-block small mb-2">03.1</span>
                                <h4 class="mb-2"><b><u>${model["Connectivity"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Wireless features, remote services, and intuitive technology.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Connectivity"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item text-light border-bottom border-dark-light">
                    <h2 class="accordion-header" id="headingSix">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                            <div>
                                <span class="hl d-block small mb-2">03.2</span>
                                <h4 class="mb-2"><b><u>${model["Audio system"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Systems, speakers and more.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Audio system"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item text-light border-bottom border-dark-light">
                    <h2 class="accordion-header" id="headingSeven">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                            <div>
                                <span class="hl d-block small mb-2">03.3</span>
                                <h4 class="mb-2"><b><u>${model["Instrumentation and controls"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Advanced features for a smarter drive.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseSeven" class="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Instrumentation and controls"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item text-light border-bottom border-dark-light">
                    <h2 class="accordion-header" id="headingEight">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                            <div>
                                <span class="hl d-block small mb-2">03.4</span>
                                <h4 class="mb-2"><b><u>${model["Comfort and convenience"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Comfort and Convenience Luxury features for a pleasant ride.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseEight" class="accordion-collapse collapse" aria-labelledby="headingEight" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Comfort and convenience"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="accordion-item text-light border-bottom border-dark-light mt-4">
                    <h2 class="accordion-header" id="headingNine">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
                            <div class="position-absolute" style="top:0.7rem;left:-200px;">
                                <h5 class="fw-light text-light">04 Protection</h4>
                            </div>
                            <div>
                                <span class="hl d-block small mb-2">04.1</span>
                                <h4 class="mb-2"><b><u>${model["Safety and security"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Protecting you and your vehicle, on the road and off.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseNine" class="accordion-collapse collapse" aria-labelledby="headingNine" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Safety and security"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item text-light border-bottom border-dark-light">
                    <h2 class="accordion-header" id="headingTen">
                        <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
                            <div>
                                <span class="hl d-block small mb-2">04.2</span>
                                <h4 class="mb-2"><b><u>${model["Warranty"].categoryName}</u></b></h4>
                                <p class="fw-light text-light">Complete coverage and peace of mind.</p>
                            </div>
                        </button>
                    </h2>
                    <div id="collapseTen" class="accordion-collapse collapse" aria-labelledby="headingTen" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="row">
                                ${model["Warranty"].features.map(feature => {
                                    return `
                                    <div class="col-6 mb-2">
                                        <span class="d-block small">${feature}</span>
                                        <hr>
                                    </div>
                                `}).join('')}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `
}
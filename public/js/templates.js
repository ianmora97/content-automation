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
    sedan
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
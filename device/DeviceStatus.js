

class IGHouseDevice{
    constructor(deviceName) {
        this.deviceName = deviceName;

        this.humidityThreshold = 0.0;
        this.soilMoistureThreshold = 0.0;
        this.lightThreshold = 0.0;

        this.temperature = 0.0;
        this.humidity = 0.0;
        this.soilMoisture = 0.0;
        this.light = 0.0;
        this.waterLevel = 0.0;
    }
}

module.exports = IGHouseDevice
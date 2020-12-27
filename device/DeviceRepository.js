const IGHouseDevice = require("./DeviceStatus.js");

class DeviceRepository{
    constructor() {
        this.deviceList = new Map();
    }

    addNewDevice(deviceName) {
        this.deviceList.set(deviceName, new IGHouseDevice(deviceName));
    }

    findDevice(deviceName) {
        return this.deviceList(deviceName);
    }
}

module.exports = DeviceRepository
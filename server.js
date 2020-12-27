const express = require('express')
const socketIO = require('socket.io')
const DeviceRepository = require("./device/DeviceRepository.js");
const IGHouseDevice = require("./device/DeviceStatus.js");

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const app = express();

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

deviceMap = new DeviceRepository();

io.on("connection", function (socket) {
    console.log("Made socket connection");
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on("sensor_data", (deviceName, lightLatency, humidity, temperature, soilMoisture, waterLevel) => {
    console.log(`Recieved sensor data: [ Light: ${lightLatency}, humidity: ${humidity}, temperature: ${temperature}, water level: ${waterLevel}, soil moisture: ${soilMoisture} ]`);
    let device = deviceMap.findDevice(deviceName)
    if (device != null)
    {
        device.second.temperature = temperature;
        device.second.humidity = humidity;
        device.second.soilMoisture = soilMoisture;
        device.second.waterLevel = waterLevel;
        device.second.light = lightLatency;
    }
    else
    {
        let newDevice = new IGHouseDevice(deviceName);
        newDevice.temperature = temperature;
        newDevice.humidity = humidity;
        newDevice.soilMoisture = soilMoisture;
        newDevice.waterLevel = waterLevel;
        newDevice.light = lightLatency;
        deviceMap.set(deviceName, newDevice);
    }
});

io.on("get_sensor_data", (deviceName) =>{
    console.log(`Received request for sensor data statuses of device: ${deviceName}`);

    device = deviceMap.findDevice(deviceName)
    if (device != null) {
        io.emit("sensor_data", deviceName, device.second.light, device.second.humidity, device.second.temperature,
                device.second.soilMoisture, device.second.waterLevel)
    }
    else{
        io.emit("no_device_found", deviceName)
    }
    }
)

io.on("threshold_status", (deviceName, soilMoistureThreshold, humidityThreshold, lightThreshold) => {
    console.log(`Recived threshold statuses: [ Soil moisture: ${soilMoistureThreshold}, humidity: ${humidityThreshold}, light: ${lightThreshold} ]`);
    device = deviceMap.findDevice(deviceName)
    if (device != null)
    {
        device.second.humidityThreshold = humidityThreshold;
        device.second.soilMoistureThreshold = soilMoistureThreshold;
        device.second.lightThreshold = lightThreshold;
    }
    else
    {
        let newDevice = new IGHouseDevice(deviceName);
        newDevice.humidityThreshold = humidityThreshold;
        newDevice.soilMoistureThreshold = soilMoistureThreshold;
        newDevice.lightThreshold = lightThreshold;
        deviceMap.set(deviceName, newDevice);
    }
});

io.on("get_threshold_statuses", (deviceName) => {
    console.log(`Recived request for threshold statuses of device: ${deviceName}`);
    io.emit("threshold_status", deviceName, soilMoistureThreshold, humidityThreshold, lightThreshold);
    device = deviceMap.findDevice(deviceName)
    if (device != null)
    {
        io.emit("threshold_status", deviceName, device.second.soilMoistureThreshold, device.second.humidityThreshold,
                device.second.lightThreshold);
    }
    else
    {
        io.emit("no_device_found", deviceName);
    }
});

io.on("set_new_thresholds", (deviceName, newSoilMoistureThreshold, newHumidityThreshold, newLightThreshold) =>{
    console.log(`Recived request for change thresholds for device: ${deviceName}`);
    console.log(`new values ${soilMoistureThreshold}, ${humidityThreshold}, ${lightThreshold}`);
    device = deviceMap.findDevice(deviceName)
    if (device != null)
    {
        device.second.humidityThreshold = newHumidityThreshold;
        device.second.soilMoistureThreshold = newSoilMoistureThreshold;
        device.second.lightThreshold = newLightThreshold;
    }
    else
    {
        io.emit("no_device_found", deviceName);
    }
});


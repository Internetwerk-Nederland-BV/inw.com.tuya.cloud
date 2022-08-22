'use strict';

const TuyaBaseDriver = require('../tuyabasedriver');

class TuyaSmokeDriver extends TuyaBaseDriver {

    onInit() {
        this.log('Tuya smokesensor driver has been initialized');
    }

    async onPairListDevices() {
        let devices = [];
        if (!this.homey.app.isConnected()) {
            throw new Error("Please configure the app first.");
        }
        else {
            let covers = this.get_devices_by_type("smokeSensor");
            for (let tuyaDevice of Object.values(covers)) {
                let capabilities = [];
                capabilities.push("alarm_smoke");
                capabilities.push("measure_battery");
                capabilities.push("alarm_battery");
                devices.push({
                    data: {
                        id: tuyaDevice.id
                    },
                    capabilities: capabilities,
                    name: tuyaDevice.name
                });

            }
        }
        return devices.sort(TuyaBaseDriver._compareHomeyDevice);
    }
}

module.exports = TuyaSmokeDriver;
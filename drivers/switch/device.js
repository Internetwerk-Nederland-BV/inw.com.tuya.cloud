'use strict';

const BaseDevice = require('../basedevice');

const CAPABILITIES_SET_DEBOUNCE = 1000;

class SwitchDevice extends BaseDevice {

    async onInit() {
        await this.initDevice(this.getData().id);
        this.updateCapabilities();
        this.registerMultipleCapabilityListener(this.getCapabilities(), async (values, options) => { return this._onMultipleCapabilityListener(values, options); }, CAPABILITIES_SET_DEBOUNCE);
        this.log(`Tuya switch ${this.getName()} has been initialized`);
        var options = { excerpt: `The driver for ${this.getName()} is deprecated, please switch to new driver. See community forum for details.` }
        await this.homey.notifications.createNotification(options);
    }

    updateCapabilities() {
        if (this.data != null && this.data.online) {
            this.setAvailable()
                .catch(this.error);
        }
        else {
            this.setUnavailable("(temporary) unavailable")
                .catch(this.error);
            return;
        }

        if (this.hasCapability("onoff")) {
            this.setCapabilityValue("onoff", this.getState())
                .catch(this.error);
        }
    }

    async _onMultipleCapabilityListener(valueObj, optsObj) {
        console.log("Capabilities changed by Homey: " + JSON.stringify(valueObj));
        this.updateInprogess = true;
        try {
            if (valueObj.onoff != null) {
                if (valueObj.onoff === true || valueObj.onoff === 1) {
                    await this.turn_on();
                } else {
                    await this.turn_off();
                }
            }
        } catch (ex) {
            this.homey.error(ex);
            this.updateInprogess = false;
        }
    }
}

module.exports = SwitchDevice;
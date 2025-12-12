
var exec = require("cordova/exec");
const SpeechSynthesisEngineList = require("./SpeechSynthesisEngineList");
const SpeechSynthesisEngine = require("./SpeechSynthesisEngine");
var SpeechSynthesisVoiceList = require("./SpeechSynthesisVoiceList");

var SpeechSynthesis = function () {
    this.pending = false;
    this.speaking = false;
    this.paused = false;
    this._voices = null;
    this._defaultEngine = null;
    this._engines = null;
    this.onvoiceschanged = null;
    this._voicesChangedListeners = [];
    var that = this;
    var successCallback = function (data) {
        try {
            that._voices = new SpeechSynthesisVoiceList(data);

            setTimeout(function () {
                that._fireVoicesChangedEvent();
            }, 0); // Async to allow proper initialization
        } catch (error) {
            console.error("Error initializing voices:", error);
            that._voices = new SpeechSynthesisVoiceList([]);
        }

        // get all engines
        var successEnginesCallback = function (enginesData) {
            that._engines = new SpeechSynthesisEngineList(enginesData);
        };
        exec(successEnginesCallback, null, "SpeechSynthesis", "getEngines", []);

        // get the default engine
        var successDefaultEngineCallback = function (engineData) {
            that._defaultEngine = new SpeechSynthesisEngine(engineData);
        };
		exec(successDefaultEngineCallback, null, "SpeechSynthesis", "getDefaultEngine", []);
    };

    exec(successCallback, null, "SpeechSynthesis", "startup", []);
};

SpeechSynthesis.prototype.speak = function (utterance) {
	var successCallback = function (event) {
		if (event.type === "start" && typeof utterance.onstart === "function") {
			utterance.onstart(event);
		} else if (event.type === "end" && typeof utterance.onend === "function") {
			utterance.onend(event);
		} else if (event.type === "pause" && typeof utterance.onpause === "function") {
			utterance.onpause(event);
		} else if (event.type === "resume" && typeof utterance.onresume === "function") {
			utterance.onresume(event);
		} else if (event.type === "mark" && typeof utterance.onmark === "function") {
			utterance.onmark(event);
		} else if (event.type === "boundry" && typeof utterance.onboundry === "function") {
			utterance.onboundry(event);
		}
	};
	var errorCallback = function () {
		if (typeof utterance.onerror === "function") {
			utterance.onerror();
		}
	};

	exec(successCallback, errorCallback, "SpeechSynthesis", "speak", [utterance]);
};

SpeechSynthesis.prototype.cancel = function () {
	exec(null, null, "SpeechSynthesis", "cancel", []);
};

SpeechSynthesis.prototype.pause = function () {
	exec(null, null, "SpeechSynthesis", "pause", []);
};

SpeechSynthesis.prototype.resume = function () {
	exec(null, null, "SpeechSynthesis", "resume", []);
};

SpeechSynthesis.prototype.getEngines = function () {
	return this._engines;
};

SpeechSynthesis.prototype.getDefaultEngine = function () {
	return this._defaultEngine;
};

SpeechSynthesis.prototype.getVoices = function () {
	return this._voices || new SpeechSynthesisVoiceList([]);
};

SpeechSynthesis.prototype.setEngine = function (engineName, onReady) {
    var that = this;
    var setEngineSuccessCallback = function (data) {
        that._voices = new SpeechSynthesisVoiceList(data);
        that._fireVoicesChangedEvent();

        if (typeof onReady === "function") {
            onReady(data);
        }
    };
    exec(setEngineSuccessCallback, null, "SpeechSynthesis", "setEngine", [engineName]);
};

SpeechSynthesis.prototype.addEventListener = function (type, listener) {
    if (type === "voiceschanged" && typeof listener === "function") {
        this._voicesChangedListeners.push(listener);
    }
};

SpeechSynthesis.prototype.removeEventListener = function (type, listener) {
    if (type === "voiceschanged") {
        var index = this._voicesChangedListeners.indexOf(listener);
        if (index > -1) {
            this._voicesChangedListeners.splice(index, 1);
        }
    }
};

SpeechSynthesis.prototype._fireVoicesChangedEvent = function () {
    if (typeof this.onvoiceschanged === "function") {
        this.onvoiceschanged();
    }

    this._voicesChangedListeners.forEach(function (listener) {
        try {
            listener();
        } catch (e) {
            console.error("Error in voiceschanged listener:", e);
        }
    });
};

module.exports = new SpeechSynthesis();

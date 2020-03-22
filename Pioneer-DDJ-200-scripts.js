var DDJ200 = {};

// Every -MSB control is 100 + -LSB
var Ctrl = {
    pad1: 0,
    pad2: 1,
    pad3: 2,
    pad4: 3,
    pad5: 4,
    pad6: 5,
    pad7: 6,
    pad8: 7,
    play: 8,
    cue: 9,
    shift: 10,
    sync: 11,
    headphone: 12,
    jogWheelTouch: 13,
    jogWheelTurn: 14,
    volume: 15,
    tempo: 16,
    eqHigh: 17,
    eqMiddle: 18,
    eqLow: 19,
    filter: 20,
    crossfader: 21,
    master: 22,
    central: 23,
};

var ValueKind = {
    normal: 0,
    msb: 1,
    lsb: 2,
};

var logicCtrl = {
    0x97: {
        0x00: { deck: 1, ctrl: Ctrl.pad1, shift: false, valueKind: ValueKind.normal },
        0x01: { deck: 1, ctrl: Ctrl.pad2, shift: false, valueKind: ValueKind.normal },
        0x02: { deck: 1, ctrl: Ctrl.pad3, shift: false, valueKind: ValueKind.normal },
        0x03: { deck: 1, ctrl: Ctrl.pad4, shift: false, valueKind: ValueKind.normal },
        0x04: { deck: 1, ctrl: Ctrl.pad5, shift: false, valueKind: ValueKind.normal },
        0x05: { deck: 1, ctrl: Ctrl.pad6, shift: false, valueKind: ValueKind.normal },
        0x06: { deck: 1, ctrl: Ctrl.pad7, shift: false, valueKind: ValueKind.normal },
        0x07: { deck: 1, ctrl: Ctrl.pad8, shift: false, valueKind: ValueKind.normal },
    },
    0x98: {
        0x00: { deck: 1, ctrl: Ctrl.pad1, shift: true, valueKind: ValueKind.normal },
        0x01: { deck: 1, ctrl: Ctrl.pad2, shift: true, valueKind: ValueKind.normal },
        0x02: { deck: 1, ctrl: Ctrl.pad3, shift: true, valueKind: ValueKind.normal },
        0x03: { deck: 1, ctrl: Ctrl.pad4, shift: true, valueKind: ValueKind.normal },
        0x04: { deck: 1, ctrl: Ctrl.pad5, shift: true, valueKind: ValueKind.normal },
        0x05: { deck: 1, ctrl: Ctrl.pad6, shift: true, valueKind: ValueKind.normal },
        0x06: { deck: 1, ctrl: Ctrl.pad7, shift: true, valueKind: ValueKind.normal },
        0x07: { deck: 1, ctrl: Ctrl.pad8, shift: true, valueKind: ValueKind.normal },
    },
    0x99: {
        0x00: { deck: 2, ctrl: Ctrl.pad1, shift: false, valueKind: ValueKind.normal },
        0x01: { deck: 2, ctrl: Ctrl.pad2, shift: false, valueKind: ValueKind.normal },
        0x02: { deck: 2, ctrl: Ctrl.pad3, shift: false, valueKind: ValueKind.normal },
        0x03: { deck: 2, ctrl: Ctrl.pad4, shift: false, valueKind: ValueKind.normal },
        0x04: { deck: 2, ctrl: Ctrl.pad5, shift: false, valueKind: ValueKind.normal },
        0x05: { deck: 2, ctrl: Ctrl.pad6, shift: false, valueKind: ValueKind.normal },
        0x06: { deck: 2, ctrl: Ctrl.pad7, shift: false, valueKind: ValueKind.normal },
        0x07: { deck: 2, ctrl: Ctrl.pad8, shift: false, valueKind: ValueKind.normal },
    },
    0x9A: {
        0x00: { deck: 2, ctrl: Ctrl.pad1, shift: true, valueKind: ValueKind.normal },
        0x01: { deck: 2, ctrl: Ctrl.pad2, shift: true, valueKind: ValueKind.normal },
        0x02: { deck: 2, ctrl: Ctrl.pad3, shift: true, valueKind: ValueKind.normal },
        0x03: { deck: 2, ctrl: Ctrl.pad4, shift: true, valueKind: ValueKind.normal },
        0x04: { deck: 2, ctrl: Ctrl.pad5, shift: true, valueKind: ValueKind.normal },
        0x05: { deck: 2, ctrl: Ctrl.pad6, shift: true, valueKind: ValueKind.normal },
        0x06: { deck: 2, ctrl: Ctrl.pad7, shift: true, valueKind: ValueKind.normal },
        0x07: { deck: 2, ctrl: Ctrl.pad8, shift: true, valueKind: ValueKind.normal },
    },
    0x90: {
        0x0B: { deck: 1, ctrl: Ctrl.play, shift: false, valueKind: ValueKind.normal },
        0x47: { deck: 1, ctrl: Ctrl.play, shift: true, valueKind: ValueKind.normal },
        0x0C: { deck: 1, ctrl: Ctrl.cue, shift: false, valueKind: ValueKind.normal },
        0x48: { deck: 1, ctrl: Ctrl.cue, shift: true, valueKind: ValueKind.normal },
        0x3F: { deck: 1, ctrl: Ctrl.shift, shift: false, valueKind: ValueKind.normal },
        0x58: { deck: 1, ctrl: Ctrl.sync, shift: false, valueKind: ValueKind.normal },
        0x60: { deck: 1, ctrl: Ctrl.sync, shift: true, valueKind: ValueKind.normal },
        0x54: { deck: 1, ctrl: Ctrl.headphone, shift: false, valueKind: ValueKind.normal },
        0x68: { deck: 1, ctrl: Ctrl.headphone, shift: true, valueKind: ValueKind.normal },
        0x36: { deck: 1, ctrl: Ctrl.jogWheelTouch, shift: false, valueKind: ValueKind.normal },
        0x67: { deck: 1, ctrl: Ctrl.jogWheelTouch, shift: true, valueKind: ValueKind.normal },
    },
    0x91: {
        0x0B: { deck: 2, ctrl: Ctrl.play, shift: false, valueKind: ValueKind.normal },
        0x47: { deck: 2, ctrl: Ctrl.play, shift: true, valueKind: ValueKind.normal },
        0x0C: { deck: 2, ctrl: Ctrl.cue, shift: false, valueKind: ValueKind.normal },
        0x48: { deck: 2, ctrl: Ctrl.cue, shift: true, valueKind: ValueKind.normal },
        0x3F: { deck: 2, ctrl: Ctrl.shift, shift: false, valueKind: ValueKind.normal },
        0x58: { deck: 2, ctrl: Ctrl.sync, shift: false, valueKind: ValueKind.normal },
        0x60: { deck: 2, ctrl: Ctrl.sync, shift: true, valueKind: ValueKind.normal },
        0x54: { deck: 2, ctrl: Ctrl.headphone, shift: false, valueKind: ValueKind.normal },
        0x68: { deck: 2, ctrl: Ctrl.headphone, shift: true, valueKind: ValueKind.normal },
        0x36: { deck: 2, ctrl: Ctrl.jogWheelTouch, shift: false, valueKind: ValueKind.normal },
        0x67: { deck: 2, ctrl: Ctrl.jogWheelTouch, shift: true, valueKind: ValueKind.normal },
    },
    0xB0: {
        0x21: { deck: 1, ctrl: Ctrl.jogWheelTurn, shift: false, valueKind: ValueKind.normal },
        0x22: { deck: 1, ctrl: Ctrl.jogWheelTurn, shift: true, valueKind: ValueKind.normal },
        0x13: { deck: 1, ctrl: Ctrl.volume, shift: false, valueKind: ValueKind.msb },
        0x33: { deck: 1, ctrl: Ctrl.volume, shift: false, valueKind: ValueKind.lsb },
        0x00: { deck: 1, ctrl: Ctrl.tempo, shift: false, valueKind: ValueKind.msb },
        0x20: { deck: 1, ctrl: Ctrl.tempo, shift: false, valueKind: ValueKind.lsb },
        0x07: { deck: 1, ctrl: Ctrl.eqHigh, shift: false, valueKind: ValueKind.msb },
        0x27: { deck: 1, ctrl: Ctrl.eqHigh, shift: false, valueKind: ValueKind.lsb },
        0x0B: { deck: 1, ctrl: Ctrl.eqMiddle, shift: false, valueKind: ValueKind.msb },
        0x2B: { deck: 1, ctrl: Ctrl.eqMiddle, shift: false, valueKind: ValueKind.lsb },
        0x0F: { deck: 1, ctrl: Ctrl.eqLow, shift: false, valueKind: ValueKind.msb },
        0x2F: { deck: 1, ctrl: Ctrl.eqLow, shift: false, valueKind: ValueKind.lsb },
    },
    0xB1: {
        0x21: { deck: 2, ctrl: Ctrl.jogWheelTurn, shift: false, valueKind: ValueKind.normal },
        0x22: { deck: 2, ctrl: Ctrl.jogWheelTurn, shift: true, valueKind: ValueKind.normal },
        0x13: { deck: 2, ctrl: Ctrl.volume, shift: false, valueKind: ValueKind.msb },
        0x33: { deck: 2, ctrl: Ctrl.volume, shift: false, valueKind: ValueKind.lsb },
        0x00: { deck: 2, ctrl: Ctrl.tempo, shift: false, valueKind: ValueKind.msb },
        0x20: { deck: 2, ctrl: Ctrl.tempo, shift: false, valueKind: ValueKind.lsb },
        0x07: { deck: 2, ctrl: Ctrl.eqHigh, shift: false, valueKind: ValueKind.msb },
        0x27: { deck: 2, ctrl: Ctrl.eqHigh, shift: false, valueKind: ValueKind.lsb },
        0x0B: { deck: 2, ctrl: Ctrl.eqMiddle, shift: false, valueKind: ValueKind.msb },
        0x2B: { deck: 2, ctrl: Ctrl.eqMiddle, shift: false, valueKind: ValueKind.lsb },
        0x0F: { deck: 2, ctrl: Ctrl.eqLow, shift: false, valueKind: ValueKind.msb },
        0x2F: { deck: 2, ctrl: Ctrl.eqLow, shift: false, valueKind: ValueKind.lsb },
    },
    0xB6: {
        0x17: { deck: 1, ctrl: Ctrl.filter, shift: false, valueKind: ValueKind.msb },
        0x37: { deck: 1, ctrl: Ctrl.filter, shift: false, valueKind: ValueKind.lsb },
        0x18: { deck: 2, ctrl: Ctrl.filter, shift: false, valueKind: ValueKind.msb },
        0x38: { deck: 2, ctrl: Ctrl.filter, shift: false, valueKind: ValueKind.lsb },
        0x1F: { deck: 0, ctrl: Ctrl.crossfader, shift: false, valueKind: ValueKind.msb },
        0x3F: { deck: 0, ctrl: Ctrl.crossfader, shift: false, valueKind: ValueKind.lsb },
    },
    0x96: {
        0x63: { deck: 0, ctrl: Ctrl.master, shift: false, valueKind: ValueKind.normal },
        0x78: { deck: 0, ctrl: Ctrl.master, shift: true, valueKind: ValueKind.normal },
        0x59: { deck: 0, ctrl: Ctrl.central, shift: false, valueKind: ValueKind.normal },
        0x5A: { deck: 0, ctrl: Ctrl.central, shift: true, valueKind: ValueKind.normal },
    },
};

var midiCtrl = {
    1: {},
    2: {},
    0: {},
};

var otherDeck = {
    1: 2,
    2: 1,
}

var TopPadsMode = {
    hotcues1: 0,
    hotcues2: 1,
    knobFx: 2,
    padFx: 3,
};

var BottomPadsMode = {
    loop: 0,
    roll: 1,
    samples: 2,
    padFx: 3,
};

var mode = {
    master: false,
    choosePadMode: false,
    1: {
        topPads: TopPadsMode.hotcues1,
        bottomPads: BottomPadsMode.padFx,
        shift: false,
        status: {
            trackSamples: -1, // 0 if not loaded (init with -1 so that it is always different from any possible value)
            trackIsPlaying: false,
            onCuePosition: true,
            scratch: false,
            syncMasterDeck: 0, // 0 if off, else number of the master deck
            syncMultiplier: 1,
        },
    },
    2: {
        topPads: TopPadsMode.hotcues1,
        bottomPads: BottomPadsMode.padFx,
        shift: false,
        status: {
            trackSamples: -1, // 0 if not loaded (init with -1 so that it is always different from any possible value)
            trackIsPlaying: false,
            onCuePosition: true,
            scratch: false,
            syncMasterDeck: 0, // 0 if off, else number of the master deck
            syncMultiplier: 1,
        },
    },
};

genericCtrl = function (mainFunc) {
    return { master: null, choosePadMode: null, generic: mainFunc, topPad: null, bottomPad: null };
};

genericAndMasterCtrl = function (masterFunc, mainFunc) {
    return { master: masterFunc, choosePadMode: null, generic: mainFunc, topPad: null, bottomPad: null };
};

topPad = function (masterFunc, choosePadModeFunc, hotcues1Func, hotcues2Func, knobFxFunc, padFxFunc) {
    return { master: masterFunc, choosePadMode: choosePadModeFunc, generic: null, topPad: [hotcues1Func, hotcues2Func, knobFxFunc, padFxFunc], bottomPad: null };
};

bottomPad = function (masterFunc, choosePadModeFunc, loopFunc, rollFunc, samplesFunc, padFXFunc) {
    return { master: masterFunc, choosePadMode: choosePadModeFunc, generic: null, topPad: null, bottomPad: [loopFunc, rollFunc, samplesFunc, padFXFunc] };
};

var byteData = {
    1: {},
    2: {},
    0: {},
};

const BYTE_DATA_MIDDLE_FULL_VALUE = 8192; // Middle value
const BYTE_DATA_MAX_FULL_VALUE = 16383; // Max value

valueHandler = function (deckNumber, ctrl, kind, value) {
    if (kind == ValueKind.normal) {
        return value;
    }
    // Create the byteData object if it doesn't already exist
    var data = byteData[deckNumber][ctrl];
    if (data === undefined) {
        data = { msb: null, lsb: null, fullValue: BYTE_DATA_MIDDLE_FULL_VALUE }
        byteData[deckNumber][ctrl] = data;
        // print("NEW");
    }

    // Write in data only !null values (either msb or lsb)
    if (kind == ValueKind.msb) {
        data.msb = value;
    } else if (kind == ValueKind.lsb) {
        data.lsb = value;
    }

    // DEBUG PRINTS
    // print("MSB: " + data.msb);
    // print("LSB: " + data.lsb);
    // print("data: " + JSON.stringify(byteData));

    // Compute the fullValue only of both msb and lsb are !null, so assign them to null
    if (data.msb != null && data.lsb != null) {
        data.fullValue = data.msb << 7 | data.lsb;
        data.msb = null;
        data.lsb = null;
        // print("FULL");
    }

    return data.fullValue;
};

volumeEventHandler = function (deckNumber, fullValue) {
    engine.setParameter("[Channel" + deckNumber + "]", "volume", fullValue / BYTE_DATA_MAX_FULL_VALUE);
};

crossfaderEventHandler = function (deckNumber, fullValue) {
    engine.setParameter("[Master]", "crossfader", fullValue / BYTE_DATA_MAX_FULL_VALUE);
};

eqHighEventHandler = function (deckNumber, fullValue) {
    engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter3", fullValue / BYTE_DATA_MAX_FULL_VALUE);
};

eqMiddleEventHandler = function (deckNumber, fullValue) {
    engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter2", fullValue / BYTE_DATA_MAX_FULL_VALUE);
};

eqLowEventHandler = function (deckNumber, fullValue) {
    engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter1", fullValue / BYTE_DATA_MAX_FULL_VALUE);
};

filterEventHandler = function (deckNumber, fullValue) {
    engine.setParameter("[QuickEffectRack1_[Channel" + deckNumber + "]]", "super1", fullValue / BYTE_DATA_MAX_FULL_VALUE);
};

// Jog wheels const
const ALPHA = 1.0 / 8;
const BETA = ALPHA / 32;
const JOG_MULTIPLIER = 0.75;

jogWheelTouchEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        engine.scratchEnable(deckNumber, 400, 33 + 1 / 3, ALPHA, BETA);
        mode[deckNumber].status.scratch = true;
        print("SCRATCH ON");
    } else {
        engine.scratchDisable(deckNumber);
        mode[deckNumber].status.scratch = false;
        print("SCRATCH OFF");

        if (mode[deckNumber].status.onCuePosition) {
            engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
        }
    }
};

jogWheelTurnEventHandler = function (deckNumber, value) {
    value = value - 64;

    if (mode[deckNumber].status.scratch) {
        engine.scratchTick(deckNumber, value); // Scratch
        print("scratching");
    } else if (mode[deckNumber].status.trackIsPlaying) {
        engine.setValue("[Channel" + deckNumber + "]", 'jog', value * JOG_MULTIPLIER); // Pitch bend
        print("pitch bend");
    } else if (mode[deckNumber].status.onCuePosition) {
        engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
    }
};

playEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        if (mode[deckNumber].status.trackIsPlaying) {
            engine.setParameter("[Channel" + deckNumber + "]", "play", 0);
            mode[deckNumber].status.trackIsPlaying = false;
        } else {
            engine.setParameter("[Channel" + deckNumber + "]", "play", 1);
            mode[deckNumber].status.trackIsPlaying = true;
            mode[deckNumber].status.onCuePosition = false;
        }
    }
};

cueEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        if (mode[deckNumber].status.trackIsPlaying) {
            engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
            mode[deckNumber].status.trackIsPlaying = false;
            mode[deckNumber].status.onCuePosition = true;
        } else {
            if (mode[deckNumber].status.onCuePosition && !mode[deckNumber].status.scratch) {
                engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandplay", 1);
            } else {
                engine.setParameter("[Channel" + deckNumber + "]", "cue_set", 1);
                mode[deckNumber].status.onCuePosition = true;
            }
        }
    } else {
        if (mode[deckNumber].status.onCuePosition) {
            engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
        }
    }
};

shiftEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        mode[deckNumber].shift = true;
    } else {
        mode[deckNumber].shift = false;
    }
};

masterEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        mode.master = !mode.master;
        if (mode.master) {
            setLed(deckNumber, Ctrl.master, ON);
        } else {
            setLed(deckNumber, Ctrl.master, OFF);
        }
    }
};

headphoneEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        var NewVal = 1 - engine.getParameter("[Channel" + deckNumber + "]", "pfl");
        engine.setParameter("[Channel" + deckNumber + "]", "pfl", NewVal);
        setLed(deckNumber, Ctrl.headphone, ON * NewVal);
    }
};

syncEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        if (mode[deckNumber].status.syncMasterDeck == 0) {
            engine.setParameter("[Channel" + deckNumber + "]", "beatsync", 1);
            setLed(deckNumber, Ctrl.sync, ON);

            mode[deckNumber].status.syncMultiplier = engine.getValue("[Channel" + deckNumber + "]", "bpm") / engine.getValue("[Channel" + otherDeck[deckNumber] + "]", "bpm");

            if (mode[otherDeck[deckNumber]].status.syncMasterDeck != 0) {
                mode[deckNumber].status.syncMasterDeck = mode[otherDeck[deckNumber]].status.syncMasterDeck;
            } else {
                mode[deckNumber].status.syncMasterDeck = otherDeck[deckNumber];
            }
        } else {
            setLed(deckNumber, Ctrl.sync, OFF);
            mode[deckNumber].status.syncMasterDeck = 0;
            engine.setValue("[Channel" + deckNumber + "]", "bpm", engine.getValue("[Channel" + deckNumber + "]", "file_bpm"));

            if (mode[otherDeck[deckNumber]].status.syncMasterDeck == otherDeck[deckNumber]) {
                setLed(otherDeck[deckNumber], Ctrl.sync, OFF);
                mode[otherDeck[deckNumber]].status.syncMasterDeck = 0;
            }
        }
    }
};

syncMasterEventHandler = function (deckNumber, value) {
    if (value == 0x7F) {
        var nextTempoRange = {
            0.06: 0.1,
            0.1: 0.16,
            0.16: 1.0,
            1.0: 0.06,
        };
        var tempoRange = nextTempoRange[engine.getValue("[Channel" + deckNumber + "]", "rateRange")];
        engine.setValue("[Channel" + deckNumber + "]", "rateRange", tempoRange);
    }
};

tempoEventHandler = function (deckNumber, fullValue) {
    var tempo = ((fullValue / BYTE_DATA_MAX_FULL_VALUE) - 0.5) * 2 // from -6 to 6
    engine.setValue("[Channel" + deckNumber + "]", "rate", tempo);

    if (mode[deckNumber].status.syncMasterDeck == deckNumber) {
        engine.setValue("[Channel" + otherDeck[deckNumber] + "]", "bpm", engine.getValue("[Channel" + deckNumber + "]", "bpm") * mode[otherDeck[deckNumber]].status.syncMultiplier);
    } else if (mode[otherDeck[deckNumber]].status.syncMasterDeck != deckNumber) {
        mode[1].status.syncMasterDeck = 0;
        setLed(1, Ctrl.sync, OFF);
        mode[2].status.syncMasterDeck = 0;
        setLed(2, Ctrl.sync, OFF);
    }
};

var ctrlHandlersArray = [
    { ctrl: Ctrl.play, handlers: genericCtrl(function (s1, s2) { print(s1 + " " + s2) }) },
    { ctrl: Ctrl.volume, handlers: genericCtrl(volumeEventHandler) },
    { ctrl: Ctrl.tempo, handlers: genericCtrl(tempoEventHandler) },
    { ctrl: Ctrl.crossfader, handlers: genericCtrl(crossfaderEventHandler) },
    { ctrl: Ctrl.eqHigh, handlers: genericCtrl(eqHighEventHandler) },
    { ctrl: Ctrl.eqMiddle, handlers: genericCtrl(eqMiddleEventHandler) },
    { ctrl: Ctrl.eqLow, handlers: genericCtrl(eqLowEventHandler) },
    { ctrl: Ctrl.filter, handlers: genericCtrl(filterEventHandler) },
    { ctrl: Ctrl.jogWheelTouch, handlers: genericCtrl(jogWheelTouchEventHandler) },
    { ctrl: Ctrl.jogWheelTurn, handlers: genericCtrl(jogWheelTurnEventHandler) },
    { ctrl: Ctrl.play, handlers: genericCtrl(playEventHandler) },
    { ctrl: Ctrl.cue, handlers: genericCtrl(cueEventHandler) },
    { ctrl: Ctrl.shift, handlers: genericCtrl(shiftEventHandler) },
    { ctrl: Ctrl.master, handlers: genericCtrl(masterEventHandler) },
    { ctrl: Ctrl.headphone, handlers: genericCtrl(headphoneEventHandler) },
    { ctrl: Ctrl.sync, handlers: genericAndMasterCtrl(syncMasterEventHandler, syncEventHandler) },
];

var ctrlHandlers = {};

DDJ200.init = function () {
    var statusKeys = Object.keys(logicCtrl);
    for (var s = 0; s < statusKeys.length; s++) {
        var controlKeys = Object.keys(logicCtrl[statusKeys[s]]);

        for (var c = 0; c < controlKeys.length; c++) {
            var currentLogicControl = logicCtrl[statusKeys[s]][controlKeys[c]];

            if (!currentLogicControl.shift) {
                midiCtrl[currentLogicControl.deck][currentLogicControl.ctrl] = { normal: { status: statusKeys[s], control: controlKeys[c] }, shifted: null };
            }
        }
        for (var c = 0; c < controlKeys.length; c++) {
            var currentLogicControl = logicCtrl[statusKeys[s]][controlKeys[c]];

            if (currentLogicControl.shift) {
                midiCtrl[currentLogicControl.deck][currentLogicControl.ctrl].shifted = { status: statusKeys[s], control: controlKeys[c] };
            }
        }
    }

    for (var i = 0; i < ctrlHandlersArray.length; i++) {
        ctrlHandlers[ctrlHandlersArray[i].ctrl] = ctrlHandlersArray[i].handlers;
    }
    // print(JSON.stringify(ctrlHandlers));

    // Checking if a track is already playing
    if (engine.getParameter("[Channel1]", "play") == 1) {
        mode[1].status.trackIsPlaying = true;
    }
    if (engine.getParameter("[Channel2]", "play") == 1) {
        mode[2].status.trackIsPlaying = true;
    }

    print("Setting timer");

    var counter = 0;
    engine.beginTimer(250, function () {
        var currentTrackSamples = {
            1: engine.getParameter("[Channel1]", "track_samples"),
            2: engine.getParameter("[Channel2]", "track_samples"),
        };
        if (currentTrackSamples[1] != mode[1].status.trackSamples) {
            mode[1].status.trackSamples = currentTrackSamples[1];
            if (mode[1].status.trackSamples == 0) {
                setLed(1, Ctrl.play, OFF);
                setLed(1, Ctrl.cue, OFF);
            }
        }
        if (currentTrackSamples[2] != mode[2].status.trackSamples) {
            mode[2].status.trackSamples = currentTrackSamples[2];
            if (mode[2].status.trackSamples == 0) {
                setLed(2, Ctrl.play, OFF);
                setLed(2, Ctrl.cue, OFF);
            }
        }
        var playLedSetting = (counter - (counter % 2)) / 2;
        var cueLedSetting = 1 - (counter % 2);

        if (mode[1].status.trackSamples != 0) {
            if (mode[1].status.trackIsPlaying) {
                setLed(1, Ctrl.play, ON);
                setLed(1, Ctrl.cue, ON);
            } else {
                setLed(1, Ctrl.play, ON * playLedSetting);
                if (mode[1].status.onCuePosition) {
                    setLed(1, Ctrl.cue, ON);
                } else {
                    setLed(1, Ctrl.cue, ON * cueLedSetting);
                }
            }
        }

        if (mode[2].status.trackSamples != 0) {
            if (mode[2].status.trackIsPlaying) {
                setLed(2, Ctrl.play, ON);
                setLed(2, Ctrl.cue, ON);
            } else {
                setLed(2, Ctrl.play, ON * playLedSetting);
                if (mode[2].status.onCuePosition) {
                    setLed(2, Ctrl.cue, ON);
                } else {
                    setLed(2, Ctrl.cue, ON * cueLedSetting);
                }
            }
        }

        counter++;
        if (counter == 4) {
            counter = 0;
        }
    });

    print("Timer set");
};

DDJ200.shutdown = function () {
    setLed(1, Ctrl.play, OFF);
    setLed(1, Ctrl.cue, OFF);
    setLed(2, Ctrl.play, OFF);
    setLed(2, Ctrl.cue, OFF);
    setLed(1, Ctrl.sync, OFF);
    setLed(2, Ctrl.sync, OFF);
    setLed(1, Ctrl.headphone, OFF);
    setLed(2, Ctrl.headphone, OFF);
    setLed(0, Ctrl.master, OFF);
};

// Led const
const ON = 127;
const OFF = 0;

setLed = function (deck, ctrl, on_off) {
    var key = midiCtrl[deck][ctrl];

    if (key === undefined) {
        print("ERROR: undefined key");
    } else {
        midi.sendShortMsg(key.normal.status, key.normal.control, on_off);
        if (key.shifted != null) {
            midi.sendShortMsg(key.shifted.status, key.shifted.control, on_off);
        }
    }
};

DDJ200.eventHandler = function (channel, control, value, status, group) {
    var event = logicCtrl[status][control];

    if (event !== undefined) {
        /*
        print(JSON.stringify(event));
        print(midiCtrl[event.deck][event.ctrl].normal.status + ", " + midiCtrl[event.deck][event.ctrl].normal.control);
        if (midiCtrl[event.deck][event.ctrl].shifted != null) {
            print(midiCtrl[event.deck][event.ctrl].shifted.status + ", " + midiCtrl[event.deck][event.ctrl].shifted.control);
        }
        */
        var handlers = ctrlHandlers[event.ctrl];
        var deckNumber = event.deck;
        value = valueHandler(deckNumber, event.ctrl, event.valueKind, value);

        if (handlers !== undefined) {
            if (mode.master && handlers.master != null) {
                handlers.master(deckNumber, value);
            } else if (mode.choosePadMode && handlers.choosePadMode != null) {
                handlers.choosePadMode(deckNumber, value);
            } else if (handlers.generic != null) {
                handlers.generic(deckNumber, value);
            } else if (handlers.topPad != null) {
                handlers.topPad[mode[deckNumber].topPads](deckNumber, value);
            } else if (handlers.bottomPad != null) {
                handlers.bottomPad[mode[deckNumber].bottomPads](deckNumber, value);
            } else {
                print("NO FUNCTION AVALIABLE")
            }
        } else {
            print("UNKNOUN CTRL " + event.ctrl);
        }
    } else {
        print("ERROR: undefined control");
    }
};

/*
const central_key_Status = 0x96;
const central_key_Note = 0x59;
const centralShifted_key_Note = 0x5A;

const sync1_key_Status = 0x90;
const sync2_key_Status = 0x91;
const sync_key_Note = 0x58;
const syncShifted_key_Note = 0x60;

const headphone_key_Note = 0x54;
const headphoneShifted_key_Note = 0x68;

const pad1_keys_Status = [0x97, 0x98];
const pad2_keys_Status = [0x99, 0x9A];

// Status vars
var shiftPressed1 = false;
var shiftPressed2 = false;
var shiftLocked1 = false;
var shiftLocked2 = false;
var centralPressed = false;

// Status arrays
var led1 = [false, false, false, false, false, false, false, false];
var led2 = [false, false, false, false, false, false, false, false];
var normalStatus1 = [false, false, false, false, false, false, false, false];
var normalStatus2 = [false, false, false, false, false, false, false, false];
var shiftedStatus1 = [false, false, false, false, false, false, false, false];
var shiftedStatus2 = [false, false, false, false, false, false, false, false];
var metaStatus1 = [false, false, false, false, false, false, false, false];
var metaStatus2 = [false, false, false, false, false, false, false, false];

// General loop/roll vars
var roll_beats = 0;
var normal_loop_size = 0;

setShiftedStatus = function (deckNumber, i, val) {
    if (deckNumber == 1) {
        shiftedStatus1[i] = val;
    } else {
        shiftedStatus2[i] = val;
    }
};

setMetaStatus = function (deckNumber, i, val) {
    if (deckNumber == 1) {
        metaStatus1[i] = val;
    } else {
        metaStatus2[i] = val;
    }
};

shiftPressed = function (deckNumber) {
    if (deckNumber == 1) {
        return shiftPressed1;
    } else {
        return shiftPressed2;
    }
};

shiftLocked = function (deckNumber) {
    if (deckNumber == 1) {
        return shiftLocked1;
    } else {
        return shiftLocked2;
    }
};

shifted = function (deckNumber) {
    return (shiftPressed(deckNumber) || shiftLocked(deckNumber));
};

// 0 = normal, 1 = shift, 2 = meta
padStatus = function (deckNumber) {
    var status = 0;
        if (shifted(deckNumber)) {
            status = 1;
        } else if (centralPressed) {
            status = 2;
        }
    return status;
};

fixStatusLeds = function () {
    if ((shiftPressed1 && !shiftLocked1) || (shiftPressed2 && !shiftLocked2) || centralPressed) {
        midi.sendShortMsg(central_key_Status, central_key_Note, ON);
        midi.sendShortMsg(central_key_Status, centralShifted_key_Note, ON);
    } else {
        midi.sendShortMsg(central_key_Status, central_key_Note, OFF);
        midi.sendShortMsg(central_key_Status, centralShifted_key_Note, OFF);
    }
    if (shiftLocked1) {
        midi.sendShortMsg(sync1_key_Status, sync_key_Note, ON);
        midi.sendShortMsg(sync1_key_Status, syncShifted_key_Note, ON);
    } else {
        midi.sendShortMsg(sync1_key_Status, sync_key_Note, OFF);
        midi.sendShortMsg(sync1_key_Status, syncShifted_key_Note, OFF);
    }
    if (shiftLocked2) {
        midi.sendShortMsg(sync2_key_Status, sync_key_Note, ON);
        midi.sendShortMsg(sync2_key_Status, syncShifted_key_Note, ON);
    } else {
        midi.sendShortMsg(sync2_key_Status, sync_key_Note, OFF);
        midi.sendShortMsg(sync2_key_Status, syncShifted_key_Note, OFF);
    }
};

// keyNumber = 0-7, on_off = true-false
setPadLed = function (deckNumber, keyNumber, on_off) {
    if (deckNumber == 1) {
        var key_status = pad1_keys_Status;
    } else {
        var key_status = pad2_keys_Status;
    }
    if (on_off) {
        var val = on;
    } else {
        var val = off;
    }
    midi.sendShortMsg(key_status[0], keyNumber, val);
    midi.sendShortMsg(key_status[1], keyNumber, val);
};

fixPadLeds = function (deckNumber) {
    var cmdStatus = false;

    for (var i = 0; i <= 7; i++) {
        if (deckNumber == 1) {
            switch(padStatus(deckNumber)) {
                case 0: cmdStatus = normalStatus1[i];
                break;
                case 1: cmdStatus = shiftedStatus1[i];
                break;
                case 2: cmdStatus = metaStatus1[i];
                break;
            }
            if (led1[i] != cmdStatus) {
                setPadLed(deckNumber, i, cmdStatus);
                led1[i] = cmdStatus;
            }
        } else {
            switch(padStatus(deckNumber)) {
                case 0: cmdStatus = normalStatus2[i];
                break;
                case 1: cmdStatus = shiftedStatus2[i];
                break;
                case 2: cmdStatus = metaStatus2[i];
                break;
            }
            if (led2[i] != cmdStatus) {
                setPadLed(deckNumber, i, cmdStatus);
                led2[i] = cmdStatus;
            }
        }
    }
};

// Shift Key
DDJ200.shiftKey = function (channel, control, value, status, group) {
    var deckNumber = script.deckFromGroup(group);

    if (value === 0x7F) {
        if (status === 0x90) {
            shiftPressed1 = true;
            shiftLocked1 = false;
        } else {
            shiftPressed2 = true;
            shiftLocked2 = false;
        }
    } else {
        if (status === 0x90) {
            shiftPressed1 = false;
        } else {
            shiftPressed2 = false;
        }
    }
    fixStatusLeds();
    fixPadLeds(deckNumber);
};

// Central Key
DDJ200.centralKey = function (channel, control, value, status, group) {
    if (value === 0x7F) {
        centralPressed = true;
        if (shiftPressed1) {
            shiftLocked1 = true;
        }
        if (shiftPressed2) {
            shiftLocked2 = true;
        }
        if (!shiftPressed1 && !shiftPressed2) {
            shiftLocked1 = false;
            shiftLocked2 = false;
        }
    } else {
        centralPressed = false;
    }
    fixStatusLeds();
    fixPadLeds(1);
    fixPadLeds(2);
};

// Cue key
DDJ200.cueKey = function (channel, control, value, status, group) {
    if (value === 0x7F) {
        engine.setValue(group, "cue_default", 1);
    } else {
        engine.setValue(group, "cue_default", 0);
    }
};

// Play/pause key
DDJ200.playKey = function (channel, control, value, status, group) {
    if (value == 0x7F) {
        var last = engine.getValue(group, "play");
        engine.setValue(group, "play", 1 - last);
    }
};

// Headphone cueing keys
DDJ200.headphoneKey = function (channel, control, value, status, group) {
    var deckNumber = script.deckFromGroup(group);
    if (value == 0x7F) {
        var last = engine.getValue(group, "pfl");
        engine.setValue(group, "pfl", 1 - last);
        midi.sendShortMsg(status, headphone_key_Note, (1 - last) * ON);
        midi.sendShortMsg(status, headphoneShifted_key_Note, (1 - last) * ON);
    }
};

// Sync key
DDJ200.SyncKey = function (channel, control, value, status, group) {
    var deckNumber = script.deckFromGroup(group);

    if (padStatus(deckNumber) == 1) {
        if (value == 0x7F) {
            var last = engine.getValue(group, "quantize");
            engine.setValue(group, "quantize", 1 - last);
            midi.sendShortMsg(status, control, ON);
        } else if (padStatus(deckNumber) == 1) {
            midi.sendShortMsg(status, control, OFF);
        }
    } else if (padStatus(deckNumber) == 2) {
        if (value == 0x7F) {
            var last = engine.getValue(group, "keylock");
            engine.setValue(group, "keylock", 1 - last);
        }
    } else {
        if (value == 0x7F) {
            engine.setValue(group, "beatsync", 1);
            if (group == "[Channel1]") {
                midi.sendShortMsg(0x90, 0x0B, 0x7F);
            } else {
                midi.sendShortMsg(0x91, 0x0B, 0x7F);
            }
        }
    }
};

DDJ200.tempoFader = function (channel, control, value, status, group) {
    if (group == "[Channel1]") {
        midi.sendShortMsg(0x90, 0x0B, 0x00);
    } else {
        midi.sendShortMsg(0x91, 0x0B, 0x00);
    }
}

// The button that enables/disables scratching
DDJ200.wheelTouch = function (channel, control, value, status, group) {
    var deckNumber = script.deckFromGroup(group);

    if (value === 0x7F) {
        engine.scratchEnable(deckNumber, 400, 33+1/3, ALPHA, BETA);
    } else {
        engine.scratchDisable(deckNumber);
    }
};

// The wheel that actually controls the scratching/jogging
DDJ200.wheelTurn = function (channel, control, value, status, group) {
    var deckNumber = script.deckFromGroup(group);

    var newValue = value - 64;

    if (control == 0x21) {
        engine.setValue(group, 'jog', newValue * JOG_MULTIPLIER); // Pitch bend
    } else {
        engine.scratchTick(deckNumber, newValue); // Scratch
    }
};

// 8 keys controls
DDJ200.key = function (channel, control, value, status, group) {
    var deckNumber = script.deckFromGroup(group);

    if (padStatus(deckNumber) == 1) {
        switch(control) {
            case 0x00:
                // FX 1
                if (value == 0x7F) {
                    var last = engine.getValue("[EffectRack1_EffectUnit" + deckNumber + "_Effect1]", "enabled");
                    engine.setValue("[EffectRack1_EffectUnit" + deckNumber + "_Effect1]", "enabled", 1 - last);
                    if (last == 0) {
                        setShiftedStatus(deckNumber, control, true);
                    } else {
                        setShiftedStatus(deckNumber, control, false);
                    }
                }
            break;
            case 0x01:
                // FX 2
                var last = engine.getValue("[EffectRack1_EffectUnit" + deckNumber + "_Effect2]", "enabled");
                    engine.setValue("[EffectRack1_EffectUnit" + deckNumber + "_Effect2]", "enabled", 1 - last);
                    if (last == 0) {
                        setShiftedStatus(deckNumber, control, true);
                    } else {
                        setShiftedStatus(deckNumber, control, false);
                    }
            break;
            case 0x02:
                // FX 3
                var last = engine.getValue("[EffectRack1_EffectUnit" + deckNumber + "_Effect3]", "enabled");
                    engine.setValue("[EffectRack1_EffectUnit" + deckNumber + "_Effect3]", "enabled", 1 - last);
                    if (last == 0) {
                        setShiftedStatus(deckNumber, control, true);
                    } else {
                        setShiftedStatus(deckNumber, control, false);
                    }
            break;
            case 0x04:
                // PAUSE/PLAY
                if (value == 0x7F) {
                    engine.setValue(group, "slip_enabled", 1);
                    engine.brake(deckNumber, true , 100);
                } else {
                    engine.brake(deckNumber, false);
                    engine.setValue(group, "play", 1);
                    engine.setValue(group, "slip_enabled", 0);
                }
            break;
            case 0x05:
                // Halve loop size
                if (value == 0x7F) {
                    var last = engine.getValue(group, "beatloop_size");
                    engine.setValue(group, "beatloop_size", last / 2);
                    setShiftedStatus(deckNumber, control, true);
                    setShiftedStatus(deckNumber, 6, false);
                } else {
                    setShiftedStatus(deckNumber, control, false);
                    if (engine.getValue(group, "loop_enabled") == 1) {
                        setShiftedStatus(deckNumber, 6, true);
                    }
                }
            break;
            case 0x06:
                // LOOP on/off
                if (value == 0x7F) {
                    var last = engine.getValue(group, "loop_enabled");
                    if (last == 0) {
                        engine.setValue(group, "beatloop_activate", 1);
                        setShiftedStatus(deckNumber, control, true);
                    } else {
                        engine.setValue(group, "reloop_toggle", 1);
                        engine.setValue(group, "beatloop_activate", 0);
                        setShiftedStatus(deckNumber, control, false);
                    }
                }
            break;
            case 0x07:
                // Double loop size
                if (value == 0x7F) {
                    var last = engine.getValue(group, "beatloop_size");
                    engine.setValue(group, "beatloop_size", last * 2);
                    setShiftedStatus(deckNumber, control, true);
                    setShiftedStatus(deckNumber, 6, false);
                } else {
                    setShiftedStatus(deckNumber, control, false);
                    if (engine.getValue(group, "loop_enabled") == 1) {
                        setShiftedStatus(deckNumber, 6, true);
                    }
                }
            break;
        }
    } else if (padStatus(deckNumber) == 2) {
        if (value == 0x7F) {
            if (control <= 3) {
                if (deckNumber == 1) {
                    var sampler_n = control + 1;
                } else {
                    var sampler_n = control + 5;
                }
                engine.setValue("[Sampler" + sampler_n + "]", "cue_gotoandplay", 1);
            } else {
                switch(control) {
                    case 0x04: roll_beats = 1/8;
                    break;
                    case 0x05: roll_beats = 1/4;
                    break;
                    case 0x06: roll_beats = 1/2;
                    break;
                    case 0x07: roll_beats = 1;
                    break;
                }
                normal_loop_size = engine.getValue(group, "beatloop_size");
                engine.setValue(group, "beatlooproll_" + roll_beats + "_activate", 1);
            }
            setMetaStatus(deckNumber, control, true);
        } else {
            if (control >= 4) {
                engine.setValue(group, "reloop_toggle", 1);
                engine.setValue(group, "beatlooproll_" + roll_beats + "_activate", 0);
                engine.setValue(group, "beatloop_size", normal_loop_size);
            }
            setMetaStatus(deckNumber, control, false);
        }
    } else {
        // Hotcues
        if (value == 0x7F) {
            var hotcue_n = control + 1;
            engine.setValue(group, "hotcue_" + hotcue_n + "_activate", 1);
        }
    }
    fixPadLeds(deckNumber);
};
*/

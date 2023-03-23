var DDJ200 = {};

// #DELETEME
// From cmd.exe:
// "C:\Users\mmich\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\mixxx\Mixxx.lnk" --controllerDebug

// Led consts
const ON = 127;
const OFF = 0;

// Max byte value (used to normalize values)
const BYTE_DATA_MAX_VALUE = 16383;

// How many times a jog wheel tick affects the cursor movement throw the library (in master mode)
const LIBRARY_TICKS_FOR_MOVE = 30;

// Jog wheels consts
const ALPHA = 1.0 / 8;
const BETA = ALPHA / 32;
const JOG_MULTIPLIER = 0.7;

// Transitions time span consts (in milliseconds)
const MASTER_TRANSITION_TIME_SPAN_MS = 50;
const CHOOSE_PAD_MODE_TRANSITION_TIME_SPAN_MS = 25;
const PAD_TRANSITION_TIME_SPAN_MS = 100;

// "otherDeck" returns the opposite deck of the given one
var otherDeck = {
    1: 2,
    2: 1,
}

// "Ctrl" defines any DDJ-200 hardware control (not repeating for both decks), used to assign them an actual "name"
var Ctrl = {
    pad: {
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
        7: 6,
        8: 7,
    },
    play: 8,
    cue: 9,
    shift: 10,
    sync: 11,
    pfl: 12,
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

// "ValueKind" is used to distinguish between single-value messages and msb / lsb 
// (link to understand what msb and lsb are: #TODO)
var ValueKind = {
    normal: 0,
    msb: 1,
    lsb: 2,
};

// "logicCtrl" defines the deck number, the control name, the shift status
// (some controls send different messages whether the shift button is pressed or not) 
// and value kind of every fisical control, using "status" and "control" bytes as index
var logicCtrl = {
    0x97: {
        0x00: { deck: 1, ctrl: Ctrl.pad[1], shift: false, valueKind: ValueKind.normal },
        0x01: { deck: 1, ctrl: Ctrl.pad[2], shift: false, valueKind: ValueKind.normal },
        0x02: { deck: 1, ctrl: Ctrl.pad[3], shift: false, valueKind: ValueKind.normal },
        0x03: { deck: 1, ctrl: Ctrl.pad[4], shift: false, valueKind: ValueKind.normal },
        0x04: { deck: 1, ctrl: Ctrl.pad[5], shift: false, valueKind: ValueKind.normal },
        0x05: { deck: 1, ctrl: Ctrl.pad[6], shift: false, valueKind: ValueKind.normal },
        0x06: { deck: 1, ctrl: Ctrl.pad[7], shift: false, valueKind: ValueKind.normal },
        0x07: { deck: 1, ctrl: Ctrl.pad[8], shift: false, valueKind: ValueKind.normal },
    },
    0x98: {
        0x00: { deck: 1, ctrl: Ctrl.pad[1], shift: true, valueKind: ValueKind.normal },
        0x01: { deck: 1, ctrl: Ctrl.pad[2], shift: true, valueKind: ValueKind.normal },
        0x02: { deck: 1, ctrl: Ctrl.pad[3], shift: true, valueKind: ValueKind.normal },
        0x03: { deck: 1, ctrl: Ctrl.pad[4], shift: true, valueKind: ValueKind.normal },
        0x04: { deck: 1, ctrl: Ctrl.pad[5], shift: true, valueKind: ValueKind.normal },
        0x05: { deck: 1, ctrl: Ctrl.pad[6], shift: true, valueKind: ValueKind.normal },
        0x06: { deck: 1, ctrl: Ctrl.pad[7], shift: true, valueKind: ValueKind.normal },
        0x07: { deck: 1, ctrl: Ctrl.pad[8], shift: true, valueKind: ValueKind.normal },
    },
    0x99: {
        0x00: { deck: 2, ctrl: Ctrl.pad[1], shift: false, valueKind: ValueKind.normal },
        0x01: { deck: 2, ctrl: Ctrl.pad[2], shift: false, valueKind: ValueKind.normal },
        0x02: { deck: 2, ctrl: Ctrl.pad[3], shift: false, valueKind: ValueKind.normal },
        0x03: { deck: 2, ctrl: Ctrl.pad[4], shift: false, valueKind: ValueKind.normal },
        0x04: { deck: 2, ctrl: Ctrl.pad[5], shift: false, valueKind: ValueKind.normal },
        0x05: { deck: 2, ctrl: Ctrl.pad[6], shift: false, valueKind: ValueKind.normal },
        0x06: { deck: 2, ctrl: Ctrl.pad[7], shift: false, valueKind: ValueKind.normal },
        0x07: { deck: 2, ctrl: Ctrl.pad[8], shift: false, valueKind: ValueKind.normal },
    },
    0x9A: {
        0x00: { deck: 2, ctrl: Ctrl.pad[1], shift: true, valueKind: ValueKind.normal },
        0x01: { deck: 2, ctrl: Ctrl.pad[2], shift: true, valueKind: ValueKind.normal },
        0x02: { deck: 2, ctrl: Ctrl.pad[3], shift: true, valueKind: ValueKind.normal },
        0x03: { deck: 2, ctrl: Ctrl.pad[4], shift: true, valueKind: ValueKind.normal },
        0x04: { deck: 2, ctrl: Ctrl.pad[5], shift: true, valueKind: ValueKind.normal },
        0x05: { deck: 2, ctrl: Ctrl.pad[6], shift: true, valueKind: ValueKind.normal },
        0x06: { deck: 2, ctrl: Ctrl.pad[7], shift: true, valueKind: ValueKind.normal },
        0x07: { deck: 2, ctrl: Ctrl.pad[8], shift: true, valueKind: ValueKind.normal },
    },
    0x90: {
        0x0B: { deck: 1, ctrl: Ctrl.play, shift: false, valueKind: ValueKind.normal },
        0x47: { deck: 1, ctrl: Ctrl.play, shift: true, valueKind: ValueKind.normal },
        0x0C: { deck: 1, ctrl: Ctrl.cue, shift: false, valueKind: ValueKind.normal },
        0x48: { deck: 1, ctrl: Ctrl.cue, shift: true, valueKind: ValueKind.normal },
        0x3F: { deck: 1, ctrl: Ctrl.shift, shift: false, valueKind: ValueKind.normal },
        0x58: { deck: 1, ctrl: Ctrl.sync, shift: false, valueKind: ValueKind.normal },
        0x60: { deck: 1, ctrl: Ctrl.sync, shift: true, valueKind: ValueKind.normal },
        0x54: { deck: 1, ctrl: Ctrl.pfl, shift: false, valueKind: ValueKind.normal },
        0x68: { deck: 1, ctrl: Ctrl.pfl, shift: true, valueKind: ValueKind.normal },
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
        0x54: { deck: 2, ctrl: Ctrl.pfl, shift: false, valueKind: ValueKind.normal },
        0x68: { deck: 2, ctrl: Ctrl.pfl, shift: true, valueKind: ValueKind.normal },
        0x36: { deck: 2, ctrl: Ctrl.jogWheelTouch, shift: false, valueKind: ValueKind.normal },
        0x67: { deck: 2, ctrl: Ctrl.jogWheelTouch, shift: true, valueKind: ValueKind.normal },
    },
    0xB0: {
        0x21: { deck: 1, ctrl: Ctrl.jogWheelTurn, shift: false, valueKind: ValueKind.normal },
        0x22: { deck: 1, ctrl: Ctrl.jogWheelTurn, shift: true, valueKind: ValueKind.normal },
        0x29: { deck: 1, ctrl: Ctrl.jogWheelTurn, shift: true, valueKind: ValueKind.normal },
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
        0x29: { deck: 2, ctrl: Ctrl.jogWheelTurn, shift: true, valueKind: ValueKind.normal },
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

// "midiCtrl" is filled in in the "DDJ200.init" function, reversing the logicCtrl object: 
// it provides "status" and "control" bytes using deck number and control name as index 
// (a "shifted" field is added to every ctrl, containing the shifted control address, if the given control has one, otherwise remaining "null")
var midiCtrl = {
    1: {},
    2: {},
    0: {},
};

// "connections" is filled in in the "DDJ200.init" function with every connection (used to trigger callbacks)
// (link to understand what connections are: #TODO)
var connections = {
    1: {},
    2: {},
    0: {},
};

// "setLed" sets the given control's led and also it's "shifted" one if it has any
// (this is to prevent leds to be in a different setting when the shift button is pressed, which should never happen)
setLed = function (deck, ctrl, on) {
    var key = midiCtrl[deck][ctrl];

    if (key === undefined) {
        print("setLed: UNDEFINED KEY (deck: " + deck + ", ctrl: " + ctrl + ")");
    } else {
        if (on) {
            midi.sendShortMsg(key.normal.status, key.normal.control, ON);
        } else {
            midi.sendShortMsg(key.normal.status, key.normal.control, OFF);
        }
        if (key.shifted != null) {
            if (on) {
                midi.sendShortMsg(key.shifted.status, key.shifted.control, ON);
            } else {
                midi.sendShortMsg(key.shifted.status, key.shifted.control, OFF);
            }
        }
    }
};

// "setLedsOff" turns off every led (used in "DDJ200.shutdown")
setLedsOff = function () {
    var deckKeys = Object.keys(midiCtrl);

    for (var deck_i = 0; deck_i < deckKeys.length; deck_i++) {
        var deckNumber = deckKeys[deck_i];
        var ctrlKeys = Object.keys(midiCtrl[deckNumber]);

        for (var ctrl_i = 0; ctrl_i < ctrlKeys.length; ctrl_i++) {
            var ctrl = ctrlKeys[ctrl_i];
            setLed(deckNumber, ctrl, false);
        }
    }
};

// "GeneralMode" defines the three possible modes regarding more than one control:
// - normal: everything has its normal function
// - master: pads can change settings and load tracks while jog wheels scroll through the song library
// - choosePadMode: pads can change their own normal modes, according to pre-made function banks (see "modeBanks")
var GeneralMode = {
    normal: 0,
    master: 1,
    choosePadMode: 2,
};

// "KnobMode" defines any possible function of a knob
var KnobMode = {
    eqHigh: 0,
    eqMiddle: 1,
    eqLow: 2,
    fx: {
        1: 3,
        2: 4,
        3: 5,
    },
    filter: 6,
    gain: 7,
};

// "PadMode" defines any possible function of a pad (in GeneralMode.normal)
var PadMode = {
    hotcue: {
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
        7: 6,
        8: 7,
    },

    sampler: {
        1: 8,
        2: 9,
        3: 10,
        4: 11,
        5: 12,
        6: 13,
        7: 14,
        8: 15,
    },

    fx: {
        1: 16,
        2: 17,
        3: 18,
    },
    knobFx: {
        1: 19,
        2: 20,
        3: 21,
    },
    knobGain: 22,
    killFx: 23,

    brake: 24,

    loopToggle: 110,
    loopDouble: 111,
    loopHalve: 112,
    loopInOut: 113,

    // loop128: 114,
    // loop64: 115,
    loop: {
        32: 116,
        16: 117,
        8: 118,
        4: 119,
        2: 120,
        1: 121,
        0.5: 122,
        0.25: 123,
        0.125: 124,
        0.0625: 125,
        0.03125: 126,
    },
    // loop1z64: 127,
    // loop1z128: 128,

    roll4: 129,
    roll2: 130,
    roll1: 131,
    roll1z2: 132,
    roll1z4: 133,
    roll1z8: 134,
    roll1z16: 135,
    roll1z32: 136,
    // roll1z64: 137,
    // roll1z128: 138,
};

// "modeArray" is used to fill in "scriptData" in "DDJ200.init" with default settings of knobs and pads 
// (necessary to have the control name as key in the resulting object)
var modeArray = [
    { ctrl: Ctrl.eqHigh, mode: KnobMode.eqHigh },
    { ctrl: Ctrl.eqMiddle, mode: KnobMode.eqMiddle },
    { ctrl: Ctrl.eqLow, mode: KnobMode.eqLow },
    { ctrl: Ctrl.filter, mode: KnobMode.filter },
    { ctrl: Ctrl.pad[1], mode: PadMode.hotcue[1] },
    { ctrl: Ctrl.pad[2], mode: PadMode.hotcue[2] },
    { ctrl: Ctrl.pad[3], mode: PadMode.hotcue[3] },
    { ctrl: Ctrl.pad[4], mode: PadMode.hotcue[4] },
    { ctrl: Ctrl.pad[5], mode: PadMode.hotcue[5] },
    { ctrl: Ctrl.pad[6], mode: PadMode.hotcue[6] },
    { ctrl: Ctrl.pad[7], mode: PadMode.hotcue[7] },
    { ctrl: Ctrl.pad[8], mode: PadMode.hotcue[8] },
];

// "scriptData" is partially filled in in "DDJ200.init" in order to contain the current status of everything needed
// (indexed by deck number and control name, mostly)
// - 0:
//   - "generalMode" (default: "normal")
//   - "shift" ("null" if no shift button is pressed, otherwise the deck number of the pressed one)
//   - "transitionID" (timer ID of the current transition, null if there is no transition)
//   - "transitionCounter" (counter used to figure out which is the current step of the transition)
//   - "libraryCounter" (necessary to reduce the number of events actually used while searching through the songs using the jog wheel, 
//                       otherwise it would be too reactive)
// - 1 / 2:
//   - ctrl:
//     - knobs: mode, nextMode, "centered" (bool)
//     - pads: mode, "ignoreRelease" (bool) (necessary to skip a button release when changing mode)
//   - "onCue" (to know if the track is stopped on cue point, useful to get back after scratching)
//   - "brake" (if effect brake is on)
//   - "knobGain" (if the filter knob has to be used a the gain one)
//   - "knobGainAct" (if the gain knob has to take effect or not)
//   - "knobGainPos" (the current position of the gain knob) #FIXME
//   - "killFx" (if the killFx button has been pressed)
//   - "loadedModeBank" (number of the pad mode bank currently loaded)
var scriptData = {
    0: {
        generalMode: GeneralMode.normal,
        shift: null,
        transitionID: null,
        transitionCounter: 0,
        libraryCounter: 0,
    },
    1: {
        onCue: true,
        brake: false,
        knobGain: false,
        knobGainAct: false,
        knobGainPos: 0.5,
        killFx: false,
        loadedModeBank: 1,
        ctrl: {},
    },
    2: {
        onCue: true,
        brake: false,
        knobGain: false,
        knobGainAct: false,
        knobGainPos: 0.5,
        killFx: false,
        loadedModeBank: 1,
        ctrl: {},
    },
};

// "bytedata" is filled in run time, storing msb / lsb infos of used controls of those types
var byteData = {
    1: {},
    2: {},
    0: {},
};

// "valueHandler" receives any value sent from any control, managing in particular msb / lsb ones #CHECKME
valueHandler = function (deckNumber, ctrl, kind, value) {
    if (kind == ValueKind.normal) {
        return value;
    }
    // Create the byteData object if it doesn't already exist
    var data = byteData[deckNumber][ctrl];
    if (data === undefined) {
        data = { msb: null, lsb: null, fullValue: 0 }
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

    // Compute the fullValue only if both msb and lsb are !null, so assign them to null
    if (data.msb != null && data.lsb != null) {
        data.fullValue = data.msb << 7 | data.lsb;
        data.msb = null;
        data.lsb = null;
        // print("FULL");
    }

    return data.fullValue;
};

// "normalCtrl" returns the handlers object of a control, 
// filling in only the "normal" mode field (see "ctrlHandlersArray")
normalCtrl = function (mainFunc) {
    return { master: null, choosePadMode: null, normal: mainFunc };
};

// "normalAndMasterCtrl" returns the handlers object of a control, 
// filling in only both the "normal" and the "master" mode fields (see "ctrlHandlersArray")
normalAndMasterCtrl = function (masterFunc, mainFunc) {
    return { master: masterFunc, choosePadMode: null, normal: mainFunc };
};

// "pad" returns the handlers object of a pad control, 
// filling in the "normal", the "master" and the "choose pad" mode fields (see "ctrlHandlersArray")
pad = function (masterFunc, choosePadModeFunc, mainFunc) {
    return { master: masterFunc, choosePadMode: choosePadModeFunc, normal: mainFunc };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////      FADERS      ///////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// "volumeEventHandler" moves the volume fader
volumeEventHandler = function (deckNumber, ctrl, value) {
    engine.setParameter("[Channel" + deckNumber + "]", "volume", value / BYTE_DATA_MAX_VALUE);
};

// "crossfaderEventHandler" moves the crossfader
crossfaderEventHandler = function (deckNumber, ctrl, value) {
    engine.setParameter("[Master]", "crossfader", value / BYTE_DATA_MAX_VALUE);
};

// "volumeEventHandler" moves the tempo fader
tempoEventHandler = function (deckNumber, ctrl, value) {
    var tempo = -2 * ((value / BYTE_DATA_MAX_VALUE) - 0.5) // from -6 to 6 #CHECKME
    engine.setValue("[Channel" + deckNumber + "]", "rate", tempo);
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////      KNOBS      ///////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// "knobEventHandler" moves the parameter for the knob's mode, switching between chosen modes only when the knob is centered (the "off" position)
knobEventHandler = function (deckNumber, ctrl, value) {
    var pos = value / BYTE_DATA_MAX_VALUE;

    // considering the current mode of the control
    switch (scriptData[deckNumber].ctrl[ctrl].mode) {
        case KnobMode.eqHigh:
            engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter3", pos);
            break;
        case KnobMode.eqMiddle:
            engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter2", pos);
            break;
        case KnobMode.eqLow:
            engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter1", pos);
            break;
        case KnobMode.fx[1]:
            if (pos <= 0.5) {
                engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter3", pos);
            } else if (pos >= 0.5) {
                engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter3", 0.5);
                engine.setParameter("[EffectRack1_EffectUnit" + (deckNumber + 2) + "_Effect1]", "meta", (2 * pos) - 1);
            }
            break;
        case KnobMode.fx[2]:
            if (pos <= 0.5) {
                engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter2", pos);
            } else if (pos >= 0.5) {
                engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter2", 0.5);
                engine.setParameter("[EffectRack1_EffectUnit" + (deckNumber + 2) + "_Effect2]", "meta", (2 * pos) - 1);
            }
            break;
        case KnobMode.fx[3]:
            if (pos <= 0.5) {
                engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter1", pos);
            } else if (pos >= 0.5) {
                engine.setParameter("[EqualizerRack1_[Channel" + deckNumber + "]_Effect1]", "parameter1", 0.5);
                engine.setParameter("[EffectRack1_EffectUnit" + (deckNumber + 2) + "_Effect3]", "meta", (2 * pos) - 1);
            }
            break;
        case KnobMode.filter:
            engine.setParameter("[QuickEffectRack1_[Channel" + deckNumber + "]]", "super1", pos);
            break;
        case KnobMode.gain:
            if (scriptData[deckNumber].knobGainAct) {
                scriptData[deckNumber].knobGainPos = pos;
                engine.setParameter("[Channel" + deckNumber + "]", "pregain", pos);
            }
            break;
    }

    // the gain knob needs to remain in its last position when the knob is not meant to move it, 
    // so it is stored in "scriptData[deckNumber].knobGainPos" and used to know when the change has to begin taking effect
    if (scriptData[deckNumber].ctrl[ctrl].mode == KnobMode.gain) {
        if (((scriptData[deckNumber].knobGainPos - 0.5) <= 0 && (pos - 0.5) <= (scriptData[deckNumber].knobGainPos - 0.5)) || ((scriptData[deckNumber].knobGainPos - 0.5) >= 0 && (pos - 0.5) >= (scriptData[deckNumber].knobGainPos - 0.5))) {
            scriptData[deckNumber].knobGainAct = true;
        }
        if (scriptData[deckNumber].ctrl[ctrl].nextMode != KnobMode.gain) {
            scriptData[deckNumber].knobGainAct = false;
        }
    }

    // changing mode when the knob is centered 
    if (((pos * 1000) | 0) / 1000 == 0.5) {
        scriptData[deckNumber].ctrl[ctrl].centered = true;

        if (scriptData[deckNumber].ctrl[ctrl].mode != scriptData[deckNumber].ctrl[ctrl].nextMode) {
            scriptData[deckNumber].ctrl[ctrl].mode = scriptData[deckNumber].ctrl[ctrl].nextMode;
        }
    } else {
        scriptData[deckNumber].ctrl[ctrl].centered = false;
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////      JOG WHEELS      /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// "jogWheelTouchEventHandler" toggles the scratching status
jogWheelTouchEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        if (engine.getParameter("[Channel" + deckNumber + "]", "play")) {
            engine.scratchEnable(deckNumber, 400, 33 + 1 / 3, ALPHA, BETA, true);
        } else {
            engine.scratchEnable(deckNumber, 400, 33 + 1 / 3, ALPHA, BETA, false);
        }
        
    } else {
        if (scriptData[deckNumber].onCue) {
            engine.scratchDisable(deckNumber, false);
            engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
        } else {
            engine.scratchDisable(deckNumber, true);
        }
    }
};

// "jogWheelTurnEventHandler" either scratches or jogs (changes temporary the deck's tempo)
jogWheelTurnEventHandler = function (deckNumber, ctrl, value) {
    value = value - 64;

    if (engine.isScratching(deckNumber)) {
        engine.scratchTick(deckNumber, value); // Scratch
    } else if (engine.getParameter("[Channel" + deckNumber + "]", "play")) {
        engine.setValue("[Channel" + deckNumber + "]", 'jog', value * JOG_MULTIPLIER); // Pitch bend
    } // else if (scriptData[deckNumber].onCue) {
    //     // Necessary if getting back to cue point after scratching isn't accurate
    //     engine.scratchDisable(deckNumber);
    //     engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
    // }
};

// "jogWheelTurnMasterEventHandler" scrolls through the song library
jogWheelTurnMasterEventHandler = function (deckNumber, ctrl, value) {
    value = -1 * (value - 64);

    scriptData[0].libraryCounter++;

    if (scriptData[0].libraryCounter >= LIBRARY_TICKS_FOR_MOVE) {
        engine.setValue("[Library]", "MoveVertical", value);
        scriptData[0].libraryCounter = 0;
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////      BUTTONS      //////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// "playEventHandler" starts/stops the track
playEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        if (engine.getParameter("[Channel" + deckNumber + "]", "play")) {
            engine.setParameter("[Channel" + deckNumber + "]", "play", 0);
        } else {
            engine.setParameter("[Channel" + deckNumber + "]", "play", 1);
        }
    }
};

// "playCallback" is used to know if the track is no more "on cue" since it has been played from mixxx ui
playCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);

    if (value) {
        scriptData[deckNumber].onCue = false;
    }
}

// "playEventHandler" manages the cue functions (#TODO)
cueEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        if (engine.getParameter("[Channel" + deckNumber + "]", "play") || scriptData[0].shift != null) {
            engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
            scriptData[deckNumber].onCue = true;
        } else {
            if (scriptData[deckNumber].onCue && !engine.isScratching(deckNumber)) {
                engine.setParameter("[Channel" + deckNumber + "]", "cue_preview", 1);
            } else {
                engine.setParameter("[Channel" + deckNumber + "]", "cue_set", 1);
                scriptData[deckNumber].onCue = true;
            }
        }
    } else {
        if (scriptData[deckNumber].onCue) {
            engine.setParameter("[Channel" + deckNumber + "]", "cue_preview", 0);
            // engine.setParameter("[Channel" + deckNumber + "]", "cue_gotoandstop", 1);
        }
    }
};

// "playCallback" is used to know if the track is "on cue" since it has been stopped on cue point from mixxx ui
cueCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);

    if (value) {
        scriptData[deckNumber].onCue = true;
    }
};

// "pflEventHandler" enables pfl (pre-fader listen)
pflEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        engine.setParameter("[Channel" + deckNumber + "]", "pfl", 1 - engine.getParameter("[Channel" + deckNumber + "]", "pfl"));
    }
};

// "pflCallback" sets the pfl led
pflCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);

    setLed(deckNumber, Ctrl.pfl, value);
};

// "syncEventHandler" toggles quantize (or keylock, if shift is pressed)
syncEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        if (scriptData[0].shift != null) {
            engine.setParameter("[Channel" + deckNumber + "]", "keylock", 1 - engine.getParameter("[Channel" + deckNumber + "]", "keylock"));
        } else {
            engine.setParameter("[Channel" + deckNumber + "]", "quantize", 1 - engine.getParameter("[Channel" + deckNumber + "]", "quantize"));
        }
    }
};

// "quantizeCallback" sets the sync led in not-shifted status
quantizeCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);

    if (scriptData[0].shift == null) {
        setLed(deckNumber, Ctrl.sync, value);
    }
};

// "keylockCallback" sets the sync led in shifted status
keylockCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);

    if (scriptData[0].shift != null) {
        setLed(deckNumber, Ctrl.sync, value);
    }
};

// "setShiftStatus" stores the shift buttons status and changes the sync leds if needed
// (the button function changes in shifted status)
setShiftStatus = function (deckNumber, on) {
    if (on) {
        if (scriptData[0].shift == null) {
            scriptData[0].shift = deckNumber;
        } else {
            scriptData[0].shift = 0;
        }

        connections[1].keylock.trigger();
        connections[2].keylock.trigger();
    } else {
        if (scriptData[0].shift == 0) {
            scriptData[0].shift = otherDeck[deckNumber];
        } else {
            scriptData[0].shift = null;
        }

        connections[1].quantize.trigger();
        connections[2].quantize.trigger();
    }
};

// "setMasterMode" manages anything in order to switch to or from "master" mode
setMasterMode = function (on) {
    if (on) {
        scriptData[0].generalMode = GeneralMode.master;

        setLed(0, Ctrl.master, true);
        setLed(0, Ctrl.central, false);
        
        masterTransition();
    } else {
        scriptData[0].generalMode = GeneralMode.normal;
        padsIgnoreReleases();

        stopTransition(false);
        setPadsStatus[scriptData[0].generalMode]();

        setLed(0, Ctrl.master, false);
    }
};

// "setChoosePadMode" manages anything in order to switch to or from "choose pad" mode
setChoosePadMode = function (on, setStatus) {
    if (on) {
        scriptData[0].generalMode = GeneralMode.choosePadMode;

        setLed(0, Ctrl.central, true);
        setLed(0, Ctrl.master, false);

        choosePadModeTransition();
    } else {
        scriptData[0].generalMode = GeneralMode.normal;
        padsIgnoreReleases();

        stopTransition(false);
        if (setStatus) {
            setPadsStatus[scriptData[0].generalMode]();
        }

        setLed(0, Ctrl.central, false);
    }
};

// "shiftEventHandler" changes shift status (see "setShiftStatus")
shiftEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        setShiftStatus(deckNumber, true);
    } else {
        setShiftStatus(deckNumber, false);
    }
};

// "masterEventHandler" toggles "master" mode (see "setMasterMode")
masterEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        if (scriptData[0].generalMode == GeneralMode.master) {
            setMasterMode(false);
        } else {
            setMasterMode(true);
        }
    }
};

// "centralEventHandler" toggles "choose pad" mode (see "setChoosePadMode")
centralEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        if (scriptData[0].generalMode == GeneralMode.choosePadMode) {
            setChoosePadMode(false, true);
        } else {
            setChoosePadMode(true);
        }
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////      PADS      ////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// "setPadsLedFromMode" sets the led of any pad in the given mode
setPadsLedFromMode = function (deckNumber, padMode, value) {
    for (var padNumber = 1; padNumber <= 8; padNumber++) {
        if (scriptData[deckNumber].ctrl[Ctrl.pad[padNumber]].mode == padMode) {
            setLed(deckNumber, Ctrl.pad[padNumber], value);
        }
    }
};

// "hotcueFromControl" returns the hotcue number from the given "control string"
hotcueFromControl = function (control) {
    const hotcueNRegexp = /([0-9]+)/g;
    return +control.match(hotcueNRegexp)[0];
};

// "loopXFromControl" returns the loop size from the given "control string"
loopXFromControl = function (control) {
    const loopXRegexp = /([0-9\.]+)/g;
    return +control.match(loopXRegexp)[0];
};

// "fxFromGroup" returns the fx numbers ("unit" and "effect") from the given "control string"
fxFromGroup = function (group) {
    const fxNMRegexp = /([0-9]+)/g;
    return [+group.match(fxNMRegexp)[1], +group.match(fxNMRegexp)[2]];
};

// "setHotcue" manages any hotcue (#TODO)
setHotcue = function (deckNumber, hotcueNumber) {
    if (scriptData[0].shift != null) {
        engine.setParameter("[Channel" + deckNumber + "]", "hotcue_" + hotcueNumber + "_clear", 1);
    } else {
        if (engine.getParameter("[Channel" + deckNumber + "]", "hotcue_" + hotcueNumber + "_enabled") == 1) {
            engine.setParameter("[Channel" + deckNumber + "]", "hotcue_" + hotcueNumber + "_gotoandplay", 1);
        } else {
            engine.setParameter("[Channel" + deckNumber + "]", "hotcue_" + hotcueNumber + "_set", 1);
        }
    }
}

// "hotcueCallback" sets the hotcue[N] mode leds
hotcueCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);
    var hotcueNumber = hotcueFromControl(control);

    setPadsLedFromMode(deckNumber, PadMode.hotcue[hotcueNumber], value);
};

// "setLoopX" toggles a loop of the given size
setLoopX = function (deckNumber, loopX) {
    engine.setParameter("[Channel" + deckNumber + "]", "beatloop_" + loopX + "_toggle", 1);
}

// "loopXCallback" sets the loop[X] mode leds
loopXCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);
    var loopX = loopXFromControl(control);

    setPadsLedFromMode(deckNumber, PadMode.loop[loopX], value);
};

// "loopToggleCallback" sets the loopToggle mode leds and makes sure that when a loop is disabled the parameters "loop_in/out" are so too
loopToggleCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);

    if (!value) {
        engine.setParameter("[Channel" + deckNumber + "]", "loop_in", 0);
        engine.setParameter("[Channel" + deckNumber + "]", "loop_out", 0);
    }

    setPadsLedFromMode(deckNumber, PadMode.loopToggle, value);
};

setFx = function (fxNumber, deckNumber, value) {
    var last = engine.getParameter("[EffectRack1_EffectUnit" + deckNumber + "_Effect" + fxNumber + "]", "enabled");

    if (value) {
        engine.setParameter("[EffectRack1_EffectUnit" + deckNumber + "_Effect" + fxNumber + "]", "enabled", 1 - last);
    } else if (scriptData[0].shift == null) {
        engine.setParameter("[EffectRack1_EffectUnit" + deckNumber + "_Effect" + fxNumber + "]", "enabled", 0);
    }
};

// "fxNumberFromKnobMode" returns the "N" from "Knobmode.fx[N]"
fxNumberFromKnobMode = function (knobMode) {
    var fxNumbers = Object.keys(KnobMode.fx);
    for (var i = 0; i < fxNumbers.length; i++) {
        if (KnobMode.fx[fxNumbers[i]] == knobMode) {
            return fxNumbers[i];
        }
    }
    return null;
}

// "ctrlFromMode" returns the knob control linked to the given mode
ctrlFromMode = function (knobMode) {
    switch (knobMode) {
        case KnobMode.fx[1]:
            return Ctrl.eqHigh;
        case KnobMode.fx[2]:
            return Ctrl.eqMiddle;
        case KnobMode.fx[3]:
            return Ctrl.eqLow;
        case KnobMode.gain:
            return Ctrl.filter;
    }
}

// "defaultModeFromCtrl" returns the default mode of the given knob control
defaultModeFromCtrl = function (ctrl) {
    switch (ctrl) {
        case Ctrl.eqHigh:
            return KnobMode.eqHigh;
        case Ctrl.eqMiddle:
            return KnobMode.eqMiddle;
        case Ctrl.eqLow:
            return KnobMode.eqLow;
        case Ctrl.filter:
            return KnobMode.filter;
    }
}

// "setKnobMode" changes the knob mode using a "next mode" field so that the change can actually take effect only when the knob has been first centered
// and toggles the related effect (it includes a "forseOff" parameter in order to kill the fx and set the knob mode to default)
setKnobMode = function (knobMode, deckNumber, forceOff) {
    var fxNumber = fxNumberFromKnobMode(knobMode);
    var knobCtrl = ctrlFromMode(knobMode);

    if (scriptData[deckNumber].ctrl[knobCtrl].nextMode != knobMode && !forceOff) {
        scriptData[deckNumber].ctrl[knobCtrl].nextMode = knobMode;
        if (fxNumber != null) {
            engine.setParameter("[EffectRack1_EffectUnit" + (deckNumber + 2) + "_Effect" + fxNumber + "]", "enabled", 1);
        } else {
            scriptData[deckNumber].knobGain = true;
        }
    } else {
        scriptData[deckNumber].ctrl[knobCtrl].nextMode = defaultModeFromCtrl(knobCtrl);
        if (fxNumber != null) {
            engine.setParameter("[EffectRack1_EffectUnit" + (deckNumber + 2) + "_Effect" + fxNumber + "]", "enabled", 0);
        } else {
            scriptData[deckNumber].knobGain = false;
        }
    }
    if (scriptData[deckNumber].ctrl[knobCtrl].centered) {
        scriptData[deckNumber].ctrl[knobCtrl].mode = scriptData[deckNumber].ctrl[knobCtrl].nextMode;
    }
};

// "fxCallback" sets the fx and knobFx leds and changes the fx knob mode if necessary (toggling the knob fx from mixxx ui changes the knob mode too!)
fxCallback = function (value, group, control) {
    var fxNM = fxFromGroup(group);

    if (fxNM[0] > 2) {
        var deckNumber = fxNM[0] - 2;
        var padMode = PadMode.knobFx[fxNM[1]];
        var knobMode = KnobMode.fx[fxNM[1]];
        var knobCtrl = ctrlFromMode(knobMode);

        if (value) {
            scriptData[deckNumber].ctrl[knobCtrl].nextMode = KnobMode.fx[fxNM[1]];
        } else {
            scriptData[deckNumber].ctrl[knobCtrl].nextMode = defaultModeFromCtrl(knobCtrl);
        }
        if (scriptData[deckNumber].ctrl[knobCtrl].centered) {
            scriptData[deckNumber].ctrl[knobCtrl].mode = scriptData[deckNumber].ctrl[knobCtrl].nextMode;
        }

        setPadsLedFromMode(deckNumber, padMode, value);

    } else {
        setPadsLedFromMode(fxNM[0], PadMode.fx[fxNM[1]], value);
    }
}

samplerFromGroup = function (group) {
    const samplerNRegexp = /([0-9]+)/g;
    return +group.match(samplerNRegexp)[0];
};

samplerCallback = function (value, group, control) {
    var samplerNumber = samplerFromGroup(group);

    setPadsLedFromMode(1, PadMode.sampler[samplerNumber], value);
    setPadsLedFromMode(2, PadMode.sampler[samplerNumber], value);
};

samplerCue = function (group, value) {
    if (value) {
        engine.setParameter(group, "cue_gotoandplay", 1);
    } else {
        engine.setParameter(group, "cue_gotoandstop", 1);
    }
};

samplerActivate = function (group, value) {
    if (value) {
        if (!engine.getParameter(group, "play")) {
            engine.setParameter(group, "cue_gotoandplay", 1);
        } else {
            engine.setParameter(group, "cue_gotoandstop", 1);
        }
    }
};

// "PadModeFunctionsArray" is used to fill in "PadModeFunctions" in "DDJ200.init" with the "setStatus" and "eventHandler" functions of every pad mode:
// - "setStatus" sets the leds (often calling the "trigger()" method of a connection)
// - "eventHandler" handles the events
// (too long to comment each function, the behaviour is mostly predictable, I hope...)
var PadModeFunctionsArray = [
    {
        mode: PadMode.hotcue[1],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[1].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 1);
            }
        },
    },
    {
        mode: PadMode.hotcue[2],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[2].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 2);
            }
        },
    },
    {
        mode: PadMode.hotcue[3],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[3].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 3);
            }
        },
    },
    {
        mode: PadMode.hotcue[4],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[4].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 4);
            }
        },
    },
    {
        mode: PadMode.hotcue[5],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[5].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 5);
            }
        },
    },
    {
        mode: PadMode.hotcue[6],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[6].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 6);
            }
        },
    },
    {
        mode: PadMode.hotcue[7],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[7].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 7);
            }
        },
    },
    {
        mode: PadMode.hotcue[8],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].hotcue[8].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setHotcue(deckNumber, 8);
            }
        },
    },
    {
        mode: PadMode.loop[32],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[32].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                print("32");
                setLoopX(deckNumber, 32);
            }
        },
    },
    {
        mode: PadMode.loop[16],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[16].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 16);
            }
        },
    },
    {
        mode: PadMode.loop[8],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[8].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 8);
            }
        },
    },
    {
        mode: PadMode.loop[4],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[4].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 4);
            }
        },
    },
    {
        mode: PadMode.loop[2],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[2].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 2);
            }
        },
    },
    {
        mode: PadMode.loop[1],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[1].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 1);
            }
        },
    },
    {
        mode: PadMode.loop[0.5],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[0.5].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 0.5);
            }
        },
    },
    {
        mode: PadMode.loop[0.25],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[0.25].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                print("0.25");
                setLoopX(deckNumber, 0.25);
            }
        },
    },
    {
        mode: PadMode.loop[0.125],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[0.125].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 0.125);
            }
        },
    },
    {
        mode: PadMode.loop[0.0625],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[0.0625].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 0.0625);
            }
        },
    },
    {
        mode: PadMode.loop[0.03125],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loop[0.03125].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setLoopX(deckNumber, 0.03125);
            }
        },
    },
    {
        mode: PadMode.loopToggle,
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].loopToggle.trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                if (scriptData[0].shift == null && !engine.getParameter("[Channel" + deckNumber + "]", "loop_enabled")) {
                    engine.setParameter("[Channel" + deckNumber + "]", "beatloop_activate", 1);
                    engine.setParameter("[Channel" + deckNumber + "]", "beatloop_activate", 0);
                }
                engine.setParameter("[Channel" + deckNumber + "]", "reloop_toggle", 1);
            }
        },
    },
    {
        mode: PadMode.loopHalve,
        setStatus: function (deckNumber, ctrl) {
            if (engine.getParameter("[Channel" + deckNumber + "]", "loop_halve")) {
                setPadsLedFromMode(deckNumber, PadMode.loopHalve, 1);
            } else {
                setPadsLedFromMode(deckNumber, PadMode.loopHalve, 0);
            }
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                engine.setParameter("[Channel" + deckNumber + "]", "loop_halve", 1);
            } else {
                engine.setParameter("[Channel" + deckNumber + "]", "loop_halve", 0);
            }
        },
    },
    {
        mode: PadMode.loopDouble,
        setStatus: function (deckNumber, ctrl) {
            if (engine.getParameter("[Channel" + deckNumber + "]", "loop_double")) {
                setPadsLedFromMode(deckNumber, PadMode.loopDouble, 1);
            } else {
                setPadsLedFromMode(deckNumber, PadMode.loopDouble, 0);
            }
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                engine.setParameter("[Channel" + deckNumber + "]", "loop_double", 1);
            } else {
                engine.setParameter("[Channel" + deckNumber + "]", "loop_double", 0);
            }
        },
    },
    {
        mode: PadMode.loopInOut,
        setStatus: function (deckNumber, ctrl) {
            if (engine.getParameter("[Channel" + deckNumber + "]", "loop_in") && !engine.getParameter("[Channel" + deckNumber + "]", "loop_out")) {
                setPadsLedFromMode(deckNumber, PadMode.loopInOut, 1);
            } else {
                setPadsLedFromMode(deckNumber, PadMode.loopInOut, 0);
            }
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value && !engine.getParameter("[Channel" + deckNumber + "]", "loop_enabled")) {
                if (engine.getParameter("[Channel" + deckNumber + "]", "loop_in") == 0) {
                    engine.setParameter("[Channel" + deckNumber + "]", "loop_in", 1);
                } else {
                    engine.setParameter("[Channel" + deckNumber + "]", "loop_out", 1);
                }
            }
        },
    },
    {
        mode: PadMode.brake,
        setStatus: function (deckNumber, ctrl) {
            setPadsLedFromMode(deckNumber, PadMode.brake, scriptData[deckNumber].brake);
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                engine.brake(deckNumber, true, 50);
                scriptData[deckNumber].brake = true;
            } else {
                if (scriptData[0].shift != null) {
                    engine.softStart(deckNumber, true, 50);
                } else {
                    engine.brake(deckNumber, false);
                    engine.setParameter("[Channel" + deckNumber + "]", "play", 1);
                }
                scriptData[deckNumber].brake = false;
            }
        },
    },
    {
        mode: PadMode.fx[1],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].fx1.trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            setFx(1, deckNumber, value);
        },
    },
    {
        mode: PadMode.fx[2],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].fx2.trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            setFx(2, deckNumber, value);
        },
    },
    {
        mode: PadMode.fx[3],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].fx3.trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            setFx(3, deckNumber, value);
        },
    },
    {
        mode: PadMode.knobFx[1],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].knobFx1.trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setKnobMode(KnobMode.fx[1], deckNumber);
            }
        },
    },
    {
        mode: PadMode.knobFx[2],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].knobFx2.trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setKnobMode(KnobMode.fx[2], deckNumber);
            }
        },
    },
    {
        mode: PadMode.knobFx[3],
        setStatus: function (deckNumber, ctrl) {
            connections[deckNumber].knobFx3.trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setKnobMode(KnobMode.fx[3], deckNumber);
            }
        },
    },
    {
        mode: PadMode.knobGain,
        setStatus: function (deckNumber, ctrl) {
            setPadsLedFromMode(deckNumber, PadMode.knobGain, scriptData[deckNumber].knobGain);
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                setKnobMode(KnobMode.gain, deckNumber);
            }
        },
    },
    {
        mode: PadMode.killFx,
        setStatus: function (deckNumber, ctrl) {
            setPadsLedFromMode(deckNumber, PadMode.killFx, scriptData[deckNumber].killFx);
        },
        eventHandler: function (deckNumber, ctrl, value) {
            if (value) {
                scriptData[deckNumber].killFx = true;

                for (var i = 1; i <= 3; i++) {
                    setFx(i, deckNumber, 0);
                    setKnobMode(KnobMode.fx[i], deckNumber, true);
                }
            } else {
                scriptData[deckNumber].killFx = false;
            }
        },
    },
    {
        mode: PadMode.sampler[1],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[1].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler1]", value);
        },
    },
    {
        mode: PadMode.sampler[2],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[2].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler2]", value);
        },
    },
    {
        mode: PadMode.sampler[3],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[3].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler3]", value);
        },
    },
    {
        mode: PadMode.sampler[4],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[4].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler4]", value);
        },
    },
    {
        mode: PadMode.sampler[5],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[5].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler5]", value);
        },
    },
    {
        mode: PadMode.sampler[6],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[6].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler6]", value);
        },
    },
    {
        mode: PadMode.sampler[7],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[7].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler7]", value);
        },
    },
    {
        mode: PadMode.sampler[8],
        setStatus: function (deckNumber, ctrl) {
            connections[0].sampler[8].trigger();
        },
        eventHandler: function (deckNumber, ctrl, value) {
            samplerActivate("[Sampler8]", value);
        },
    },
];

// "PadModeFunctions" is filled in in the "DDJ200.init" function using "PadModeFunctionsArray"
var PadModeFunctions = {};

// "modeBanks" contains the pad modes banks indexed by pad number (inside the bank array the modes are progressively from Ctrl.pad[1] to Ctrl.pad[8])
var modeBanks = {
    /*
    1: [
        PadMode.hotcue[1],
        PadMode.hotcue[2],
        PadMode.hotcue[3],
        PadMode.hotcue[4],
        PadMode.hotcue[5],
        PadMode.hotcue[6],
        PadMode.hotcue[7],
        PadMode.hotcue[8],
    ],
    2: [
        PadMode.loop[4],
        PadMode.loop[1],
        PadMode.loop[0.03125],
        PadMode.brake,
        PadMode.loopHalve,
        PadMode.loopToggle,
        PadMode.loopDouble,
        PadMode.loopInOut,
    ],
    3: [
        PadMode.loop[32],
        PadMode.loop[16],
        PadMode.loop[8],
        PadMode.loop[4],
        PadMode.loop[2],
        PadMode.loop[1],
        PadMode.loop[0.5],
        PadMode.loop[0.25],
    ],
    4: [
        PadMode.fx[1],
        PadMode.fx[2],
        PadMode.fx[3],
        PadMode.killFx,
        PadMode.knobFx[1],
        PadMode.knobFx[2],
        PadMode.knobFx[3],
        PadMode.knobGain,
    ],
    5: [
        PadMode.sampler[1],
        PadMode.sampler[2],
        PadMode.sampler[3],
        PadMode.sampler[4],
        PadMode.sampler[5],
        PadMode.sampler[6],
        PadMode.sampler[7],
        PadMode.sampler[8],
    ],
    */
    1: [
        PadMode.hotcue[1],
        PadMode.hotcue[2],
        PadMode.hotcue[3],
        PadMode.hotcue[4],
        PadMode.fx[1],
        PadMode.knobFx[2],
        PadMode.knobFx[3],
        PadMode.killFx,
    ],
    2: [
        PadMode.sampler[1],
        PadMode.sampler[2],
        PadMode.sampler[3],
        PadMode.sampler[4],
        PadMode.sampler[5],
        PadMode.sampler[6],
        PadMode.sampler[7],
        PadMode.sampler[8],
    ],
    5: [
        PadMode.sampler[1],
        PadMode.sampler[2],
        PadMode.sampler[3],
        PadMode.sampler[4],
        PadMode.sampler[5],
        PadMode.sampler[6],
        PadMode.sampler[7],
        PadMode.sampler[8],
    ],
    6: [
        PadMode.loop[4],
        PadMode.loop[1],
        PadMode.loop[0.03125],
        PadMode.brake,
        PadMode.loopHalve,
        PadMode.loopToggle,
        PadMode.loopDouble,
        PadMode.loopInOut,
    ],
    7: [
        PadMode.loop[32],
        PadMode.loop[16],
        PadMode.loop[8],
        PadMode.loop[4],
        PadMode.loop[2],
        PadMode.loop[1],
        PadMode.loop[0.5],
        PadMode.loop[0.25],
    ],
    8: [
        PadMode.fx[1],
        PadMode.fx[2],
        PadMode.fx[3],
        PadMode.killFx,
        PadMode.knobFx[1],
        PadMode.knobFx[2],
        PadMode.knobFx[3],
        PadMode.knobGain,
    ]
};

// "padsIgnoreReleases" sets the "ignoreRelease" field of every pad to "true", necessary when changing mode if a button remains pressed
padsIgnoreReleases = function () {
    for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
        for (var padNumber = 1; padNumber <= 8; padNumber++) {
            scriptData[deckNumber].ctrl[Ctrl.pad[padNumber]].ignoreRelease = true;
        }
    }
};

// "setPadsStatus" is filled in with the next three functions (indexed by general mode)...
var setPadsStatus = {};

// "setPadsStatus[GeneralMode.normal]" is called when switching to "normal" mode, it sets every leds
// and makes sure that the "kill fx" mode doesn't remain active after the mode change (it's the only mode that doesn't store any status info...) 
setPadsStatus[GeneralMode.normal] = function () {
    // #IMPROVE
    print("MMMMH...");

    for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
        scriptData[deckNumber].killFx = false;

        for (var padNumber = 1; padNumber <= 8; padNumber++) {
            PadModeFunctions[scriptData[deckNumber].ctrl[Ctrl.pad[padNumber]].mode].setStatus(deckNumber, Ctrl.pad[padNumber]);
        }
    }
};

// "setPadsStatus[GeneralMode.master]" is called when switching to "master" mode, it sets every leds
// #IMPROVE
setPadsStatus[GeneralMode.master] = function () {
    for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
        for (var padNumber = 1; padNumber <= 8; padNumber++) {
            setLed(deckNumber, Ctrl.pad[padNumber], false);
        }

        connections[deckNumber].loadIndicator.trigger();
    }
};

// "setPadsStatus[GeneralMode.choosePadMode]" is called when switching to "choose pad" mode, it sets every leds
setPadsStatus[GeneralMode.choosePadMode] = function () {
    for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
        for (var padNumber = 1; padNumber <= 8; padNumber++) {
            if (padNumber == scriptData[deckNumber].loadedModeBank) {
                setLed(deckNumber, Ctrl.pad[padNumber], true);
            } else {
                setLed(deckNumber, Ctrl.pad[padNumber], false);
            }
        }
    }
};

// "stopTransition" stops any active transition and its related timer, setting the pads status if asked to  
stopTransition = function (setStatus) {
    if (scriptData[0].transitionID != null) {
        engine.stopTimer(scriptData[0].transitionID);
        scriptData[0].transitionID = null;
        scriptData[0].transitionCounter = 0;

        if (setStatus) {
            setPadsStatus[scriptData[0].generalMode]();
        }
    }
};

// "masterTransition" creates the transition performed when switching to "master" mode (first stopping any active transition), 
// it consists in two fast blinks of every pad
masterTransition = function () {
    stopTransition(false);
    scriptData[0].transitionID = engine.beginTimer(MASTER_TRANSITION_TIME_SPAN_MS, function () {
        for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
            for (var padNumber = 1; padNumber <= 8; padNumber++) {
                setLed(deckNumber, Ctrl.pad[padNumber], 1 - (scriptData[0].transitionCounter % 2));
            }
        }

        scriptData[0].transitionCounter++;
        if (scriptData[0].transitionCounter >= 4) {
            stopTransition(true);
        }
    });
};

// "choosePadModeTransitionChart" defines the leds sequence in "choose pad mode" transition,
// it containes the on/off value (0/1) indexed by deck, pad number and transition counter
var choosePadModeTransitionChart = {
    1: {
        1: [0, 0, 0, 1, 0],
        2: [0, 0, 1, 0, 0],
        3: [0, 1, 0, 0, 0],
        4: [1, 0, 0, 0, 0],
        5: [0, 0, 0, 1, 0],
        6: [0, 0, 1, 0, 0],
        7: [0, 1, 0, 0, 0],
        8: [1, 0, 0, 0, 0],
    },
    2: {
        1: [1, 0, 0, 0, 0],
        2: [0, 1, 0, 0, 0],
        3: [0, 0, 1, 0, 0],
        4: [0, 0, 0, 1, 0],
        5: [1, 0, 0, 0, 0],
        6: [0, 1, 0, 0, 0],
        7: [0, 0, 1, 0, 0],
        8: [0, 0, 0, 1, 0],
    },
};

// "choosePadModeTransition" creates the transition performed when switching to "choose pad" mode (first stopping any active transition), 
// it consists in a swipe from the center to the edges of the controller, on both rows of pads
choosePadModeTransition = function () {
    stopTransition(false);
    scriptData[0].transitionID = engine.beginTimer(CHOOSE_PAD_MODE_TRANSITION_TIME_SPAN_MS, function () {
        for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
            for (var padNumber = 1; padNumber <= 8; padNumber++) {
                setLed(deckNumber, Ctrl.pad[padNumber], choosePadModeTransitionChart[deckNumber][padNumber][scriptData[0].transitionCounter]);
            }
        }

        scriptData[0].transitionCounter++;
        if (scriptData[0].transitionCounter >= 5) {
            stopTransition(true);
        }
    });
};

// "padTransition" creates the transition performed when switching to "normal" mode (first stopping any active transition), 
// it consists in two fast blinks of the pad representing the chosen modes bank (the banks are indexed and chosen by pad number),
// at the end if it, "stopTransition" calls "setPadsStatus" which sets every pad's led (necessary when changing mode)
padTransition = function (deckNumber, litPadNumber) {
    stopTransition(false);
    scriptData[0].transitionID = engine.beginTimer(PAD_TRANSITION_TIME_SPAN_MS, function () {
        for (var padNumber = 1; padNumber <= 8; padNumber++) {
            if (padNumber == litPadNumber) {
                setLed(deckNumber, Ctrl.pad[padNumber], 1 - (scriptData[0].transitionCounter % 2));
            } else {
                setLed(deckNumber, Ctrl.pad[padNumber], false);
            }
            if (padNumber == scriptData[otherDeck[deckNumber]].loadedModeBank) {
                setLed(otherDeck[deckNumber], Ctrl.pad[padNumber], true);
            } else {
                setLed(otherDeck[deckNumber], Ctrl.pad[padNumber], false);
            }
        }

        scriptData[0].transitionCounter++;
        if (scriptData[0].transitionCounter >= 4) {
            stopTransition(true);
        }
    });
};

// "changePadsNormalMode" sets the mode of every pad in a deck to the ones stored in the chosen bank (see "modeBanks")
changePadsNormalMode = function (deckNumber, modeBankNumber) {
    scriptData[deckNumber].loadedModeBank = modeBankNumber;

    for (var padNumber = 1; padNumber <= 8; padNumber++) {
        var i = padNumber - 1;
        scriptData[deckNumber].ctrl[Ctrl.pad[padNumber]].mode = modeBanks[modeBankNumber][i];
    }
};

// "padNormalEventHandler" calls the event handler of the current mode and sets the led status of any pad (in "normal" mode!),
// ignoring a release event if necessary, stopping any active transition and resetting "ignore release" field to false at any "press event" (value == 1)
padNormalEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        scriptData[deckNumber].ctrl[ctrl].ignoreRelease = false;
    }

    if (value || !scriptData[deckNumber].ctrl[ctrl].ignoreRelease) {
        stopTransition(true);

        PadModeFunctions[scriptData[deckNumber].ctrl[ctrl].mode].eventHandler(deckNumber, ctrl, value);
        PadModeFunctions[scriptData[deckNumber].ctrl[ctrl].mode].setStatus(deckNumber, ctrl);
    }
};

// "padChoosePadModeEventHandler" changes the pads mode to the ones stored in "modeBanks" at the pressed pad index,
// then it switches to "normal" mode through a "pad" transition
padChoosePadModeEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        for (var padNumber = 1; padNumber <= 8; padNumber++) {
            if (ctrl == Ctrl.pad[padNumber] && modeBanks[padNumber] !== undefined) {
                changePadsNormalMode(deckNumber, padNumber);
                setChoosePadMode(false, false);
                padTransition(deckNumber, padNumber);
                break;
            }
        }
    }
};

// "padMasterEventHandler" calls the event handler of any pad (in "master" mode!),
// stopping any active transition
padMasterEventHandler = function (deckNumber, ctrl, value) {
    stopTransition(true);

    if (ctrl == Ctrl.pad[1]) {
        pad1MasterEventHandler(deckNumber, ctrl, value);
    }
};

// "pad1MasterEventHandler" is the event handler for Ctrl.pad[1] in "master" mode,
// it loads the selected track (or eject the current track, if shift is pressed)
pad1MasterEventHandler = function (deckNumber, ctrl, value) {
    if (value) {
        if (scriptData[0].shift != null) {
            engine.setParameter("[Channel" + deckNumber + "]", "eject", 1);
            engine.setParameter("[Channel" + deckNumber + "]", "eject", 0);
        } else if (!engine.getParameter("[Channel" + deckNumber + "]", "play")) {
            engine.setParameter("[Channel" + deckNumber + "]", "LoadSelectedTrack", 1);
            setMasterMode(false);
        }
    }
};

// "loadIndicatorCallback" turns on the Ctrl.pad[1] led (only in "master mode"!) 
// when a track can be successfully loaded => when it is neither playing nor cueing
// (indeed, it is connected to the "play" control in mixxx software)
loadIndicatorCallback = function (value, group, control) {
    var deckNumber = script.deckFromGroup(group);

    if (scriptData[0].generalMode == GeneralMode.master) {
        if (value) {
            setLed(deckNumber, Ctrl.pad[1], false);
        } else {
            setLed(deckNumber, Ctrl.pad[1], true);
        }
    }
};

// "ctrlHandlersArray" is used to fill in "ctrlHandlers" in "DDJ200.init" with handler functions
// for every global mode for each ctrl (null if there is no function for that mode)
var ctrlHandlersArray = [
    { ctrl: Ctrl.volume, handlers: normalCtrl(volumeEventHandler) },
    { ctrl: Ctrl.tempo, handlers: normalCtrl(tempoEventHandler) },
    { ctrl: Ctrl.crossfader, handlers: normalCtrl(crossfaderEventHandler) },
    { ctrl: Ctrl.eqHigh, handlers: normalCtrl(knobEventHandler) },
    { ctrl: Ctrl.eqMiddle, handlers: normalCtrl(knobEventHandler) },
    { ctrl: Ctrl.eqLow, handlers: normalCtrl(knobEventHandler) },
    { ctrl: Ctrl.filter, handlers: normalCtrl(knobEventHandler) },
    { ctrl: Ctrl.jogWheelTouch, handlers: normalAndMasterCtrl(function () { }, jogWheelTouchEventHandler) },
    { ctrl: Ctrl.jogWheelTurn, handlers: normalAndMasterCtrl(jogWheelTurnMasterEventHandler, jogWheelTurnEventHandler) },
    { ctrl: Ctrl.play, handlers: normalCtrl(playEventHandler) },
    { ctrl: Ctrl.cue, handlers: normalCtrl(cueEventHandler) },
    { ctrl: Ctrl.shift, handlers: normalCtrl(shiftEventHandler) },
    { ctrl: Ctrl.master, handlers: normalCtrl(masterEventHandler) },
    { ctrl: Ctrl.central, handlers: normalCtrl(centralEventHandler) },
    { ctrl: Ctrl.pfl, handlers: normalCtrl(pflEventHandler) },
    { ctrl: Ctrl.sync, handlers: normalCtrl(syncEventHandler) },
    { ctrl: Ctrl.pad[1], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
    { ctrl: Ctrl.pad[2], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
    { ctrl: Ctrl.pad[3], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
    { ctrl: Ctrl.pad[4], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
    { ctrl: Ctrl.pad[5], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
    { ctrl: Ctrl.pad[6], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
    { ctrl: Ctrl.pad[7], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
    { ctrl: Ctrl.pad[8], handlers: pad(padMasterEventHandler, padChoosePadModeEventHandler, padNormalEventHandler) },
];

// "ctrlHandlers" is filled in in "DDJ200.init" function using "ctrlHandlersArray"
var ctrlHandlers = {};

// "DDJ200.init" is called at start up,
// it fills in data objects and starts the timer which sets "play" and "cue" leds
DDJ200.init = function () {
    // filling in "midiCtrl"
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

    // filling in "scriptData"
    for (var i = 0; i < modeArray.length; i++) {
        scriptData[1].ctrl[modeArray[i].ctrl] = {};
        scriptData[2].ctrl[modeArray[i].ctrl] = {};
        scriptData[1].ctrl[modeArray[i].ctrl].mode = modeArray[i].mode;
        scriptData[2].ctrl[modeArray[i].ctrl].mode = modeArray[i].mode;

        var padNumbers = Object.keys(Ctrl.pad);
        for (var pad_i = 0; pad_i < padNumbers.length; pad_i++) {
            if (modeArray[i].ctrl == Ctrl.pad[padNumbers[pad_i]]) {
                scriptData[1].ctrl[modeArray[i].ctrl].ignoreRelease = true;
                scriptData[2].ctrl[modeArray[i].ctrl].ignoreRelease = true;
            }
        }

        if (modeArray[i].ctrl == Ctrl.eqHigh || modeArray[i].ctrl == Ctrl.eqMiddle || modeArray[i].ctrl == Ctrl.eqLow || modeArray[i].ctrl == Ctrl.filter) {
            scriptData[1].ctrl[modeArray[i].ctrl].centered = true;
            scriptData[2].ctrl[modeArray[i].ctrl].centered = true;
            scriptData[1].ctrl[modeArray[i].ctrl].nextMode = modeArray[i].mode;
            scriptData[2].ctrl[modeArray[i].ctrl].nextMode = modeArray[i].mode;
        }
    }

    // filling in "PadModeFunctions"
    for (var i = 0; i < PadModeFunctionsArray.length; i++) {
        PadModeFunctions[PadModeFunctionsArray[i].mode] = {
            setStatus: PadModeFunctionsArray[i].setStatus,
            eventHandler: PadModeFunctionsArray[i].eventHandler,
        }
    }

    // filling in "connections"
    for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
        connections[deckNumber].pfl = engine.makeConnection('[Channel' + deckNumber + ']', 'pfl', pflCallback);
        connections[deckNumber].pfl.trigger();

        connections[deckNumber].play = engine.makeConnection('[Channel' + deckNumber + ']', 'play_latched', playCallback);
        connections[deckNumber].play.trigger();

        connections[deckNumber].cue = engine.makeConnection('[Channel' + deckNumber + ']', 'cue_default', cueCallback);
        connections[deckNumber].cue.trigger();

        connections[deckNumber].quantize = engine.makeConnection('[Channel' + deckNumber + ']', 'quantize', quantizeCallback);
        connections[deckNumber].quantize.trigger();

        connections[deckNumber].keylock = engine.makeConnection('[Channel' + deckNumber + ']', 'keylock', keylockCallback);
        connections[deckNumber].keylock.trigger();

        connections[deckNumber].loadIndicator = engine.makeConnection('[Channel' + deckNumber + ']', 'play', loadIndicatorCallback);
        connections[deckNumber].loadIndicator.trigger();
        
        connections[deckNumber].hotcue = {};

        for (var hotcueNumber = 1; hotcueNumber <= 8; hotcueNumber++) {
            connections[deckNumber].hotcue[hotcueNumber] = engine.makeConnection('[Channel' + deckNumber + ']', 'hotcue_' + hotcueNumber + '_enabled', hotcueCallback);
            connections[deckNumber].hotcue[hotcueNumber].trigger();
        }

        connections[deckNumber].loop = {};

        var loopXs = Object.keys(PadMode.loop);

        for (var i = 0; i < loopXs.length; i++) {
            var loopX = loopXs[i];
            connections[deckNumber].loop[loopX] = engine.makeConnection('[Channel' + deckNumber + ']', 'beatloop_' + loopX + '_enabled', loopXCallback);
            connections[deckNumber].loop[loopX].trigger();
        }

        connections[deckNumber].loopToggle = engine.makeConnection('[Channel' + deckNumber + ']', 'loop_enabled', loopToggleCallback);
        connections[deckNumber].loopToggle.trigger();

        connections[deckNumber].fx1 = engine.makeConnection('[EffectRack1_EffectUnit' + deckNumber + '_Effect1]', 'enabled', fxCallback);
        connections[deckNumber].fx1.trigger();
        connections[deckNumber].fx2 = engine.makeConnection('[EffectRack1_EffectUnit' + deckNumber + '_Effect2]', 'enabled', fxCallback);
        connections[deckNumber].fx2.trigger();
        connections[deckNumber].fx3 = engine.makeConnection('[EffectRack1_EffectUnit' + deckNumber + '_Effect3]', 'enabled', fxCallback);
        connections[deckNumber].fx3.trigger();

        connections[deckNumber].knobFx1 = engine.makeConnection('[EffectRack1_EffectUnit' + (deckNumber + 2) + '_Effect1]', 'enabled', fxCallback);
        connections[deckNumber].knobFx1.trigger();
        connections[deckNumber].knobFx2 = engine.makeConnection('[EffectRack1_EffectUnit' + (deckNumber + 2) + '_Effect2]', 'enabled', fxCallback);
        connections[deckNumber].knobFx2.trigger();
        connections[deckNumber].knobFx3 = engine.makeConnection('[EffectRack1_EffectUnit' + (deckNumber + 2) + '_Effect3]', 'enabled', fxCallback);
        connections[deckNumber].knobFx3.trigger();
    }

    connections[0].sampler = {};

    for (var samplerNumber = 1; samplerNumber <= 8; samplerNumber++) {
        connections[0].sampler[samplerNumber] = engine.makeConnection('[Sampler' + samplerNumber + ']', 'play', samplerCallback);
        connections[0].sampler[samplerNumber].trigger();
    }


    // filling in "ctrlHandlers"
    for (var i = 0; i < ctrlHandlersArray.length; i++) {
        ctrlHandlers[ctrlHandlersArray[i].ctrl] = ctrlHandlersArray[i].handlers;
    }

    // creating the timer used to set "Ctrl.play" and "Ctrl.cue" leds matching the track status
    //   ( ejected:                     both leds off
    //     stopped on cue / cueing:     "play" blinking, "cue" on
    //     stopped out of cue:          both leds blinking
    //     playing:                     both leds on )
    var counter = 0;
    engine.beginTimer(250, function () {
        var playLedSetting = (counter - (counter % 2)) / 2;
        var cueLedSetting = 1 - (counter % 2);

        for (var deckNumber = 1; deckNumber <= 2; deckNumber++) {
            if (engine.getParameter("[Channel" + deckNumber + "]", "track_samples") == 0) {
                setLed(deckNumber, Ctrl.play, false);
                setLed(deckNumber, Ctrl.cue, false);
            } else {
                if (engine.getParameter("[Channel" + deckNumber + "]", "play") && !scriptData[deckNumber].onCue) {
                    setLed(deckNumber, Ctrl.play, true);
                    setLed(deckNumber, Ctrl.cue, true);
                } else {
                    setLed(deckNumber, Ctrl.play, playLedSetting);
                    if (scriptData[deckNumber].onCue) {
                        setLed(deckNumber, Ctrl.cue, true);
                    } else {
                        setLed(deckNumber, Ctrl.cue, cueLedSetting);
                    }
                }
            }
        }

        counter++;
        if (counter == 4) {
            counter = 0;
        }
    });
};

// "DDJ200.shutdown" is called as a clean up function,
// it turns every led off
DDJ200.shutdown = function () {
    setLedsOff();
};

// "DDJ200.eventHandler" is called to handle any ctrl event (linked in "Pioneer DDJ-200 Advanced.midi.xml" to every "control" section)
// it calls the control's handler for the current mode (see "ctrlHandlers")
DDJ200.eventHandler = function (channel, control, value, status, group) {
    var event = logicCtrl[status][control];

    if (event !== undefined) {
        var handlers = ctrlHandlers[event.ctrl];
        var value = valueHandler(event.deck, event.ctrl, event.valueKind, value);

        if (handlers !== undefined) {
            if (scriptData[0].generalMode == GeneralMode.master && handlers.master != null) {
                handlers.master(event.deck, event.ctrl, value);
            } else if (scriptData[0].generalMode == GeneralMode.choosePadMode && handlers.choosePadMode != null) {
                handlers.choosePadMode(event.deck, event.ctrl, value);
            } else if (handlers.normal != null) {
                handlers.normal(event.deck, event.ctrl, value);
            } else {
                print("eventHandler: NO FUNCTION AVALIABLE FOR THIS CTRL (number " + event.ctrl + ")")
            }
        } else {
            print("eventHandler: UNKNOUN CTRL (number " + event.ctrl + ")");
        }
    } else {
        print("eventHandler: UNDEFINED CONTROL");
    }
};



//////////////-------------End-----///////////////////////////


function dataOut(msg) {
    var hex = [];
    for (var i = 0; i < msg.length; i++) {
        hex.push(msg[i].toString(16));
    }
    logMsg("<<<", hex);
}

function initArray(num, val) {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(val);
    }
    return arr;
}

function init2DArray(x, y, val) {
    var arr = [];
    for (var i = 0; i < x; i++) {
        arr.push(initArray(y, val));
    }
    return arr;
}

function stringToHex(str) {
    return "0x" + Number(str).toString(16);
  }

function getMidiCommands(CommandName) {

    switch (CommandName) {

        case "DAW_MODE_ON":
            return [0x9f, 0x0c, 0x7f]; // DAW mode
            break;
        case "FEATURE_CONTROLS":
            return [0x9F, 0x0B, 0x7F]; // Feature Controls
            break;
        case "DAW_MODE_OFF":
            return [0x9f, 0x0c, 0x00]; // set DAW mode off
            break;
        case "DAW_PADS":
            return [0xb6, 0x1d, 0x02];
            break;
        case "DAW_FADERS":
            return [0xb6, 0x1f, 0x01];
            break;
        case "DAW_ENCODERS":
            return [0xb6, 0x1e, 0x02];
            break;
        case "DRUMRACK_OWNERSHIP":
            return [0xb6, 0x54, 0x7f];
            break;
        case "NOTE_REDIRECT_ON":
            return [0xB6, 0x4C, 0x7F];
            break;
        case "NOTE_REDIRECT_OFF":
            return [0xB6, 0x4C, 0x00];
            break;
        case "DAW_14_Bit_OFF_Faders_OFF":
            return [0xB6, 0x44, 0x00];
            break;
        case "DAW_14_Bit_OFF_Faders_Pickup":
            return [0xB6, 0x46, 0x00];
            break;
        case "DAW_14_Bit_OFF_Encoders_OFF":
            return [0xB6, 0x45, 0x00];
            break;
        case "DAW_14_Bit_OFF_DrumPads_OFF":
            return [0xB6, 0x54, 0x00];
            break;
        case "FORCE_MIDI_TO_CHANNEL_ONE":
            return [0xF0, 0x00, 0x20, 0x29, 0x02, 0x14, 0x10, 0x00, 0x01, 0xF7];
            break;


    }



}



function getColorHexValue(color) {
    switch (color) {
        case 'Off':
            return 0x00;
        case 'Dark Red':
            return 0x01;
        case 'Red':
            return 0x05;
        case 'Bright Red':
            return 0x09;
        case 'Orange':
            return 0x0D;
        case 'Yellow':
            return 0x11;
        case 'Bright Yellow':
            return 0x15;
        case 'Light Green':
            return 0x19;
        case 'Green':
            return 0x1D;
        case 'Bright Green':
            return 0x21;
        case 'Cyan':
            return 0x25;
        case 'Bright Cyan':
            return 0x29;
        case 'Blue':
            return 0x2D;
        case 'Bright Blue':
            return 0x31;
        case 'Purple':
            return 0x45;
        case 'Bright Purple':
            return 0x39;
        case 'Pink':
            return 0x3D;
        case 'Bright Pink':
            return 0x41;
        case 'White':
            return 0x4D;
        default:
            return null;
    }
}


function LightUpPads(val_padid, val_color, val_status) {

    //Array value to send back
    return_array = [];

    //Represents the Hexcode Values for the Pads 1-16 ()
    padmatrix = [0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77];

    padidmsg = padmatrix[val_padid - 1];

    //Determines how the Pad should be lit
    pad_status_msg = 0x90;
    switch (val_status) {
        case "ON":
            pad_status_msg = 0x90;
            break;
        case "PULSATE":
            pad_status_msg = 0x90;
            break;
    }

    //Determines the Hexcode for the Pad
    colormsg = getColorHexValue(val_color);

    return_array.push(pad_status_msg);
    return_array.push(padidmsg);
    return_array.push(colormsg);

    sendMidiToDevice(return_array);
    //dataOut(return_array);

}


function displayTextOnMk4(text) {
    // Convert text string into array of ASCII values
    var textBytes = [];
    for (var i = 0; i < text.length; i++) {
        textBytes[i] = text.charCodeAt(i);
    }

    // Create message arrays with explicit values
    // Standard MK4 header: F0 00 20 29 02 14
    var header = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x14];

    // First configure the display for single line text (arrangement 1)
    var configMessage = [
        0xF0, 0x00, 0x20, 0x29, 0x02, 0x14,  // Header
        0x04,                                 // Configure display command
        0x21,                                 // Global temporary display target
        0x01,                                 // Single line arrangement
        0xF7                                  // End of SysEx
    ];

    // Build the text message
    var textMessage = [
        0xF0, 0x00, 0x20, 0x29, 0x02, 0x14,  // Header
        0x06,                                 // Set text command
        0x21,                                 // Global temporary display target
        0x00                                  // First text field
    ];

    // Add each byte of the text
    for (var j = 0; j < textBytes.length; j++) {
        textMessage.push(textBytes[j]);
    }

    // Add SysEx end
    textMessage.push(0xF7);

    // Trigger message
    var triggerMessage = [
        0xF0, 0x00, 0x20, 0x29, 0x02, 0x14,  // Header
        0x04,                                 // Configure display command
        0x21,                                 // Global temporary display target
        0x7F,                                 // Trigger display
        0xF7                                  // End of SysEx
    ];

    // Send all messages in sequence
    sendMidiToDevice(configMessage);
    sendMidiToDevice(textMessage);
    sendMidiToDevice(triggerMessage);
}

function wepause(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {
        // Busy-wait loop
    }
}


function SplashScreen() {

    for (var i = 1; i <= 16; i++) {
        LightUpPads(i, 'Purple', 'ON');
        wepause(100);

    }
    for (var i = 16; i >= 1; i--) {
        LightUpPads(i, 'Off', 'ON');
        wepause(100);

    }
}

function hueToHex(color) {
    const colorMap = {
        0: 0x00, 1: 0x05, 2: 0x05, 3: 0x09,
        4: 0x09, 5: 0x0D, 6: 0x0D, 7: 0x15,
        8: 0x15, 9: 0x21, 10: 0x25, 11: 0x29,
        12: 0x29, 13: 0x2D, 14: 0x2D, 15: 0x31,
        16: 0x31, 17: 0x35, 18: 0x39
    };
    return colorMap[color] || 0x00;
}



function NovationLaunchKey49() {
    // Variables: these must be filled out so the session knows your controller layout
    this.deviceDescription = "Novation Launchkey MK4";        // device name
    this.needsMidiChannel = true;                            // send midi controller to daw
    this.needsMidiBackChannel = true;                            // send midi daw to controller
    //this.midiChannelName = "midiin_177461";             // MIDI channel name
    //this.midiBackChannelName = "midiin_177462";             // MIDI channel name
    this.midiChannelName = "Launchkey MK4 49 Launchkey MK4 ";
    this.midiBackChannelName = "Launchkey MK4 49 Launchkey MK4 ";

    this.needsOSCSocket = false;                           // communicate via osc
    this.numberOfFaderChannels = 8;                               // number physical faders      
    this.numberOfTrackPads = 16;                               // number physical pads per channel
    this.numCharactersForTrackNames = 0;                               // characters of channel text
    this.numCharactersForAuxLabels = 0;                               // characters of aux text
    this.numParameterControls = 8;                               // number of labelled rotary dials that can control things like plugin parameters
    this.numCharactersForParameterLabels = 0;                               // characters for rotary dials
    this.wantsClock = true;                            // device wants MIDI clock
    this.allowBankingOffEnd = false;                           // allow surface to display blank channels
    this.numMarkers = 0;                               // number of markers that can be displayed
    this.numCharactersForMarkerLabels = 0;                               // characters for markers
    this.wantsAuxBanks = false;                           // display auxes
    this.numAuxes = 0;                               // number of auxes that can be displayed
    this.followsTrackSelection = false;                           // controller track follows UI selection
    this.cliplauncher = false;                            // this controller is primarily a clip launcher
    this.auxmode = "byposition";                    // Aux index is either 'bybus' (-1 any) or 'byposition'
    this.pickUpMode = true;                            // input value must cross current value before input is accepted
    // useful for non motorized faders, so the don't jump when adjusted



    // State variables
    this.screen = "session";
    this.sessionMode = "launch";
    this.knobMode = "device";
    this.faderMode = "send1";
    this.buttonMode = "arm";
    this.shift = false;
    this.ledCache = init2DArray(8, 8, -1);
    this.stateCache = init2DArray(8, 8, -1);
    this.soloCache = initArray(8, false);
    this.muteCache = initArray(8, false);
    this.selectCache = initArray(8, false);
    this.armCache = initArray(8, false);




    this.initialise = function () {
    }

    this.initialiseDevice = function () { //This is run once the Device Directly Connects to the Device
        sendMidiToDevice(getMidiCommands('DAW_MODE_OFF'));
        wepause(1000);
        //Turn on DAW MODE (Borrowed from the Cubase Implementation for this Controller)
        //sendMidiToDevice([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]); // device inquiry
        sendMidiToDevice(getMidiCommands('DAW_MODE_ON')); // DAW mode
        wepause(100);
        sendMidiToDevice(getMidiCommands('FEATURE_CONTROLS'));
        
        //sendMidiToDevice(getMidiCommands('DAW_PADS')); 
        wepause(100);
        //sendMidiToDefaultDevice(getMidiCommands('DAW_FADERS')); // Faders = Volume
        wepause(100);
        //sendMidiToDefaultDevice(getMidiCommands('DAW_ENCODERS'));
        wepause(100);
        //sendMidiToDefaultDevice(getMidiCommands('PERFORMANCE_MODE_OFF'));
        //sendMidiToDefaultDevice(getMidiCommands('DRUMRACK_OWNERSHIP'));




        displayTextOnMk4('Waveform');



        //Turn on the Buttons -- Light Up the LEDS
        sendMidiToDevice([0xb3, 0x4a, 127]); // Capture MIDI
        sendMidiToDevice([0xb3, 0x4b, 127]); // Quantize
        sendMidiToDevice([0xb3, 0x4d, 127]); // Undo
        sendMidiToDevice([0xb3, 0x67, 127]); // Track Left
        sendMidiToDevice([0xb3, 0x66, 127]); // Track right

       
        //sendMidiToDevice(getMidiCommands('NOTE_REDIRECT_ON'));
        //sendMidiToDevice(getMidiCommands('DAW_14_Bit_OFF_Faders_OFF'));
        //sendMidiToDevice(getMidiCommands('DAW_14_Bit_OFF_Encoders_OFF'));
        //sendMidiToDevice(getMidiCommands('DAW_14_Bit_OFF_DrumPads_OFF'));
        //sendMidiToDevice(getMidiCommands('DAW_14_Bit_OFF_Faders_Pickup'));
        //SendMidiToDevice(getMidiCommands('FORCE_MIDI_TO_CHANNEL_ONE'));

        //InitiateSplashSequence();
        SplashScreen();

        this.ledCache = init2DArray(8, 8, -1);
        this.soloCache = initArray(8, false);
        this.muteCache = initArray(8, false);
        this.selectCache = initArray(8, false);
        this.armCache = initArray(8, false);

        this.updateScreen();
    }


    this.shutDownDevice = function () {
        //sendMidiToDevice([0xb6, 0x54, 0x00]); // Release drumrack ownership
        sendMidiToDevice(getMidiCommands('DAW_MODE_OFF')); // set DAW mode off

    }
    
    this.updateSession = function (pad) {
        displayTextOnMk4('Update Session');
        for (var ch = 0; ch < 8; ch++) {
            var value = this.ledCache[ch][pad];
            var state = Math.floor(value / 100);
            var color = Math.floor(value % 100);
            var note = 0x60 + (pad * 0x10) + ch;
            var col = hueToHex(color);

            switch (state) {
                case 0:
                    sendMidiToDevice([0x90, note, col]);
                    break;
                case 1:
                    sendMidiToDevice([0x90, note, col]);
                    sendMidiToDevice([0x91, note, 0x00]);
                    break;
                case 2:
                    sendMidiToDevice([0x92, note, col]);
                    break;
            }
        }
    }
    
     this.updateScreen = function () {
       if (this.screen == "session") {
            this.updateSession(0);

            if (this.sessionMode == "launch") {
                this.updateSession(1);
                sendMidiToDevice([0xb0, 0x69, 0x03]);
            } else if (this.sessionMode == "stop") {
                sendMidiToDevice([0xb0, 0x69, 0x07]);
                for (var t = 0; t < 8; t++)
                    sendMidiToDevice([0x90, 0x70 + t, 0x07]);
            } else if (this.sessionMode == "solo") {
                sendMidiToDevice([0xb0, 0x69, 0x57]);
                for (var t = 0; t < 8; t++)
                    sendMidiToDevice([0x90, 0x70 + t, this.soloCache[t] ? 0x57 : 0x01]);
            } else if (this.sessionMode == "mute") {
                sendMidiToDevice([0xb0, 0x69, 0x05]);
                for (var t = 0; t < 8; t++)
                    sendMidiToDevice([0x90, 0x70 + t, this.muteCache[t] ? 0x05 : 0x01]);
            }
        } else if (this.screen == "drum") {
            sendMidiToDevice([0xb0, 0x69, 0x00]);
            for (var t = 0; t < 4; t++) {
                sendMidiToDevice([0x99, 0x28 + t, 0x27]);
                sendMidiToDevice([0x99, 0x30 + t, 0x27]);
                sendMidiToDevice([0x99, 0x24 + t, 0x27]);
                sendMidiToDevice([0x99, 0x2C + t, 0x27]);
            }
        }

        // Update arm/select button LEDs
        if (this.buttonMode == "arm") {
            sendMidiToDevice([0xbf, 0x2d, 0x50]);
            for (var i = 0; i < 8; i++)
                sendMidiToDevice([0xbf, 0x25 + i, this.armCache[i] ? 0x50 : 0x27]);
        } else {
            sendMidiToDevice([0xbf, 0x2d, 0x27]);
            for (var i = 0; i < 8; i++)
                sendMidiToDevice([0xbf, 0x25 + i, this.selectCache[i] ? 0x50 : 0x27]);
        }
    }

    //COMMANDS COMING FROM KEYBOARD
    
    this.onMidiReceivedFromDevice = function (msg) {
        

        
        var d0=msg[0];
        var d1=msg[1];
        var d2=msg[2];
        displayTextOnMk4('MIDI Received');
        
        trythis1=stringToHex(d0.toString);
        d0sting=d0.toString();
        displayTextOnMk4(d0sting);
        // Handle drum pad messages
        if (trythis1 == '0x99') {
            sendMidiToDefaultDevice(msg);
            displayTextOnMk4('Drum Hit');
            return;
        }

        // Handle mode changes and control messages
        if (d0 == 0xbf) {
            if (d1 == 0x03) {
                switch (d2) {
                    case 2: this.screen = "session"; break;
                    case 1: this.screen = "drum"; break;
                    case 5: this.screen = "custom"; break;
                }
                triggerAsyncUpdate();
            }
            else if (d1 == 0x09) {
                // Encoder mode selection
                switch (d2) {
                    case 2: this.knobMode = "device"; break;
                    case 1: this.knobMode = "volume"; break;
                    case 3: this.knobMode = "pan"; break;
                    case 4: this.knobMode = "send1"; break;
                    case 5: this.knobMode = "send2"; break;
                    case 6:
                    case 7:
                    case 8:
                    case 9: this.knobMode = "custom"; break;
                }
                triggerAsyncUpdate();
            }
            else if (d1 == 0x0a) {
                // Fader mode selection
                switch (d2) {
                    case 2: this.faderMode = "device"; break;
                    case 1: this.faderMode = "volume"; break;
                    case 3: this.faderMode = "pan"; break;
                    case 4: this.faderMode = "send1"; break;
                    case 5: this.faderMode = "send2"; break;
                    case 6:
                    case 7:
                    case 8:
                    case 9: this.faderMode = "custom"; break;
                }
                triggerAsyncUpdate();
            }
            // Handle encoder controls (0x15-0x1c)
            else if (d1 >= 0x15 && d1 <= 0x1c) {
                const channel = d1 - 0x15;
                const value = d2 / 127.0;

                switch (this.knobMode) {
                    case "volume":
                        setFader(channel, value, false);
                        break;
                    case "pan":
                        setPanPot(channel, value * 2 - 1, false);
                        break;
                    case "send1":
                        setAux(channel, 0, value);
                        break;
                    case "send2":
                        setAux(channel, 1, value);
                        break;
                    case "device":
                        setParameter(channel, value);
                        break;
                }
            }
            // Handle fader controls (0x35-0x3c)
            else if (d1 >= 0x35 && d1 <= 0x3c) {
                const channel = d1 - 0x35;
                const value = d2 / 127.0;

                switch (this.faderMode) {
                    case "volume":
                        setFader(channel, value, false);
                        break;
                    case "pan":
                        setPanPot(channel, value * 2 - 1, false);
                        break;
                    case "send1":
                        setAux(channel, 0, value);
                        break;
                    case "send2":
                        setAux(channel, 1, value);
                        break;
                    case "device":
                        setParameter(channel, value);
                        break;
                }
            }
            // Handle master fader
            else if (d1 == 0x3d) {
                setMasterLevelFader(d2 / 127.0);
            }
            // Handle bank navigation
            else if (d1 == 0x67 && d2 == 0x7f) {
                changeFaderBanks(-1);
                sendMidiToDevice([0xb0, d1, 0x03]);
            }
            else if (d1 == 0x66 && d2 == 0x7f) {
                changeFaderBanks(1);
                sendMidiToDevice([0xb0, d1, 0x03]);
            }
            else if (d1 == 0x68 && d2 == 0x7f) {
                changePadBanks(-1);
                sendMidiToDevice([0xb0, d1, 0x03]);
            }
            else if (d1 == 0x69 && d2 == 0x7f) {
                changePadBanks(1);
                sendMidiToDevice([0xb0, d1, 0x03]);
            }
            // Handle track selection/arm buttons
            else if (d1 >= 0x25 && d1 <= 0x2c && d2 == 0x7f) {
                const channel = d1 - 0x25;
                if (this.buttonMode == "arm") {
                    toggleRecEnable(channel);
                } else {
                    selectTrack(channel);
                }
            }
            // Handle arm/select mode toggle
            else if (d1 == 0x2d && d2 == 0x7f) {
                this.buttonMode = this.buttonMode == "arm" ? "select" : "arm";
                triggerAsyncUpdate();
            }
        }

        // Handle transport controls and other buttons
        if (d0 == 0xb0) {
            if (d1 == 0x6c) {
                this.shift = d2 == 0x7f;
            }
            if (!this.shift) {


                if (d1 == 0x68 && d2 == 0x7f) {
                    if (this.screen == "session") {
                        launchScene(0);
                    }
                }
                else if (d1 == 0x69 && d2 == 0x7f) {
                    if (this.screen == "session") {
                        // Cycle through session modes
                        switch (this.sessionMode) {
                            case "launch": this.sessionMode = "stop"; break;
                            case "stop": this.sessionMode = "solo"; break;
                            case "solo": this.sessionMode = "mute"; break;
                            case "mute": this.sessionMode = "launch"; break;
                        }
                        triggerAsyncUpdate();
                    }
                }
            }
        }

        // Handle transport and global controls
        if (d0 == 0xbf) {
            if (!this.shift) {
                switch (d1) {
                    case 0x73: // Play
                        if (d2 == 0x7f) play();
                        break;
                    case 0x74: // Stop
                        if (d2 == 0x7f) stop();
                        break;
                    case 0x75: // Record
                        if (d2 == 0x7f) record();
                        break;
                    case 0x76: // Loop
                        if (d2 == 0x7f) toggleLoop();
                        break;
                    case 0x4c: // Click
                        if (d2 == 0x7f) toggleClick();
                        break;
                    case 0x4d: // Undo
                        if (d2 == 0x7f) undo();
                        break;
                }
            }
        }

        // Handle pad presses
        if (d0 == 0x90) {
            if (!this.shift) {
                // Handle main grid pads (first row)
                if (d1 >= 0x60 && d1 <= 0x67 && d2 > 0x00) {
                    if (this.screen == "session") {
                        launchClip(d1 - 0x60, 0);
                    }
                }
                // Handle second row pads
                else if (d1 >= 0x70 && d1 <= 0x77 && d2 > 0x00) {
                    if (this.screen == "session") {
                        switch (this.sessionMode) {
                            case "launch":
                                launchClip(d1 - 0x70, 1);
                                break;
                            case "stop":
                                stopClip(d1 - 0x70);
                                break;
                            case "solo":
                                toggleSolo(d1 - 0x70);
                                break;
                            case "mute":
                                toggleMute(d1 - 0x70, false);
                                break;
                        }
                    }
                }
            }
        }
    }

    this.onSoloMuteChanged = function (channelNum, muteAndSoloLightState, isBright) {
        const soloLit = 1;
        const soloFlashing = 2;
        const soloIsolate = 4;
        const muteLit = 8;
        const muteFlashing = 16;

        this.soloCache[channelNum] = (muteAndSoloLightState & soloLit) != 0 ||
            (isBright && (muteAndSoloLightState & soloFlashing) != 0);
        this.muteCache[channelNum] = (muteAndSoloLightState & muteLit) != 0 ||
            (isBright && (muteAndSoloLightState & muteFlashing) != 0);

        triggerAsyncUpdate();
    }

    this.onTrackSelectionChanged = function (channel, isSelected) {
        this.selectCache[channel] = isSelected;
        triggerAsyncUpdate();
    }

    this.onTrackRecordEnabled = function (channel, isEnabled) {
        this.armCache[channel] = isEnabled;
        triggerAsyncUpdate();
    }

    this.onTimer = function (name) {
        // Handle any timer-based updates if needed
    }

    this.onUpdateMiscFeatures = function () {
        // Handle miscellaneous feature updates
    }

    this.onPlayStateChanged = function (isPlaying) {
        sendMidiToDevice([0xb0, 0x73, isPlaying ? 0x15 : 0x00]);
    }

    this.onRecordStateChanged = function (isRecording) {
        sendMidiToDevice([0xb0, 0x75, isRecording ? 0x15 : 0x00]);
    }

    this.onAsyncUpdate = function () {
        this.updateScreen();
    }

    this.onPadStateChanged = function (channel, pad, color, state) {
        const val = state * 100 + color;
        if (this.ledCache[channel][pad] == val) return;

        this.ledCache[channel][pad] = val;
        const note = 0x60 + (pad * 0x10) + channel;
        const col = hueToHex(color);

        if (this.screen == "session" && (this.sessionMode == "launch" || pad < 1)) {
            switch (state) {
                case 0:
                    sendMidiToDevice([0x90, note, col]);
                    break;
                case 1:
                    sendMidiToDevice([0x90, note, col]);
                    sendMidiToDevice([0x91, note, 0x00]);
                    break;
                case 2:
                    sendMidiToDevice([0x92, note, col]);
                    break;
            }
        }
    }





    
    this.eatsAllMessages = function () {
        return true;
    }
    this.wantsMessage = function (msg) {
        return true;
    }

    // Are plugin params visible on controller
    this.isShowingPluginParams = function () {
        return true;
    }

    // Are tracks showing on the controller 
    this.isShowingTracks = function () {
        return true;
    }


    this.onTimer = function (name) {
    }

    this.onUpdateMiscFeatures = function () {
    }


    this.onAsyncUpdate = function () {
        this.updateScreen();
    }




}

registerController(new NovationLaunchKey49());
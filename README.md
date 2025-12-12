# Cboard Speech TTS Plugin

W3C Web Speech API - Speech synthesis plugin for Cordova/PhoneGap applications, specifically designed for the Cboard mobile app and assistive communication tools.

## Project Information

- **Project Name:** cboard-speech-tts
- **Version:** 0.1.0
- **License:** GPL-3.0-only
- **Author:** Martin Bedouret
- **Repository:** https://github.com/cboard-org/cboard-speech-tts
- **Platform:** Cordova/PhoneGap Plugin
- **Current Platform Support:** Android only

## Purpose and Goals

This plugin provides a robust, cross-platform text-to-speech solution that implements the W3C Web Speech API standards for hybrid mobile applications, with a specific focus on assistive and augmentative communication (AAC) applications.


## Installation

### Cordova

Using the command line tools run:

```bash
cordova plugin add https://github.com/cboard-org/cboard-speech-tts.git
# or
phonegap plugin add https://github.com/cboard-org/cboard-speech-tts.git
```

For local development:
```bash
cordova plugin add /path/to/cboard-speech-tts
```

## Usage

### Basic Speech Synthesis

```javascript
function speakText() {
    var utterance = new SpeechSynthesisUtterance();
    utterance.text = "Hello, this is a test of the speech synthesis system";
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Set up event handlers
    utterance.onstart = function(event) {
        console.log('Speech started');
    };

    utterance.onend = function(event) {
        console.log('Speech ended');
    };

    // Speak the text
    speechSynthesis.speak(utterance);
}
```

### Voice Ready Detection

The plugin fires a `voiceschanged` event when voices become available, following the W3C Web Speech API specification.

```javascript
// Using addEventListener (recommended)
speechSynthesis.addEventListener('voiceschanged', function() {
  const voices = speechSynthesis.getVoices();
  console.log('Voices are ready:', voices.length);
  // voices is a SpeechSynthesisVoiceList object, not a plain array
  for (var i = 0; i < voices.length; i++) {
    console.log(voices.item(i).name);
  }
});

// Using property handler
speechSynthesis.onvoiceschanged = function() {
  console.log('Voices changed!');
  const voices = speechSynthesis.getVoices();
  // Handle voice updates
};
```

### Voice and Engine Management

```javascript
// Get available voices (returns SpeechSynthesisVoiceList object)
var voices = speechSynthesis.getVoices();
console.log('Number of voices:', voices.length);

// Iterate through voices using the item() method
for (var i = 0; i < voices.length; i++) {
    var voice = voices.item(i);
    console.log(i + ': ' + voice.name + ' (' + voice.lang + ')');
}

// Get available engines
var engines = speechSynthesis.getEngines();
console.log('Available engines:', engines);

// Get default engine
var defaultEngine = speechSynthesis.getDefaultEngine();
console.log('Default engine:', defaultEngine);

// Switch TTS engine and get notified when new voices are ready
speechSynthesis.addEventListener('voiceschanged', function() {
  console.log('Engine changed, new voices available');
});
speechSynthesis.setEngine('com.google.android.tts');
```

### SpeechSynthesisVoiceList Object

The `getVoices()` method returns a `SpeechSynthesisVoiceList` object, not a plain JavaScript array. This object provides:

- **`length`** - Number of available voices
- **`item(index)`** - Get voice at specific index
- **`_list`** - Internal array containing the actual voice data

```javascript
var voices = speechSynthesis.getVoices();

// Method 1: Using the official item() method
var firstVoice = voices.item(0);
var secondVoice = voices.item(1);

// Method 2: Direct access to internal array (more flexible)
var voicesArray = voices._list;
console.log('Voice count:', voicesArray.length);

// Now you can use standard array methods
voicesArray.forEach(function(voice, index) {
    console.log(index + ': ' + voice.name + ' (' + voice.lang + ')');
});

// Or use array methods like filter, map, etc.
var englishVoices = voicesArray.filter(function(voice) {
    return voice.lang.startsWith('en');
});

// Direct array access
var firstVoice = voicesArray[0];
var lastVoice = voicesArray[voicesArray.length - 1];
```

### Speech Control

```javascript
// Cancel current speech
speechSynthesis.cancel();

// Pause speech
speechSynthesis.pause();

// Resume speech
speechSynthesis.resume();
```

## Technical Architecture

### Technology Stack

#### Frontend/Interface Layer
- **Language:** JavaScript (ES5)
- **Module System:** CommonJS (require/module.exports)
- **API Standard:** W3C Web Speech API Speech Synthesis

#### Backend/Native Layer
- **Android:** Java
- **Integration:** Apache Cordova Plugin Architecture
- **TTS Engine:** Android TextToSpeech API

### Core Components

#### JavaScript Interface Layer (`www/` directory)
- **SpeechSynthesis.js** - Main controller and API entry point
- **SpeechSynthesisUtterance.js** - Speech text and configuration management
- **SpeechSynthesisVoice.js** - Individual voice representation
- **SpeechSynthesisVoiceList.js** - Voice collection management
- **SpeechSynthesisEngine.js** - TTS engine representation
- **SpeechSynthesisEngineList.js** - Engine collection management
- **SpeechSynthesisEvent.js** - Event object definitions

#### Native Implementation Layer
- **Android Implementation:** `src/android/SpeechSynthesis.java`
  - Complete integration with Android TextToSpeech API
  - Voice enumeration and selection
  - Engine switching and management
  - Event callback handling

### Plugin Configuration
- **Plugin ID:** cordova-plugin-cboard-speech-tts
- **Namespace:** org.apache.cordova.speech
- **Global Objects:** window.speechSynthesis, SpeechSynthesisUtterance

## Feature Set

### Core Speech Synthesis Features
- **Text-to-Speech Conversion** - Convert text strings to spoken audio
- **Queue Management** - Handle multiple speech requests in sequence
- **Speech Control** - Play, pause, resume, and cancel speech operations

### Voice and Language Support
- **Multi-language Support** - Support for multiple languages and locales
- **Voice Selection** - Choose from available system voices
- **Voice Enumeration** - List all available voices with metadata
- **Language Detection** - Check availability of specific languages

### Engine Management
- **Engine Enumeration** - List all available TTS engines
- **Default Engine Detection** - Identify system default TTS engine
- **Engine Switching** - Change TTS engine at runtime
- **Engine Information** - Access engine metadata (name, label, icon)

### Speech Customization
- **Speech Rate Control** - Adjust speaking speed (rate parameter)
- **Pitch Control** - Modify voice pitch (pitch parameter)
- **Volume Control** - Set speech volume (volume parameter)
- **Language Setting** - Specify utterance language

### Event Handling
- **Speech Lifecycle Events:**
  - `onstart` - Speech begins
  - `onend` - Speech completes
  - `onpause` - Speech is paused
  - `onresume` - Speech resumes
  - `onerror` - Error occurred
  - `onmark` - Speech mark reached
  - `onboundary` - Word/sentence boundary
- **Voice Change Events:**
  - `voiceschanged` - Voices become available or engine changes

## Project Structure

```
cboard-speech-tts/
├── package.json              # Project metadata and dependencies
├── plugin.xml               # Cordova plugin configuration
├── README.md                # This documentation
├── CHANGELOG.md             # Version history
├── LICENSE                  # GPL-3.0 license
├── .gitignore              # Git ignore rules
├── .editorconfig           # Editor configuration
├── .jshintrc               # JavaScript linting rules
├── src/
│   └── android/
│       └── SpeechSynthesis.java    # Android native implementation
├── www/                    # JavaScript interface layer
│   ├── SpeechSynthesis.js
│   ├── SpeechSynthesisUtterance.js
│   ├── SpeechSynthesisVoice.js
│   ├── SpeechSynthesisVoiceList.js
│   ├── SpeechSynthesisEngine.js
│   ├── SpeechSynthesisEngineList.js
│   └── SpeechSynthesisEvent.js
└── helper/
    └── cordova.js          # Cordova helper utilities
```

## License

This project is licensed under the GPL-3.0-only License.

## Support

For issues and support, please visit: https://github.com/cboard-org/cboard-speech-tts/issues

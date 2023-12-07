class Measure {
    constructor(content) {
        this.notes = []
        if (content.attributes) {
            console.log(content.attributes[0].time)
            var attributes = {
                divisions: content.attributes[0].divisions[0],
                key: {
                    fifths: content.attributes[0].key[0].fifths[0]
                },
                time: {
                    beats: content.attributes[0].time[0].beats[0],
                    'beat-type': content.attributes[0].time[0]["beat-type"][0]
                },
                clef: {
                    sign: content.attributes[0].clef[0].sign[0],
                    line: content.attributes[0].clef[0].line[0]
                }
            }

            this.attributes = attributes
        }

        if (content.barline) {
            this.attributes = content.barline
        }

        content.note.forEach(note => {
            note = {
                pitch: {
                    step: note.pitch[0].step[0],
                    octave: note.pitch[0].octave[0]
                },
                duration: note.duration,
                type: note.type,
                voice: note.voice,
                stem: note.stem
            }

            var notemod = {}

            Object.keys(note).forEach(function (k) {
                if (k != "pitch") {
                    if (note[k]) {
                        notemod[k] = note[k][0]
                    }
                } else {
                    notemod[k] = note[k]
                }
            });

            this.notes.push(notemod)
        })
    }

    toJSON() {
        var json = {
            "ATTR": {
                "id": ""
            },
            "part-name": [""],
            "part-abbreviation": [""],
            "score-instrument": [{
                "ATTR": {
                    "id": ""
                },
                "instrument-name": [""]
            }],
            "midi-instrument": [{
                "ATTR": {
                    "id": ""
                },
                "midi-channel": [""],
                "midi-program": [""],
                "volume": [""],
                "pan": [""]
            }],
            "midi-device": [{
                "ATTR": {
                    "id": "",
                    "port": ""
                }
            }]
        }
        json["ATTR"]["id"] = this.id
        json["part-name"][0] = this.name
        json["part-abbreviation"][0] = this.abbreviation
        json["score-instrument"][0]["ATTR"]["id"] = this.scoreInstrument.id
        json["score-instrument"][0]["instrument-name"][0] = this.scoreInstrument.name
        json["midi-instrument"][0]["ATTR"]["id"] = this.midiInstrument.id
        json["midi-instrument"][0]["midi-channel"][0] = this.midiInstrument.name
        json["midi-instrument"][0]["midi-program"][0] = this.midiInstrument.abbreviation
        json["midi-instrument"][0]["volume"][0] = this.midiInstrument.volume
        json["midi-instrument"][0]["pan"][0] = this.midiInstrument.pan
        json["midi-device"][0]["ATTR"]["id"] = this.midiDevice.id
        json["midi-device"][0]["ATTR"]["port"] = this.midiDevice.port

        return json
    }
}

module.exports = Measure;
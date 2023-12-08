const xml2js = require('xml2js');
const fs = require('fs');
const Instrument = require('./instruments');
const partInfo = require('./partInfo');
const Measure = require('./measure');

class XMLParser {
    constructor() {
        this.parser = new xml2js.Parser({ attrkey: "ATTR" });
        this.builder = new xml2js.Builder({ attrkey: "ATTR" });
        this.xml = null;
        this.json = null;
        this.Dfile = {
            instruments: []
        };
    }

    async buildxml() {
        this.xml = await this.builder.buildObject(this.json);
        this.xml = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' + this.xml.split('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')[1]
        return this.xml
    }

    async reloadjson() {
        this.Dfile.instruments.forEach((instrument, index) => {
            this.json["score-partwise"]["part-list"][0]["score-part"][index] = instrument.toJSON()
        });

        this.json["score-partwise"] = {
            ...this.json["score-partwise"],
            ...this.Dfile.infos.toJSON()
        };

        var part = []
        const parts = this.Dfile.parts
        Object.keys(this.Dfile.parts).forEach(function (k) {
            console.log(parts[k])
            part.push({
                ATTR: { id: k },
                measure: parts[k]
            })
        });
        
        return this.json
    }

    async loadFile(file) {
        file = fs.readFileSync(file, 'utf8');
        this.xml = file;
        this.json = await this.parser.parseStringPromise(this.xml);
        await this.reloadDebbusyFile();
        return this.json
    }

    reloadDebbusyFile() {
        this.json["score-partwise"]["part-list"][0]["score-part"].forEach(element => {
            this.Dfile.instruments.push(new Instrument(element))
        })
        this.Dfile.infos = new partInfo(this.json["score-partwise"])
        this.Dfile.parts = {}
        this.json["score-partwise"]["part"].forEach(element => {
            var measures = []
            element.measure.forEach((element) => {
                measures.push(new Measure(element))
            })
            this.Dfile.parts[element.ATTR.id] = element.measure
        })
    }

    get(type) {
        if (type == "instrument") {
            return this.Dfile
        }
    }
}

module.exports = XMLParser;
import * as output from "../output";
import * as input from "../input";
import * as server from "./index";
import * as terminal from "../index";
import * as suggestor from "../autocomplete/suggestor";
import * as locale from "../localization";

export function suggest (data = { for: 0, variants: "", base: "" }) {
    let suggestions = [],
        lastPushed = "",
        variants = data.variants ? data.variants.split(",") : [];
    for (let variant of variants) {
        let toPush, i;
        if (data.base) {
            if (variant.indexOf(data.base) === 0)
                toPush = variant.substr(data.base.length);
        } else toPush = variant;
        if (!toPush)
            continue;
        toPush = (i = toPush.indexOf(`.`)) > 0 ? toPush.substring(0, i) : toPush;
        if (lastPushed === toPush)
            continue;
        suggestions.push(lastPushed = toPush);
    }
    if (suggestions.length)
        suggestor.addSuggestions(data.for, suggestions);
}

export function init (data = {}) {
    output.printLine(`CWTv${ terminal.VERSION } on ${ data["system"] } as ${ data["username"] }${
        data["name"] ? ` (${ data["name"] })` : ``
    }`);
    terminal.authDone();
}

export function prompt (namespace) {
    input.prompt(`${ namespace } > `, {}, (str) => {
        server.send("Execute", str);
    });
}

export function execError (message = "") {
    output.print(
        message.replace(/^(<.*>)/, `\x1b[31m$1\x1b[0m`)
            .replace(/zLoop\+[0-9]+\^WebTerminal\.Core\.[0-9]+/, "")
    );
}

export function readString (data = {}) {
    input.prompt("", data, (str) => {
        server.send("i", str);
    });
}

export function readChar (data = {}) {
    input.getKey(data, (code) => {
        server.send("i", code);
    });
}

/**
 * Output data.
 * @param {string} text
 */
export function o (text = "") {
    output.print(text);
}

export function oLocalized (text = "") {
    output.print(locale.parse(text));
}
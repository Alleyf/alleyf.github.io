/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * ReplaceTerm enables us to store the parameters for a replacement to add a new size parameter.
 */
class ReplaceTerm {
    constructor(replaceFrom, replaceWith) {
        this.replaceFrom = replaceFrom;
        this.replaceWith = replaceWith;
    }
    // Generate a string that can be used in a string.replace() call as the string to replace
    getReplaceFromString(oldSize) {
        return this.replaceFrom(oldSize);
    }
    // Generate a string that can be used in a string.replace() call as the replacement string
    getReplaceWithString(newSize) {
        return this.replaceWith(newSize);
    }
}
class Util {
    /**
         * For a given file content decide if a string is inside a table
         * @param searchString string
         * @param fileValue file content
         * @private
         */
    static isInTable(searchString, fileValue) {
        return fileValue.search(new RegExp(`^\\|.+${searchString}.+\\|$`, "m")) !== -1;
    }
    /**
     * Get the image name from a given src uri of a local image
     * (URI like app://local/C:/.../image.png?1677337704730)
     * @param imageUri uri of the image
     * @private
     */
    static getLocalImageNameFromUri(imageUri) {
        imageUri = decodeURI(imageUri);
        const imageNameMatch = imageUri.match(/([^/]+)\?/);
        const imageName = imageNameMatch ? imageNameMatch[1] : "";
        // Handle linux not correctly decoding the %2F before the Filename to a \
        const hasLinuxDecodingIssue = imageName.startsWith("2F");
        return hasLinuxDecodingIssue ? imageName.slice(2) : imageName;
    }
    /**
     * Get the parameters needed to handle the zoom for a local image.
     * Source can be either a obsidian link like [[image.png]] or a markdown link like [image.png](image.png)
     * @param imageName Name of the image
     * @param fileText content of the current file
     * @returns parameters to handle the zoom
     */
    static getLocalImageZoomParams(imageName, fileText) {
        imageName = this.determineImageName(imageName, fileText);
        // Get the folder name if the image is located in a folder
        const folderName = this.getFolderNameIfExist(imageName, fileText);
        imageName = `${folderName}${imageName}`;
        const isInTable = Util.isInTable(imageName, fileText);
        // Separator to use for the replacement
        const sizeSeparator = isInTable ? "\\|" : "|";
        // Separator to use for the regex: isInTable ? \\\| : \|
        const regexSeparator = isInTable ? "\\\\\\|" : "\\|";
        const imageAttributes = this.getImageAttributes(imageName, fileText);
        imageName = `${imageName}${imageAttributes}`;
        // check character before the imageName to check if markdown link or obsidian link
        const imageNamePosition = fileText.indexOf(imageName);
        const isObsidianLink = fileText.charAt(imageNamePosition - 1) === "[";
        if (isObsidianLink) {
            return Util.generateReplaceTermForObsidianSyntax(imageName, regexSeparator, sizeSeparator);
        }
        else {
            return Util.generateReplaceTermForMarkdownSyntax(imageName, regexSeparator, sizeSeparator, fileText);
        }
    }
    /**
 * When using markdown link syntax the image name can be encoded. This function checks if the image name is encoded and if not encodes it.
 *
 * @param imageName Image name
 * @param fileText File content
 * @returns image name with the correct encoding
 */
    static determineImageName(imageName, fileText) {
        let imageNamePos = fileText.indexOf(imageName);
        if (imageNamePos === -1) { // if not found, try to encode the imageName
            imageName = encodeURI(imageName);
        }
        // check if now the imageName is found
        imageNamePos = fileText.indexOf(imageName);
        if (imageNamePos === -1)
            throw new Error("Image not found in file");
        return imageName;
    }
    /**
    * Extracts the folder name from the given image name by looking for the first "[" or "(" character
    * that appears before the image name in the file text.
    * @param imageName The name of the image.
    * @param fileText The text of the file that contains the image.
    * @returns The name of the folder that contains the image, or an empty string if no folder is found.
    */
    static getFolderNameIfExist(imageName, fileText) {
        const index = fileText.indexOf(imageName);
        if (index === -1) {
            throw new Error("Image not found in file");
        }
        const stringBeforeFileName = fileText.substring(0, index);
        const lastOpeningBracket = stringBeforeFileName.lastIndexOf("["); // Obsidian link
        const lastOpeningParenthesis = stringBeforeFileName.lastIndexOf("("); // Markdown link
        const lastOpeningBracketOrParenthesis = Math.max(lastOpeningBracket, lastOpeningParenthesis);
        const folderName = stringBeforeFileName.substring(lastOpeningBracketOrParenthesis + 1);
        return folderName;
    }
    /**
* Extracts any image attributes like |ctr for ITS Theme that appear after the given image name in the file.
* @param imageName - The name of the image to search for.
* @param fileText - The content of the file to search in.
* @returns A string containing any image attributes that appear after the image name.
*/
    static getImageAttributes(imageName, fileText) {
        const index = fileText.indexOf(imageName);
        const stringAfterFileName = fileText.substring(index + imageName.length);
        const regExpMatchArray = stringAfterFileName.match(/([^\]]*?)\\?\|\d+]]|([^\]]*?)]]|/);
        if (regExpMatchArray) {
            if (!!regExpMatchArray[1]) {
                return regExpMatchArray[1];
            }
            else if (!!regExpMatchArray[2]) {
                return regExpMatchArray[2];
            }
        }
        return "";
    }
    /**
     * Get the parameters needed to handle the zoom for images in markdown format.
     * Example: ![image.png](image.png)
     * @param imageName Name of the image
     * @param fileText content of the current file
     * @returns parameters to handle the zoom
     * @private
     *
     */
    static generateReplaceTermForMarkdownSyntax(imageName, regexSeparator, sizeSeparator, fileText) {
        const sizeMatchRegExp = new RegExp(`${regexSeparator}(\\d+)]${escapeRegex("(" + imageName + ")")}`);
        const replaceSizeExistFrom = (oldSize) => `${sizeSeparator}${oldSize}](${imageName})`;
        const replaceSizeExistWith = (newSize) => `${sizeSeparator}${newSize}](${imageName})`;
        const replaceSizeNotExistsFrom = (oldSize) => `](${imageName})`;
        const replaceSizeNotExistsWith = (newSize) => `${sizeSeparator}${newSize}](${imageName})`;
        const replaceSizeExist = new ReplaceTerm(replaceSizeExistFrom, replaceSizeExistWith);
        const replaceSizeNotExist = new ReplaceTerm(replaceSizeNotExistsFrom, replaceSizeNotExistsWith);
        return {
            sizeMatchRegExp: sizeMatchRegExp,
            replaceSizeExist: replaceSizeExist,
            replaceSizeNotExist: replaceSizeNotExist,
        };
    }
    /**
     * Get the parameters needed to handle the zoom for images in markdown format.
     * Example: ![[image.png]]
     * @param imageName Name of the image
     * @param fileText content of the current file
     * @returns parameters to handle the zoom
     * @private
     *
     */
    static generateReplaceTermForObsidianSyntax(imageName, regexSeparator, sizeSeparator) {
        const sizeMatchRegExp = new RegExp(`${escapeRegex(imageName)}${regexSeparator}(\\d+)`);
        const replaceSizeExistFrom = (oldSize) => `${imageName}${sizeSeparator}${oldSize}`;
        const replaceSizeExistWith = (newSize) => `${imageName}${sizeSeparator}${newSize}`;
        const replaceSizeNotExistsFrom = (oldSize) => `${imageName}`;
        const replaceSizeNotExistsWith = (newSize) => `${imageName}${sizeSeparator}${newSize}`;
        const replaceSizeExist = new ReplaceTerm(replaceSizeExistFrom, replaceSizeExistWith);
        const replaceSizeNotExist = new ReplaceTerm(replaceSizeNotExistsFrom, replaceSizeNotExistsWith);
        return {
            sizeMatchRegExp: sizeMatchRegExp,
            replaceSizeExist: replaceSizeExist,
            replaceSizeNotExist: replaceSizeNotExist,
        };
    }
    /**
     * Get the parameters needed to handle the zoom for a remote image.
     * Format: https://www.example.com/image.png
     * @param imageUri URI of the image
     * @param fileText content of the current file
     * @returns parameters to handle the zoom
     */
    static getRemoteImageZoomParams(imageUri, fileText) {
        const isInTable = Util.isInTable(imageUri, fileText);
        // Separator to use for the replacement
        const sizeSeparator = isInTable ? "\\|" : "|";
        // Separator to use for the regex: isInTable ? \\\| : \|
        const regexSeparator = isInTable ? "\\\\\\|" : "\\|";
        return Util.generateReplaceTermForMarkdownSyntax(imageUri, regexSeparator, sizeSeparator, fileText);
    }
}
/**
 * Function to escape a string into a valid searchable string for a regex
 * @param string string to escape
 * @returns escaped string
 */
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var ModifierKey;
(function (ModifierKey) {
    ModifierKey["ALT"] = "AltLeft";
    ModifierKey["CTRL"] = "ControlLeft";
    ModifierKey["SHIFT"] = "ShiftLeft";
})(ModifierKey || (ModifierKey = {}));
const DEFAULT_SETTINGS = {
    modifierKey: ModifierKey.ALT,
    stepSize: 25,
    initialSize: 500
};
class MouseWheelZoomPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.isKeyHeldDown = false;
        this.wheelOpt = { passive: false };
        this.wheelEvent = 'wheel';
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadSettings();
            this.registerDomEvent(document, "keydown", (evt) => {
                if (evt.code === this.settings.modifierKey.toString()) {
                    this.isKeyHeldDown = true;
                    this.disableScroll();
                }
            });
            this.registerDomEvent(document, "keyup", (evt) => {
                if (evt.code === this.settings.modifierKey.toString()) {
                    this.onConfigKeyUp();
                }
            });
            this.registerDomEvent(document, "wheel", (evt) => {
                if (this.isKeyHeldDown) {
                    // When for example using Alt + Tab to switch between windows, the key is still recognized as held down.
                    // We check if the key is really held down by checking if the key is still pressed in the event when the
                    // wheel event is triggered.
                    if (!this.isConfiguredKeyDown(evt)) {
                        this.onConfigKeyUp();
                        return;
                    }
                    const eventTarget = evt.target;
                    if (eventTarget.nodeName === "IMG") {
                        // Handle the zooming of the image
                        this.handleZoom(evt, eventTarget);
                    }
                }
            });
            this.addSettingTab(new MouseWheelZoomSettingsTab(this.app, this));
            console.log("Loaded: Mousewheel image zoom");
        });
    }
    /**
     * When the config key is released, we enable the scroll again and reset the key held down flag.
     */
    onConfigKeyUp() {
        this.isKeyHeldDown = false;
        this.enableScroll();
    }
    onunload() {
        // Re-enable the normal scrolling behaviour when the plugin unloads
        this.enableScroll();
    }
    /**
     * Handles zooming with the mousewheel on an image
     * @param evt wheel event
     * @param eventTarget targeted image element
     * @private
     */
    handleZoom(evt, eventTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageUri = eventTarget.attributes.getNamedItem("src").textContent;
            const activeFile = yield this.getActivePaneWithImage(eventTarget);
            let fileText = yield this.app.vault.read(activeFile);
            const originalFileText = fileText;
            // Get paremeters like the regex or the replacement terms based on the fact if the image is locally stored or not.
            const zoomParams = this.getZoomParams(imageUri, fileText, eventTarget);
            // Check if there is already a size parameter for this image.
            const sizeMatches = fileText.match(zoomParams.sizeMatchRegExp);
            // Element already has a size entry
            if (sizeMatches !== null) {
                const oldSize = parseInt(sizeMatches[1]);
                let newSize = oldSize;
                if (evt.deltaY < 0) {
                    newSize += this.settings.stepSize;
                }
                else if (evt.deltaY > 0 && newSize > this.settings.stepSize) {
                    newSize -= this.settings.stepSize;
                }
                fileText = fileText.replace(zoomParams.replaceSizeExist.getReplaceFromString(oldSize), zoomParams.replaceSizeExist.getReplaceWithString(newSize));
            }
            else { // Element has no size entry -> give it an initial size
                const initialSize = this.settings.initialSize;
                fileText = fileText.replace(zoomParams.replaceSizeNotExist.getReplaceFromString(0), zoomParams.replaceSizeNotExist.getReplaceWithString(initialSize));
            }
            // Save changed size
            if (fileText !== originalFileText) {
                yield this.app.vault.modify(activeFile, fileText);
            }
        });
    }
    /**
     * Loop through all panes and get the pane that hosts a markdown file with the image to zoom
     * @param imageElement The HTML Element of the image
     * @private
     */
    getActivePaneWithImage(imageElement) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(((resolve, reject) => {
                this.app.workspace.iterateAllLeaves(leaf => {
                    if (leaf.view.containerEl.contains(imageElement) && leaf.view instanceof obsidian.MarkdownView) {
                        resolve(leaf.view.file);
                    }
                });
                reject(new Error("No file belonging to the image found"));
            }));
        });
    }
    getZoomParams(imageUri, fileText, target) {
        if (imageUri.contains("http")) {
            return Util.getRemoteImageZoomParams(imageUri, fileText);
        }
        else if (imageUri.contains("app://local")) {
            const imageName = Util.getLocalImageNameFromUri(imageUri);
            return Util.getLocalImageZoomParams(imageName, fileText);
        }
        else if (target.classList.value.match("excalidraw-svg.*")) {
            const src = target.attributes.getNamedItem("filesource").textContent;
            // remove ".md" from the end of the src
            const imageName = src.substring(0, src.length - 3);
            // Only get text after "/"
            const imageNameAfterSlash = imageName.substring(imageName.lastIndexOf("/") + 1);
            return Util.getLocalImageZoomParams(imageNameAfterSlash, fileText);
        }
        throw new Error("Image is not zoomable");
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    // Utilities to disable and enable scrolling //
    preventDefault(e) {
        e.preventDefault();
    }
    /**
     * Disables the normal scroll event
     */
    disableScroll() {
        window.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt);
    }
    /**
     * Enables the normal scroll event
     */
    enableScroll() {
        window.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt);
    }
    isConfiguredKeyDown(evt) {
        switch (this.settings.modifierKey) {
            case ModifierKey.ALT:
                return evt.altKey;
            case ModifierKey.CTRL:
                return evt.ctrlKey;
            case ModifierKey.SHIFT:
                return evt.shiftKey;
        }
    }
}
class MouseWheelZoomSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for mousewheel zoom' });
        new obsidian.Setting(containerEl)
            .setName('Trigger Key')
            .setDesc('Key that needs to be pressed down for mousewheel zoom to work.')
            .addDropdown(dropdown => dropdown
            .addOption(ModifierKey.CTRL, "Ctrl")
            .addOption(ModifierKey.ALT, "Alt")
            .addOption(ModifierKey.SHIFT, "Shift")
            .setValue(this.plugin.settings.modifierKey)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.modifierKey = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian.Setting(containerEl)
            .setName('Step size')
            .setDesc('Step value by which the size of the image should be increased/decreased')
            .addSlider(slider => {
            slider
                .setValue(25)
                .setLimits(0, 100, 1)
                .setDynamicTooltip()
                .setValue(this.plugin.settings.stepSize)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.stepSize = value;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Initial Size')
            .setDesc('Initial image size if no size was defined beforehand')
            .addSlider(slider => {
            slider
                .setValue(500)
                .setLimits(0, 1000, 25)
                .setDynamicTooltip()
                .setValue(this.plugin.settings.stepSize)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.initialSize = value;
                yield this.plugin.saveSettings();
            }));
        });
    }
}

module.exports = MouseWheelZoomPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy91dGlsLnRzIiwibWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luIiwiTWFya2Rvd25WaWV3IiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1A7O0FDMUVBOzs7TUFHYSxXQUFXO0lBSXBCLFlBQVksV0FBd0MsRUFBRSxXQUF3QztRQUMxRixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztLQUNsQzs7SUFHTSxvQkFBb0IsQ0FBQyxPQUFlO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwQzs7SUFHTSxvQkFBb0IsQ0FBQyxPQUFlO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwQztDQUNKO01BYVksSUFBSTs7Ozs7OztJQU9OLE9BQU8sU0FBUyxDQUFDLFlBQW9CLEVBQUUsU0FBaUI7UUFDM0QsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsWUFBWSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtLQUNqRjs7Ozs7OztJQVNNLE9BQU8sd0JBQXdCLENBQUMsUUFBZ0I7UUFDbkQsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sU0FBUyxHQUFHLGNBQWMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDOztRQUcxRCxNQUFNLHFCQUFxQixHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekQsT0FBTyxxQkFBcUIsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztLQUNqRTs7Ozs7Ozs7SUFVTSxPQUFPLHVCQUF1QixDQUFDLFNBQWlCLEVBQUUsUUFBZ0I7UUFDckUsU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7O1FBR3pELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEUsU0FBUyxHQUFHLEdBQUcsVUFBVSxHQUFHLFNBQVMsRUFBRSxDQUFDO1FBR3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBOztRQUVyRCxNQUFNLGFBQWEsR0FBRyxTQUFTLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQTs7UUFFN0MsTUFBTSxjQUFjLEdBQUcsU0FBUyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUE7UUFJcEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRSxTQUFTLEdBQUcsR0FBRyxTQUFTLEdBQUcsZUFBZSxFQUFFLENBQUM7O1FBRzdDLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQTtRQUVyRSxJQUFJLGNBQWMsRUFBRTtZQUNoQixPQUFPLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQzlGO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN4RztLQUNKOzs7Ozs7OztJQVNPLE9BQU8sa0JBQWtCLENBQUMsU0FBaUIsRUFBRSxRQUFnQjtRQUNqRSxJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRS9DLElBQUksWUFBWSxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDbkM7O1FBR0QsWUFBWSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsSUFBSSxZQUFZLEtBQUssQ0FBQyxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXBFLE9BQU8sU0FBUyxDQUFDO0tBQ3BCOzs7Ozs7OztJQVNPLE9BQU8sb0JBQW9CLENBQUMsU0FBaUIsRUFBRSxRQUFnQjtRQUNuRSxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzlDO1FBRUQsTUFBTSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUxRCxNQUFNLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRSxNQUFNLHNCQUFzQixHQUFHLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRSxNQUFNLCtCQUErQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUM3RixNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsK0JBQStCLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFdkYsT0FBTyxVQUFVLENBQUM7S0FDckI7Ozs7Ozs7SUFRTyxPQUFPLGtCQUFrQixDQUFDLFNBQWlCLEVBQUUsUUFBZ0I7UUFDakUsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxNQUFNLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RSxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBRXZGLElBQUksZ0JBQWdCLEVBQUU7WUFDbEIsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZCLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUI7aUJBQU0sSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlCLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUI7U0FDSjtRQUVELE9BQU8sRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7Ozs7SUFXTyxPQUFPLG9DQUFvQyxDQUFDLFNBQWlCLEVBQUUsY0FBc0IsRUFBRSxhQUFxQixFQUFFLFFBQWdCO1FBRWxJLE1BQU0sZUFBZSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsY0FBYyxVQUFVLFdBQVcsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVwRyxNQUFNLG9CQUFvQixHQUFHLENBQUMsT0FBZSxLQUFLLEdBQUcsYUFBYSxHQUFHLE9BQU8sS0FBSyxTQUFTLEdBQUcsQ0FBQztRQUM5RixNQUFNLG9CQUFvQixHQUFHLENBQUMsT0FBZSxLQUFLLEdBQUcsYUFBYSxHQUFHLE9BQU8sS0FBSyxTQUFTLEdBQUcsQ0FBQztRQUU5RixNQUFNLHdCQUF3QixHQUFHLENBQUMsT0FBZSxLQUFLLEtBQUssU0FBUyxHQUFHLENBQUM7UUFDeEUsTUFBTSx3QkFBd0IsR0FBRyxDQUFDLE9BQWUsS0FBSyxHQUFHLGFBQWEsR0FBRyxPQUFPLEtBQUssU0FBUyxHQUFHLENBQUM7UUFFbEcsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxXQUFXLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUVoRyxPQUFPO1lBQ0gsZUFBZSxFQUFFLGVBQWU7WUFDaEMsZ0JBQWdCLEVBQUUsZ0JBQWdCO1lBQ2xDLG1CQUFtQixFQUFFLG1CQUFtQjtTQUMzQyxDQUFDO0tBQ0w7Ozs7Ozs7Ozs7SUFXTyxPQUFPLG9DQUFvQyxDQUFDLFNBQWlCLEVBQUUsY0FBc0IsRUFBRSxhQUFxQjtRQUNoSCxNQUFNLGVBQWUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxjQUFjLFFBQVEsQ0FBQyxDQUFDO1FBRXZGLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxPQUFlLEtBQUssR0FBRyxTQUFTLEdBQUcsYUFBYSxHQUFHLE9BQU8sRUFBRSxDQUFDO1FBQzNGLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxPQUFlLEtBQUssR0FBRyxTQUFTLEdBQUcsYUFBYSxHQUFHLE9BQU8sRUFBRSxDQUFDO1FBRTNGLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxPQUFlLEtBQUssR0FBRyxTQUFTLEVBQUUsQ0FBQztRQUNyRSxNQUFNLHdCQUF3QixHQUFHLENBQUMsT0FBZSxLQUFLLEdBQUcsU0FBUyxHQUFHLGFBQWEsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUUvRixNQUFNLGdCQUFnQixHQUFHLElBQUksV0FBVyxDQUFDLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDckYsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBRWhHLE9BQU87WUFDSCxlQUFlLEVBQUUsZUFBZTtZQUNoQyxnQkFBZ0IsRUFBRSxnQkFBZ0I7WUFDbEMsbUJBQW1CLEVBQUUsbUJBQW1CO1NBQzNDLENBQUM7S0FDTDs7Ozs7Ozs7SUFTTSxPQUFPLHdCQUF3QixDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDckUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7O1FBRXBELE1BQU0sYUFBYSxHQUFHLFNBQVMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFBOztRQUU3QyxNQUFNLGNBQWMsR0FBRyxTQUFTLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQTtRQUVwRCxPQUFPLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2RztDQUVKO0FBS0Q7Ozs7O1NBS2dCLFdBQVcsQ0FBQyxNQUFjO0lBQ3RDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1RDs7QUN0UEEsSUFBSyxXQUlKO0FBSkQsV0FBSyxXQUFXO0lBQ1osOEJBQWUsQ0FBQTtJQUNmLG1DQUFvQixDQUFBO0lBQ3BCLGtDQUFtQixDQUFBO0FBQ3ZCLENBQUMsRUFKSSxXQUFXLEtBQVgsV0FBVyxRQUlmO0FBRUQsTUFBTSxnQkFBZ0IsR0FBMkI7SUFDN0MsV0FBVyxFQUFFLFdBQVcsQ0FBQyxHQUFHO0lBQzVCLFFBQVEsRUFBRSxFQUFFO0lBQ1osV0FBVyxFQUFFLEdBQUc7Q0FDbkIsQ0FBQTtNQUVvQixvQkFBcUIsU0FBUUEsZUFBTTtJQUF4RDs7UUFFSSxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQXlKdEIsYUFBUSxHQUFHLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFBO1FBQzNCLGVBQVUsR0FBRyxPQUFPLENBQUE7S0E0QnZCO0lBcExTLE1BQU07O1lBQ1IsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFMUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFrQjtnQkFDMUQsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFO29CQUNuRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtvQkFDekIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO2lCQUN2QjthQUNKLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBa0I7Z0JBQ3hELElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDbkQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN4QjthQUNKLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBZTtnQkFDckQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFOzs7O29CQUtwQixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUNoQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQ3JCLE9BQU07cUJBQ1Q7b0JBRUQsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLE1BQWlCLENBQUM7b0JBQzFDLElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7O3dCQUVoQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztxQkFDckM7aUJBQ0o7YUFDSixDQUFDLENBQUE7WUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUkseUJBQXlCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRWxFLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQTtTQUMvQztLQUFBOzs7O0lBS08sYUFBYTtRQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtRQUMxQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7S0FDdEI7SUFFRCxRQUFROztRQUVKLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtLQUN0Qjs7Ozs7OztJQVFhLFVBQVUsQ0FBQyxHQUFlLEVBQUUsV0FBb0I7O1lBQzFELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQztZQUV4RSxNQUFNLFVBQVUsR0FBVSxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV6RSxJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUNwRCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQzs7WUFHbEMsTUFBTSxVQUFVLEdBQXFCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQzs7WUFHekYsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7O1lBRy9ELElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDdEIsTUFBTSxPQUFPLEdBQVcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLE9BQU8sR0FBVyxPQUFPLENBQUM7Z0JBQzlCLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ2hCLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQTtpQkFDcEM7cUJBQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7b0JBQzNELE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQTtpQkFDcEM7Z0JBRUQsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxFQUFFLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ3JKO2lCQUFNO2dCQUNILE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFBO2dCQUM3QyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7YUFDeko7O1lBR0QsSUFBSSxRQUFRLEtBQUssZ0JBQWdCLEVBQUU7Z0JBQy9CLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQTthQUNwRDtTQUVKO0tBQUE7Ozs7OztJQVFhLHNCQUFzQixDQUFDLFlBQXFCOztZQUN0RCxPQUFPLElBQUksT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU07Z0JBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUk7b0JBQ3BDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLFlBQVlDLHFCQUFZLEVBQUU7d0JBQ25GLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMzQjtpQkFDSixDQUFDLENBQUE7Z0JBRUYsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsQ0FBQTthQUM1RCxFQUFFLENBQUE7U0FDTjtLQUFBO0lBR08sYUFBYSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxNQUFlO1FBQ3RFLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7U0FDM0Q7YUFBTSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDekMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFELE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUMzRDthQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDekQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDOztZQUVyRSxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztZQUVuRCxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoRixPQUFPLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUNyRTtRQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtLQUMxQztJQU1LLFlBQVk7O1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzlFO0tBQUE7SUFFSyxZQUFZOztZQUNkLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdEM7S0FBQTs7SUFJRCxjQUFjLENBQUMsQ0FBTTtRQUNqQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDdEI7Ozs7SUFRRCxhQUFhO1FBQ1QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEY7Ozs7SUFLRCxZQUFZO1FBQ1IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBZSxDQUFDLENBQUM7S0FDMUY7SUFFTyxtQkFBbUIsQ0FBQyxHQUFlO1FBQ3ZDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXO1lBQzdCLEtBQUssV0FBVyxDQUFDLEdBQUc7Z0JBQ2hCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUN0QixLQUFLLFdBQVcsQ0FBQyxJQUFJO2dCQUNqQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDdkIsS0FBSyxXQUFXLENBQUMsS0FBSztnQkFDbEIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDO1NBQzNCO0tBQ0o7Q0FHSjtBQUVELE1BQU0seUJBQTBCLFNBQVFDLHlCQUFnQjtJQUdwRCxZQUFZLEdBQVEsRUFBRSxNQUE0QjtRQUM5QyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3hCO0lBRUQsT0FBTztRQUNILElBQUksRUFBQyxXQUFXLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFFekIsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXBCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLDhCQUE4QixFQUFDLENBQUMsQ0FBQztRQUduRSxJQUFJQyxnQkFBTyxDQUFDLFdBQVcsQ0FBQzthQUNuQixPQUFPLENBQUMsYUFBYSxDQUFDO2FBQ3RCLE9BQU8sQ0FBQyxnRUFBZ0UsQ0FBQzthQUN6RSxXQUFXLENBQUMsUUFBUSxJQUFJLFFBQVE7YUFDNUIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2FBQ25DLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQzthQUNqQyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7YUFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQzthQUMxQyxRQUFRLENBQUMsQ0FBTyxLQUFLO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxLQUFvQixDQUFDO1lBQ3hELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTtTQUNuQyxDQUFBLENBQUMsQ0FDTCxDQUFDO1FBRU4sSUFBSUEsZ0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUNwQixPQUFPLENBQUMseUVBQXlFLENBQUM7YUFDbEYsU0FBUyxDQUFDLE1BQU07WUFDYixNQUFNO2lCQUNELFFBQVEsQ0FBQyxFQUFFLENBQUM7aUJBQ1osU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUNwQixpQkFBaUIsRUFBRTtpQkFDbkIsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDdkMsUUFBUSxDQUFDLENBQU8sS0FBSztnQkFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtnQkFDckMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFBO2FBQ25DLENBQUEsQ0FBQyxDQUFBO1NBQ1QsQ0FBQyxDQUFBO1FBRU4sSUFBSUEsZ0JBQU8sQ0FBQyxXQUFXLENBQUM7YUFDbkIsT0FBTyxDQUFDLGNBQWMsQ0FBQzthQUN2QixPQUFPLENBQUMsc0RBQXNELENBQUM7YUFDL0QsU0FBUyxDQUFDLE1BQU07WUFDYixNQUFNO2lCQUNELFFBQVEsQ0FBQyxHQUFHLENBQUM7aUJBQ2IsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO2lCQUN0QixpQkFBaUIsRUFBRTtpQkFDbkIsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDdkMsUUFBUSxDQUFDLENBQU8sS0FBSztnQkFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtnQkFDeEMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFBO2FBQ25DLENBQUEsQ0FBQyxDQUFBO1NBQ1QsQ0FBQyxDQUFBO0tBQ1Q7Ozs7OyJ9
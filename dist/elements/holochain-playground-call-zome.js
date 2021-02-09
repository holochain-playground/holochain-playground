import { _ as __decorate, a as __metadata } from '../tslib.es6-654e2c24.js';
import { html, css, property } from 'lit-element';
import { sharedStyles } from './utils/shared-styles.js';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { BaseElement } from './utils/base-element.js';
import { Button } from 'scoped-material-components/mwc-button';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { Icon } from 'scoped-material-components/mwc-icon';
import { styleMap } from 'lit-html/directives/style-map';
import { selectCell } from './utils/selectors.js';
import { Tab } from 'scoped-material-components/mwc-tab';
import { TabBar } from 'scoped-material-components/mwc-tab-bar';
import { Card } from 'scoped-material-components/mwc-card';
import { shortenStrRec } from './utils/hash.js';
import { J as JsonViewer } from '../json-viewer-d616c533.js';
import '@open-wc/scoped-elements';
import '@holochain-playground/container';
import 'lodash-es';

class HolochainPlaygroundCallZome extends BaseElement {
    constructor() {
        super(...arguments);
        this._selectedZomeIndex = 0;
        this._results = {};
        // Arguments segmented by zome/fn_name/arg_name
        this._arguments = {};
    }
    get activeCell() {
        return selectCell(this.activeDna, this.activeAgentPubKey, this.conductors);
    }
    get activeZome() {
        return this.activeCell.getSimulatedDna().zomes[this._selectedZomeIndex];
    }
    observedCells() {
        return [this.activeCell];
    }
    async callZomeFunction(zomeName, fnName) {
        const zome = this.activeZome;
        const timestamp = Date.now();
        this._results[timestamp] = {
            cellId: this.activeCell.cellId,
            result: undefined,
            fnName,
            zome: zome,
        };
        this.requestUpdate();
        const payload = this._arguments[zomeName] && this._arguments[zomeName][fnName];
        try {
            const result = await this.activeCell.conductor.callZomeFn({
                cellId: this.activeCell.cellId,
                zome: zome.name,
                payload,
                fnName,
                cap: null,
            });
            this._results[timestamp].result = { success: true, payload: result };
        }
        catch (e) {
            this._results[timestamp].result = { success: false, payload: e.message };
        }
        finally {
            this.requestUpdate();
        }
    }
    setFunctionArgument(zome, fnName, argName, argValue) {
        if (!this._arguments[zome])
            this._arguments[zome] = {};
        if (!this._arguments[zome][fnName])
            this._arguments[zome][fnName] = {};
        this._arguments[zome][fnName][argName] = argValue;
    }
    renderCallableFunction(zome, name, zomeFunction) {
        return html `<div class="row" style="margin: 8px 0;">
      <mwc-button
        raised
        @click=${() => this.callZomeFunction(zome, name)}
        style="width: 12em; margin: 18px; margin-left: 0;"
        >${name}</mwc-button
      >
      <div class="column" style="flex: 1; margin-left: 16px;">
        ${zomeFunction.arguments.length === 0
            ? html `<span class="placeholder" style="margin-top: 30px;"
              >This function has no arguments</span
            >`
            : zomeFunction.arguments.map((arg) => html `<mwc-textfield
                  style="margin-top: 8px"
                  outlined
                  label=${arg.name + ': ' + arg.type}
                  @input=${(e) => this.setFunctionArgument(zome, name, arg.name, e.target.value)}
                ></mwc-textfield>`)}
      </div>
    </div>`;
    }
    renderActiveZomeFns() {
        const zome = this.activeCell.getSimulatedDna().zomes[this._selectedZomeIndex];
        const zomeFns = Object.entries(zome.zome_functions);
        if (zomeFns.length === 0)
            return html `<div class="fill center-content">
        <span class="placeholder" style="padding: 24px;"
          >This zome has no functions</span
        >
      </div> `;
        return html `
      <div class="flex-scrollable-parent">
        <div class="flex-scrollable-container">
          <div class="flex-scrollable-y">
            <div class="column" style="flex: 1; margin: 16px;">
              ${zomeFns.map(([name, fn], index) => html `${this.renderCallableFunction(zome.name, name, fn)}${index < zomeFns.length - 1
            ? html `<span class="horizontal-divider"></span>`
            : html ``}`)}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    renderResults() {
        const sortedTimestamps = Object.keys(this._results).sort();
        const sortedResults = sortedTimestamps.map((timestamp) => [timestamp, this._results[timestamp]]);
        return html `
      <div class="column" style="flex: 1;">
        ${sortedResults.length === 0
            ? html `
              <div class="row fill center-content">
                <span class="placeholder" style="margin: 0 24px;"
                  >Call a ZomeFn to see its results</span
                >
              </div>
            `
            : html ` <div class="flex-scrollable-parent">
              <div class="flex-scrollable-container">
                <div class="flex-scrollable-y">
                  <div style="margin: 0 16px">
                    ${sortedResults.map(([timestamp, result], index) => html `
                          <div class="column" style="flex: 1;">
                            <div class="row" style="margin: 8px 16px;">
                              ${result.result
                ? html `
                                    <mwc-icon
                                      style=${styleMap({
                    color: result.result.success
                        ? 'green'
                        : 'red',
                    'align-self': 'center',
                    '--mdc-icon-size': '36px',
                })}
                                      >${result.result.success
                    ? 'check_circle_outline'
                    : 'error_outline'}</mwc-icon
                                    >
                                  `
                : html `
                                    <mwc-circular-progress
                                      indeterminate
                                      density="-2"
                                      style="align-self: center;"
                                    ></mwc-circular-progress>
                                  `}
                              <div
                                class="column"
                                style="flex: 1; margin: 12px; margin-right: 0;"
                              >
                                <div class="row" style="flex: 1;">
                                  <span style="flex: 1; margin-bottom: 8px;">
                                    ${result.fnName}
                                    <span class="placeholder"
                                      >in ${result.zome.name} zome, by
                                      ${shortenStrRec(result.cellId[1])}</span
                                    >
                                  </span>
                                  <span class="placeholder">
                                    ${new Date(parseInt(timestamp)).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div class="row">
                                  ${result.result
                ? html `
                                        <span>
                                          ${result.result.success
                    ? 'Result'
                    : 'Error'}:
                                          ${typeof result.result.payload ===
                    'string'
                    ? result.result.payload
                    : html `
                                                <json-viewer
                                                  .object=${shortenStrRec(result.result.payload)}
                                                  class="fill"
                                                ></json-viewer>
                                              `}</span
                                        >
                                      `
                : html `<span class="placeholder"
                                        >Executing...</span
                                      >`}
                                </div>
                              </div>
                            </div>
                            ${index < sortedResults.length - 1
                ? html `
                                  <span
                                    class="horizontal-divider"
                                    style="align-self: center;"
                                  ></span>
                                `
                : html ``}
                          </div>
                        `)}
                  </div>
                </div>
              </div>
            </div>`}
      </div>
    `;
    }
    render() {
        return html `
      <mwc-card style="width: auto; flex: 1;">
        ${this.activeCell
            ? html `
              <div class="row" style="flex: 1;">
                <div class="column" style="flex: 1">
                  <mwc-tab-bar
                    .activeIndex=${this._selectedZomeIndex}
                    @MDCTabBar:activated=${(e) => (this._selectedZomeIndex = e.detail.index)}
                  >
                    ${this.activeCell
                .getSimulatedDna()
                .zomes.map((zome) => html ` <mwc-tab .label=${zome.name}></mwc-tab> `)}
                  </mwc-tab-bar>
                  ${this.renderActiveZomeFns()}
                </div>
                <span class="vertical-divider"></span>
                ${this.renderResults()}
              </div>
            `
            : html `<div class="fill center-content placeholder">
              <span style="padding: 24px;"
                >Select a cell to call its zome functions</span
              >
            </div>`}
      </mwc-card>
    `;
    }
    static get scopedElements() {
        return {
            'mwc-button': Button,
            'mwc-textfield': TextField,
            'mwc-circular-progress': CircularProgress,
            'mwc-icon': Icon,
            'mwc-tab': Tab,
            'mwc-tab-bar': TabBar,
            'mwc-card': Card,
            'json-viewer': JsonViewer,
        };
    }
}
HolochainPlaygroundCallZome.styles = [
    sharedStyles,
    css `
      :host {
        display: flex;
        flex: 1;
      }
    `,
];
__decorate([
    property({ type: Number }),
    __metadata("design:type", Number)
], HolochainPlaygroundCallZome.prototype, "_selectedZomeIndex", void 0);
__decorate([
    property({ type: Array }),
    __metadata("design:type", Object)
], HolochainPlaygroundCallZome.prototype, "_results", void 0);

export { HolochainPlaygroundCallZome };
//# sourceMappingURL=holochain-playground-call-zome.js.map

import { blackboardConnect } from '../blackboard/blackboard-connect.js';
import '../_setToArray-0c1e9efa.js';
import '../core/cell/dht/get.js';
import { b as __decorate, d as __metadata } from '../tslib.es6-d17b0a4d.js';
import '../Subject-4f1cabc8.js';
import '../types/common.js';
import '../hash-35c9e46d.js';
import '../types/entry.js';
import '../types/header.js';
import '../types/timestamp.js';
import '../core/cell/source-chain/utils.js';
import '../core/cell/source-chain/builder-headers.js';
import '../core/cell/source-chain/put.js';
import '../types/dht-op.js';
import '../core/cell/source-chain/get.js';
import '../core/cell/workflows/publish_dht_ops.js';
import '../core/cell/workflows/produce_dht_ops.js';
import '../core/cell/workflows/genesis.js';
import '../executor/immediate-executor.js';
import '../core/cell/workflows/call_zome_fn.js';
import '../types/cell-state.js';
import '../types/metadata.js';
import '../core/cell/dht/put.js';
import '../core/cell/workflows/integrate_dht_ops.js';
import '../core/cell/workflows/app_validation.js';
import '../core/cell/workflows/sys_validation.js';
import '../core/cell/workflows/incoming_dht_ops.js';
import '../core/cell.js';
import '../core/network/p2p-cell.js';
import '../core/network.js';
import '../core/conductor.js';
import '../core/cell/source-chain/actions.js';
import { sampleDna } from '../dnas/sample-dna.js';
import { L as LitElement, h as html, c as css } from '../lit-element-f1ebfbe2.js';
import { q as query, p as property, i as internalProperty, c as customElement } from '../decorators-7fa2337b.js';
import { c as classMap, s as styleMap } from '../style-map-68ecac9c.js';
import { T as TextFieldBase } from '../mwc-textfield-base-e2d94d2c.js';
import '../observer-713e8ff5.js';
import { i as ifDefined } from '../if-defined-462120c7.js';
import '../form-element-03641c41.js';
import { D as Dialog } from '../mwc-dialog-aee34fe7.js';
import { sharedStyles } from './sharedStyles.js';
import { selectRedundancyFactor, selectCellCount, selectActiveCellsForConductor, selectUniqueDHTOps, selectMedianHoldingDHTOps, selectGlobalDHTOps } from '../state/selectors.js';
import 'lit-html/directives/live';
import '../processors/message.js';
import { createConductors } from '../processors/create-conductors.js';

/** @soyCompatible */
class LinearProgressBase extends LitElement {
    constructor() {
        super(...arguments);
        this.indeterminate = false;
        this.progress = 0;
        this.buffer = 1;
        this.reverse = false;
        this.closed = false;
        this.ariaLabel = '';
        this.stylePrimaryHalf = '';
        this.stylePrimaryFull = '';
        this.styleSecondaryQuarter = '';
        this.styleSecondaryHalf = '';
        this.styleSecondaryFull = '';
        this.animationReady = true;
        this.closedAnimationOff = false;
        this.resizeObserver = null;
    }
    connectedCallback() {
        super.connectedCallback();
        // if detached and reattached
        if (this.rootEl) {
            this.attachResizeObserver();
        }
    }
    /**
     * @soyTemplate
     */
    render() {
        /** @classMap */
        const classes = {
            'mdc-linear-progress--closed': this.closed,
            'mdc-linear-progress--closed-animation-off': this.closedAnimationOff,
            'mdc-linear-progress--indeterminate': this.indeterminate,
            'mdc-linear-progress--reversed': this.reverse,
            // needed for controller-less render
            'mdc-linear-progress--animation-ready': this.animationReady
        };
        const rootStyles = {
            '--mdc-linear-progress-primary-half': this.stylePrimaryHalf,
            '--mdc-linear-progress-primary-half-neg': this.stylePrimaryHalf !== '' ? `-${this.stylePrimaryHalf}` : '',
            '--mdc-linear-progress-primary-full': this.stylePrimaryFull,
            '--mdc-linear-progress-primary-full-neg': this.stylePrimaryFull !== '' ? `-${this.stylePrimaryFull}` : '',
            '--mdc-linear-progress-secondary-quarter': this.styleSecondaryQuarter,
            '--mdc-linear-progress-secondary-quarter-neg': this.styleSecondaryQuarter !== '' ? `-${this.styleSecondaryQuarter}` :
                '',
            '--mdc-linear-progress-secondary-half': this.styleSecondaryHalf,
            '--mdc-linear-progress-secondary-half-neg': this.styleSecondaryHalf !== '' ? `-${this.styleSecondaryHalf}` : '',
            '--mdc-linear-progress-secondary-full': this.styleSecondaryFull,
            '--mdc-linear-progress-secondary-full-neg': this.styleSecondaryFull !== '' ? `-${this.styleSecondaryFull}` : '',
        };
        const bufferBarStyles = {
            'flex-basis': this.indeterminate ? '100%' : `${this.buffer * 100}%`,
        };
        const primaryBarStyles = {
            transform: this.indeterminate ? 'scaleX(1)' : `scaleX(${this.progress})`,
        };
        return html `
      <div
          role="progressbar"
          class="mdc-linear-progress ${classMap(classes)}"
          style=${styleMap(rootStyles)}
          aria-label=${ifDefined(this.ariaLabel ? this.ariaLabel : undefined)}
          aria-valuemin="0"
          aria-valuemax="1"
          aria-valuenow=${ifDefined(this.indeterminate ? undefined : this.progress)}
        @transitionend=${this.syncClosedState}>
        <div class="mdc-linear-progress__buffer">
          <div
            class="mdc-linear-progress__buffer-bar"
            style=${styleMap(bufferBarStyles)}>
          </div>
          <div class="mdc-linear-progress__buffer-dots"></div>
        </div>
        <div
            class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
            style=${styleMap(primaryBarStyles)}>
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>`;
    }
    update(changedProperties) {
        // - When showing the indicator, enable animations immediately.
        // - On first render, disable the animation immediately.
        // - For normal calls to hide the component, let transitionend event trigger
        //   disabling of animations instead (see render method), so that animation
        //   does not jump in the middle of fade out.
        if (changedProperties.has('closed') &&
            (!this.closed || changedProperties.get('closed') === undefined)) {
            this.syncClosedState();
        }
        super.update(changedProperties);
    }
    async firstUpdated(changed) {
        super.firstUpdated(changed);
        this.attachResizeObserver();
    }
    syncClosedState() {
        this.closedAnimationOff = this.closed;
    }
    updated(changed) {
        // restart animation for timing if reverse changed and is indeterminate.
        // don't restart here if indeterminate has changed as well because we don't
        // want to incur an extra style recalculation
        if (!changed.has('indeterminate') && changed.has('reverse') &&
            this.indeterminate) {
            this.restartAnimation();
        }
        // Recaclulate the animation css custom props and restart the calculation
        // if this is not the first render cycle, otherwise, resize observer init
        // will already handle this and prevent unnecessary rerender + style recalc
        // but resize observer will not update animation vals while determinate
        if (changed.has('indeterminate') &&
            changed.get('indeterminate') !== undefined && this.indeterminate &&
            window.ResizeObserver) {
            this.calculateAndSetAnimationDimensions(this.rootEl.offsetWidth);
        }
        super.updated(changed);
    }
    disconnectedCallback() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        super.disconnectedCallback();
    }
    attachResizeObserver() {
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver((entries) => {
                if (!this.indeterminate) {
                    return;
                }
                for (const entry of entries) {
                    if (entry.contentRect) {
                        const width = entry.contentRect.width;
                        this.calculateAndSetAnimationDimensions(width);
                    }
                }
            });
            this.resizeObserver.observe(this.rootEl);
            return;
        }
        this.resizeObserver = null;
    }
    calculateAndSetAnimationDimensions(width) {
        const primaryHalf = width * 0.8367142;
        const primaryFull = width * 2.00611057;
        const secondaryQuarter = width * 0.37651913;
        const secondaryHalf = width * 0.84386165;
        const secondaryFull = width * 1.60277782;
        this.stylePrimaryHalf = `${primaryHalf}px`;
        this.stylePrimaryFull = `${primaryFull}px`;
        this.styleSecondaryQuarter = `${secondaryQuarter}px`;
        this.styleSecondaryHalf = `${secondaryHalf}px`;
        this.styleSecondaryFull = `${secondaryFull}px`;
        // need to restart animation for custom props to apply to keyframes
        this.restartAnimation();
    }
    async restartAnimation() {
        this.animationReady = false;
        await this.updateComplete;
        await new Promise(requestAnimationFrame);
        this.animationReady = true;
        await this.updateComplete;
    }
    open() {
        this.closed = false;
    }
    close() {
        this.closed = true;
    }
}
__decorate([
    query('.mdc-linear-progress')
], LinearProgressBase.prototype, "rootEl", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], LinearProgressBase.prototype, "indeterminate", void 0);
__decorate([
    property({ type: Number })
], LinearProgressBase.prototype, "progress", void 0);
__decorate([
    property({ type: Number })
], LinearProgressBase.prototype, "buffer", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], LinearProgressBase.prototype, "reverse", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], LinearProgressBase.prototype, "closed", void 0);
__decorate([
    property()
], LinearProgressBase.prototype, "ariaLabel", void 0);
__decorate([
    internalProperty()
], LinearProgressBase.prototype, "stylePrimaryHalf", void 0);
__decorate([
    internalProperty()
], LinearProgressBase.prototype, "stylePrimaryFull", void 0);
__decorate([
    internalProperty()
], LinearProgressBase.prototype, "styleSecondaryQuarter", void 0);
__decorate([
    internalProperty()
], LinearProgressBase.prototype, "styleSecondaryHalf", void 0);
__decorate([
    internalProperty()
], LinearProgressBase.prototype, "styleSecondaryFull", void 0);
__decorate([
    internalProperty()
], LinearProgressBase.prototype, "animationReady", void 0);
__decorate([
    internalProperty()
], LinearProgressBase.prototype, "closedAnimationOff", void 0);

/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const style = css `@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half, 83.67142%))}100%{transform:translateX(200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full, 200.611057%))}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter, 37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half, 84.386165%))}100%{transform:translateX(160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full, 160.277782%))}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(-10px)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%);transform:translateX(var(--mdc-linear-progress-primary-half-neg, -83.67142%))}100%{transform:translateX(-200.611057%);transform:translateX(var(--mdc-linear-progress-primary-full-neg, -200.611057%))}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%);transform:translateX(var(--mdc-linear-progress-secondary-quarter-neg, -37.651913%))}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%);transform:translateX(var(--mdc-linear-progress-secondary-half-neg, -84.386165%))}100%{transform:translateX(-160.277782%);transform:translateX(var(--mdc-linear-progress-secondary-full-neg, -160.277782%))}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}.mdc-linear-progress{position:relative;width:100%;height:4px;transform:translateZ(0);outline:1px solid transparent;overflow:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__bar{position:absolute;width:100%;height:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top:4px solid}.mdc-linear-progress__buffer{display:flex;position:absolute;width:100%;height:100%}.mdc-linear-progress__buffer-dots{background-repeat:repeat-x;background-size:10px 4px;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering 250ms infinite linear}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress__secondary-bar{visibility:hidden}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;visibility:visible}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate 2s infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale 2s infinite linear}.mdc-linear-progress--reversed .mdc-linear-progress__bar{right:0;transform-origin:center right}.mdc-linear-progress--reversed.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}.mdc-linear-progress--reversed.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}.mdc-linear-progress--reversed .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse 250ms infinite linear;order:0;transform:rotate(0)}.mdc-linear-progress--reversed .mdc-linear-progress__buffer-bar{order:1}.mdc-linear-progress--closed{opacity:0}.mdc-linear-progress--closed-animation-off .mdc-linear-progress__buffer-dots{animation:none}.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar,.mdc-linear-progress--closed-animation-off.mdc-linear-progress--indeterminate .mdc-linear-progress__bar .mdc-linear-progress__bar-inner{animation:none}.mdc-linear-progress__bar-inner{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E")}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6}.mdc-linear-progress--indeterminate.mdc-linear-progress--reversed .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}.mdc-linear-progress--indeterminate.mdc-linear-progress--reversed .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}:host{display:block}.mdc-linear-progress__buffer-bar{background-color:#e6e6e6;background-color:var(--mdc-linear-progress-buffer-color, #e6e6e6)}.mdc-linear-progress__buffer-dots{background-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E");background-image:var(--mdc-linear-progress-buffering-dots-image, url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='none slice'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23e6e6e6'/%3E%3C/svg%3E"))}`;

/** @soyCompatible */
let LinearProgress = class LinearProgress extends LinearProgressBase {
};
LinearProgress.styles = style;
LinearProgress = __decorate([
    customElement('mwc-linear-progress')
], LinearProgress);

class DHTStats extends blackboardConnect('holochain-playground', LitElement) {
    constructor() {
        super(...arguments);
        this.processing = false;
    }
    static get styles() {
        return sharedStyles;
    }
    renderStatsHelp() {
        return html `
      <mwc-dialog id="stats-help" heading="DHT Statistics Help">
        <span>
          This panel contains statistics for the current state of the DHT.
          <br />
          <br />
          Having a redundancy factor of
          ${selectRedundancyFactor(this.blackboard.state)}, it will
          <strong>
            replicate every DHT Op in the
            ${selectRedundancyFactor(this.blackboard.state)} nodes that are
            closest to its neighborhood </strong
          >.
          <br />
          <br />
          The number of
          <strong
            >DHT Ops (DHT Operation Transforms) is a measure of the load that
            the DHT has to hold</strong
          >. A DHT Op is the command that a node receives to indicate it has to
          change something in its shard of the DHT. Example of DHT Ops are
          "StoreEntry", "RegisterAddLink".
        </span>
        <mwc-button slot="primaryAction" dialogAction="cancel">
          Got it!
        </mwc-button>
      </mwc-dialog>
    `;
    }
    async republish() {
        const newNodes = parseInt(this.nNodes.value);
        const currentNodes = selectCellCount(this.blackboard.state);
        const changedNodes = currentNodes !== newNodes;
        const rFactor = parseInt(this.rFactor.value);
        const dna = this.blackboard.state.activeDNA;
        let conductors = this.blackboard.state.conductors;
        if (newNodes > currentNodes) {
            const newNodesToCreate = newNodes - currentNodes;
            conductors = await createConductors(newNodesToCreate, conductors, sampleDna());
        }
        else if (newNodes < currentNodes) {
            const conductorsToRemove = currentNodes - newNodes;
            const getMaxSourceChainLength = (conductor) => Math.max(...selectActiveCellsForConductor(this.blackboard.state)(conductor).map((cell) => cell.state.sourceChain.length));
            conductors = conductors.sort((c1, c2) => getMaxSourceChainLength(c1) - getMaxSourceChainLength(c2));
            conductors.splice(0, conductorsToRemove);
        }
        if (changedNodes) {
            const peers = conductors.map((c) => c.cells[dna].agentId);
            for (const conductor of conductors) {
                conductor.cells[dna].peers = peers.filter((p) => p !== conductor.cells[dna].agentId);
            }
        }
        this.blackboard.update('conductors', conductors);
        if (changedNodes ||
            selectRedundancyFactor(this.blackboard.state) !== rFactor) {
            const cells = conductors.map((c) => c.cells[dna]);
            for (const cell of cells) {
                cell.DHTOpTransforms = {};
                cell.redundancyFactor = rFactor;
            }
            for (const cell of cells) {
                cell.republish();
            }
        }
        this.processing = false;
    }
    updateDHTStats() {
        this.processing = true;
        if (this.timeout)
            clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.republish();
        }, 400);
    }
    render() {
        return html `
      ${this.renderStatsHelp()}
      <div class="column" style="position: relative;">
        <div style="padding: 16px;">
          <h3 class="title">Global DHT Stats</h3>

          <mwc-icon-button
            style="position: absolute; right: 8px; top: 8px;"
            icon="help_outline"
            @click=${() => (this.statsHelp.open = true)}
          ></mwc-icon-button>

          <div class="row center-content">
            <div class="row center-content" style="padding-right: 16px;">
              <span style="margin-right: 8px;">Number of nodes: </span
              ><mwc-textfield
                id="number-of-nodes"
                min="1"
                max="50"
                outlined
                type="number"
                style="width: 5em;"
                .disabled=${this.blackboard.state.conductorsUrls !== undefined}
                @change=${() => this.updateDHTStats()}
                .value=${selectCellCount(this.blackboard.state).toString()}
              ></mwc-textfield>
            </div>
            <div class="row center-content" style="padding-right: 24px;">
              <span style="margin-right: 8px;">Redundancy factor: </span
              ><mwc-textfield
                id="r-factor"
                min="1"
                max="50"
                outlined
                type="number"
                .disabled=${this.blackboard.state.conductorsUrls !== undefined}
                style="width: 5em;"
                @change=${() => this.updateDHTStats()}
                .value=${selectRedundancyFactor(this.blackboard.state).toString()}
              ></mwc-textfield>
            </div>
            <div class="column fill">
              <span style="margin-bottom: 2px;"
                >Unique DHT Ops:
                <strong
                  >${selectUniqueDHTOps(this.blackboard.state)}</strong
                ></span
              >
              <span style="margin-bottom: 2px;"
                >Median DHT Ops per node:
                <strong
                  >${selectMedianHoldingDHTOps(this.blackboard.state)}</strong
                ></span
              >
              <span
                >Global DHT Ops:
                <strong
                  >${selectGlobalDHTOps(this.blackboard.state)}</strong
                ></span
              >
            </div>
          </div>
        </div>
        ${this.processing
            ? html `<mwc-linear-progress indeterminate></mwc-linear-progress>`
            : html ``}
      </div>
    `;
    }
}
__decorate([
    query('#stats-help'),
    __metadata("design:type", Dialog)
], DHTStats.prototype, "statsHelp", void 0);
__decorate([
    query('#number-of-nodes'),
    __metadata("design:type", TextFieldBase)
], DHTStats.prototype, "nNodes", void 0);
__decorate([
    query('#r-factor'),
    __metadata("design:type", TextFieldBase)
], DHTStats.prototype, "rFactor", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Boolean)
], DHTStats.prototype, "processing", void 0);
customElements.define('holochain-playground-dht-stats', DHTStats);

export { DHTStats };
//# sourceMappingURL=holochain-playground-dht-stats.js.map
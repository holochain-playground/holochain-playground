import { Dictionary } from '@holochain-open-dev/core-types';
import { SimulatedZomeFunctionArgument } from '@holochain-playground/core';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { html } from 'lit';
import {
  css,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from 'lit-element';
import { isEqual } from 'lodash';
import { Button } from 'scoped-material-components/mwc-button';
import { Drawer } from 'scoped-material-components/mwc-drawer';
import { List } from 'scoped-material-components/mwc-list';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { Select } from 'scoped-material-components/mwc-select';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { sharedStyles } from '../utils/shared-styles';

export type CallableFnArgument =
  | {
      field: 'textfield';
      name: string;
      type: string;
    }
  | {
      name: string;
      field: 'custom';
      render: (value: any, setArgValue: (value: any) => void) => TemplateResult;
    };

export interface CallableFn {
  name: string;
  args: CallableFnArgument[];
  call: (args: Dictionary<any>) => void;
}

export class CallFns extends ScopedRegistryHost(LitElement) {
  @property()
  callableFns!: CallableFn[];

  @property()
  selectedFnName: string | undefined;

  get activeFn() {
    return (
      this.callableFns.find((fn) => fn.name === this.selectedFnName) ||
      this.callableFns[0]
    );
  }

  // Segmented by fnName/argName
  _arguments: Dictionary<Dictionary<any>> = {};

  update(changedValues: PropertyValues) {
    super.update(changedValues);
    if (
      changedValues.has('callableFns') &&
      changedValues.get('callableFns') &&
      !isEqual(
        this.callableFns.map((fn) => ({ name: fn.name, args: fn.args })),
        (changedValues.get('callableFns') as Array<CallableFn>).map((fn) => ({
          name: fn.name,
          args: fn.args,
        }))
      )
    ) {
      this._arguments = {};
    }
  }

  setArgument(fnName: string, argName: string, value: any) {
    if (!this._arguments[fnName]) this._arguments[fnName] = {};
    this._arguments[fnName][argName] = value;
    this.requestUpdate();
  }

  renderField(callableFn: CallableFn, arg: CallableFnArgument) {
    if (arg.field === 'textfield')
      return html`<mwc-textfield
        style="margin-top: 8px"
        outlined
        label=${arg.name + ': ' + arg.type}
        .value=${(this._arguments[callableFn.name] &&
          this._arguments[callableFn.name][arg.name]) ||
        ''}
        @input=${(e) =>
          this.setArgument(callableFn.name, arg.name, e.target.value)}
      ></mwc-textfield>`;
    if (arg.field === 'custom')
      return html`<div style="margin-top: 8px; display: contents;">
        ${arg.render(this._arguments[callableFn.name] || {}, (value) =>
          this.setArgument(callableFn.name, arg.name, value)
        )}
      </div>`;
  }

  renderCallableFunction(callableFunction: CallableFn) {
    return html` <div class="column" style="flex: 1; margin: 16px;">
      <div class="flex-scrollable-parent">
        <div class="flex-scrollable-container">
          <div class="flex-scrollable-y">
            <div class="column" style="flex: 1;">
              ${callableFunction.args.length === 0
                ? html`<span class="placeholder" style="margin-top: 28px;"
                    >This function has no arguments</span
                  >`
                : callableFunction.args.map((arg) =>
                    this.renderField(callableFunction, arg)
                  )}
            </div>
          </div>
        </div>
      </div>
      <mwc-button
        raised
        @click=${() =>
          callableFunction.call(this._arguments[callableFunction.name])}
        >Execute</mwc-button
      >
    </div>`;
  }
  render() {
    if (Object.keys(this.callableFns).length === 0)
      return html`<div class="fill center-content">
        <span class="placeholder" style="padding: 24px;"
          >There are no functions to call</span
        >
      </div> `;

    return html`
      <div class="flex-scrollable-parent">
        <div class="flex-scrollable-container">
          <div class="flex-scrollable-y" style="height: 100%">
            <mwc-drawer style="--mdc-drawer-width: auto;">
              <mwc-list
                activatable
                @selected=${(e) =>
                  (this.selectedFnName = this.callableFns[e.detail.index].name)}
              >
                ${this.callableFns.map(
                  ({ name }) => html`
                    <mwc-list-item .activated=${this.activeFn.name === name}
                      >${name}
                    </mwc-list-item>
                  `
                )}
              </mwc-list>
              <div slot="appContent" class="column" style="height: 100%;">
                <div class="column" style="flex: 1;">
                  ${this.renderCallableFunction(this.activeFn)}
                </div>
              </div>
            </mwc-drawer>
          </div>
        </div>
      </div>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex: 1;
      }
    `,
  ];

  static elementDefinitions = {
    'mwc-drawer': Drawer,
    'mwc-list': List,
    'mwc-list-item': ListItem,
    'mwc-button': Button,
    'mwc-textfield': TextField,
    'mwc-select': Select,
  };
}

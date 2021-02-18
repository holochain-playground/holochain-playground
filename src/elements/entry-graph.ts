import { LitElement, query, html, property, css } from 'lit-element';
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';

import { Checkbox } from 'scoped-material-components/mwc-checkbox';
import { IconButton } from 'scoped-material-components/mwc-icon-button';
import { Formfield } from 'scoped-material-components/mwc-formfield';
import { Card } from 'scoped-material-components/mwc-card';

import { allEntries } from '../processors/graph';
import { selectAllCells } from './utils/selectors';
import { sharedStyles } from './utils/shared-styles';
import { PlaygroundElement } from '../context/playground-element';
import { isEqual } from 'lodash-es';
import { HelpButton } from './helpers/help-button';
import { Menu } from 'scoped-material-components/mwc-menu';
import { Button } from 'scoped-material-components/mwc-button';
import { Icon } from 'scoped-material-components/mwc-icon';
import { ListItem } from 'scoped-material-components/mwc-list-item';

cytoscape.use(klay);

const layoutConfig = {
  name: 'klay',
  animate: true,
  ready: (e) => {
    e.cy.fit();
    e.cy.center();
  },
};

export class EntryGraph extends PlaygroundElement {
  @property({ type: Boolean })
  showFilter: boolean = true;

  @property({ type: Boolean })
  showEntryContents: boolean = true;

  @property({ type: Array })
  excludedEntryTypes: string[] = [];

  @query('#entry-graph')
  private entryGraph: HTMLElement;

  private lastEntriesIds: string[] = [];
  private cy;
  private layout;
  private ready = false;

  @property({ type: Array })
  private _entryTypes = [];

  @query('#visible-entries-button')
  private _visibleEntriesButton: Button;
  @query('#visible-entries-menu')
  private _visibleEntriesMenu: Menu;

  firstUpdated() {
    window.addEventListener('scroll', () => {
      this.cy.resize();
    });
    this.cy = cytoscape({
      container: this.entryGraph,
      boxSelectionEnabled: false,
      autoungrabify: false,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      layout: layoutConfig,
      style: `
              node {
                background-color: grey;
                font-size: 10px;
                width: 16px;
                label: data(label);
                height: 16px;
                shape: round-rectangle;
              }

              node > node {
                height: 1px;
              }
      
              edge {
                width: 2;
                target-arrow-shape: triangle;
                curve-style: bezier;
              }
              
              edge[label] {
                label: data(label);
                font-size: 7px;
                text-rotation: autorotate;
                text-margin-x: 0px;
                text-margin-y: -5px;
                text-valign: top;
                text-halign: center;        
              }
      
              .selected {
                border-width: 1px;
                border-color: black;
                border-style: solid;
              }
      
              .AgentId {
                background-color: lime;
              }
              .Create {
                background-color: blue;
              }
              .Delete {
                background-color: red;
              }
              .Update {
                background-color: cyan;
              }
              .CreateLink {
                background-color: purple;
              }
              .DeleteLink {
                background-color: purple;
              }
      
              .implicit {
                width: 1;
                line-style: dotted;
              }

              .update-edge {
                width: 1;
                line-style: dashed;
              }
              .updated {
                opacity: 0.5;
              }
              .deleted {
                opacity: 0.3;
              }
            `,
    });

    this.cy.on('tap', 'node', (event) => {
      const selectedEntryId = event.target.id();
      this.updatePlayground({
        activeEntryHash: selectedEntryId,
      });
    });

    this.cy.ready((e) => {
      setTimeout(() => {
        this.ready = true;
        this.updatedGraph();
      }, 500);
    });
  }

  updated(changedValues) {
    super.updated(changedValues);
    this.updatedGraph();
  }

  observedCells() {
    return selectAllCells(this.activeDna, this.conductors);
  }

  updatedGraph() {
    if (this.entryGraph.getBoundingClientRect().width === 0 || !this.ready) {
      return null;
    }

    const cells = selectAllCells(this.activeDna, this.conductors);

    const { entries, entryTypes } = allEntries(
      cells,
      this.showEntryContents,
      this.excludedEntryTypes
    );

    if (
      !isEqual(
        this.lastEntriesIds,
        entries.map((e) => e.data.id)
      )
    ) {
      if (this.layout) this.layout.stop();
      this.cy.remove('nodes');
      this.cy.add(entries);

      this.layout = this.cy.elements().makeLayout(layoutConfig);
      this.layout.run();

      this._entryTypes = entryTypes;
    }

    this.lastEntriesIds = entries.map((e) => e.data.id);

    this.cy.filter('node').removeClass('selected');
    this.cy.getElementById(this.activeEntryHash).addClass('selected');
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }

  renderHelp() {
    return html` <holochain-playground-help-button
      heading="Entry Graph"
      class="block-help"
    >
      <span>
        This graph contains a
        <strong>high-level view of all the entries</strong> that are present in
        the DHT. Every object you see represents an entry, and the relationships
        between them are links.
        <br />
        <br />
        Dashed relationships are embedded references, and solid relationships
        are normal holochain links. The tag of the holochain links appears as
        the label.
      </span>
    </holochain-playground-help-button>`;
  }

  renderFilter() {
    return html` <div
      class="row"
      style="align-items: center; justify-content: start; position: relative;"
    >
      <mwc-formfield label="Show Entry Contents" style="margin-right: 16px">
        <mwc-checkbox
          checked
          @change=${(e) => (this.showEntryContents = e.target.checked)}
        ></mwc-checkbox
      ></mwc-formfield>

      <span class="vertical-divider"></span>

      <mwc-button
        label="Visible entries"
        style="--mdc-theme-primary: rgba(0,0,0,0.7); margin-left: 16px;"
        icon="arrow_drop_down"
        id="visible-entries-button"
        trailingIcon
        @click=${() => this._visibleEntriesMenu.show()}
      ></mwc-button>
      <mwc-menu
        corner="BOTTOM_END"
        multi
        activatable
        id="visible-entries-menu"
        .anchor=${this._visibleEntriesButton}
        @selected=${(e) => {
          const includedEntryTypes = [...e.detail.index];
          this.excludedEntryTypes = this._entryTypes
            .filter((type, index) => !includedEntryTypes.includes(index));
        }}
      >
        ${this._entryTypes.map(
          (type) => html`
            <mwc-list-item
              graphic="icon"
              .selected=${!this.excludedEntryTypes.includes(type)}
              .activated=${!this.excludedEntryTypes.includes(type)}
            >
              ${!this.excludedEntryTypes.includes(type)
                ? html` <mwc-icon slot="graphic">check</mwc-icon> `
                : html``}
              ${type}
            </mwc-list-item>
          `
        )}
      </mwc-menu>
      <!-- 
      ${this._entryTypes.map(
        (entryType) => html`
          <mwc-formfield label="Show ${entryType}s">
            <mwc-checkbox
              .checked=${!this.excludedEntryTypes.includes(entryType)}
              @change=${(e) => {
                const excluded = this.excludedEntryTypes.includes(entryType);
                const toExclude = !e.target.checked;

                if (excluded && !toExclude) {
                  this.excludedEntryTypes = [
                    ...this.excludedEntryTypes.filter((t) => t !== entryType),
                  ];
                } else if (!excluded && toExclude) {
                  this.excludedEntryTypes = [
                    ...this.excludedEntryTypes,
                    entryType,
                  ];
                }
              }}
            ></mwc-checkbox
          ></mwc-formfield>
        `
      )} -->
    </div>`;
  }

  render() {
    return html`
      <mwc-card class="block-card">
        <div class="column fill" style="margin: 16px;">
          <span class="block-title">Entry Graph</span>

          <div id="entry-graph" class="fill"></div>

          ${this.renderHelp()} ${this.showFilter ? this.renderFilter() : html``}
        </div>
      </mwc-card>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-checkbox': Checkbox,
      'mwc-formfield': Formfield,
      'mwc-icon-button': IconButton,
      'mwc-card': Card,
      'mwc-menu': Menu,
      'mwc-icon': Icon,
      'mwc-list-item': ListItem,
      'mwc-button': Button,
      'holochain-playground-help-button': HelpButton,
    };
  }
}
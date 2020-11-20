import { LitElement } from 'lit-element';
import '@material/mwc-textarea';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-dialog';
import '@material/mwc-radio';
import '@material/mwc-formfield';
import '@alenaksu/json-viewer';
import { Playground } from '../state/playground';
declare const CreateEntries_base: {
    new (...args: any[]): import("../blackboard/blackboard-connect").PinnedElement<Playground> & LitElement & import("lit-element").Constructor<LitElement>;
    prototype: any;
};
export declare class CreateEntries extends CreateEntries_base {
    private selectedEntryType;
    private createTextarea;
    private createType;
    private updateTextarea;
    private updateHeaderAddress;
    private deleteHeaderAddress;
    private linkFromAddress;
    private linkToAddress;
    private linkTag;
    private deleteLinkAddress;
    zome: import("../dnas/simulated-dna").SimulatedZome;
    private zomeFnToCall;
    private dhtOpsToCreate;
    setEntryValidity(element: any): void;
    setHeaderValidity(element: any): void;
    setNonEmptyValidity(element: any): void;
    setJsonValidity(element: any): void;
    firstUpdated(): void;
    static get styles(): import("lit-element").CSSResult[];
    renderCreateEntry(): import("lit-element").TemplateResult;
    renderUpdateEntry(): import("lit-element").TemplateResult;
    renderDeleteEntry(): import("lit-element").TemplateResult;
    renderCreateLink(): import("lit-element").TemplateResult;
    renderDeleteLink(): import("lit-element").TemplateResult;
    cell(): import("../core/cell").Cell;
    openCommitDialog(fnName: string, payload: any): Promise<void>;
    buildDHTOps(fnName: string, payload: any): Promise<{
        DHTOp: any;
        neighborhood: string;
    }[]>;
    renderCommitDialog(): import("lit-element").TemplateResult;
    callZomeFunction(): Promise<void>;
    renderSelectCommitType(): import("lit-element").TemplateResult;
    renderConnectedPlaceholder(): import("lit-element").TemplateResult;
    render(): import("lit-element").TemplateResult;
}
export {};
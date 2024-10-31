import { IPlacement } from "../core/placement";

export interface IUgcComponent extends HTMLElement {
    placement?: IPlacement;
    getShadowRoot(): ShadowRoot;
    getPlacement(): IPlacement;
    getWidgetService(): any;
}

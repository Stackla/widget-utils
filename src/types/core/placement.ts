import { ITransformedWidgetRequest } from "./widget-request";
import { IUgcComponent } from "../components/ugc.component";
import { ITilesService } from "../services/tiles.service";
import { IEventService } from "../services/event.service";
import { Template } from "../types";
import { Config, ExpandedTileOptions, Style, WidgetOptions, WidgetResponse } from "../widgets";

export interface IPlacement {
    readonly selector: string;
    readonly widgetContainer: WidgetResponse;
    readonly widgetRequest: ITransformedWidgetRequest;
    ugcComponent?: IUgcComponent;
    tiles?: ITilesService;
    sharedCssStyles: any; // Define a more specific type if possible
    custom: any; // Define a more specific type if possible
    events?: IEventService;
    loadedComponents: string[];

    attachServices(): void;
    getStateFromGlobal(): any;
    getEvents(): IEventService;
    getLoadedComponents(): string[];
    addLoadedComponent(component: string): void;
    addLoadedComponents(components: string[]): void;
    getSelector(): string;
    getWidgetId(): string;
    getNodeName(): string;
    getWidgetContainer(): WidgetResponse;
    updateWidgetOptionsProperties(mutatedWidgetOptions: Partial<WidgetOptions>): void;
    updateWidgetStyle(mutatedStyle: Partial<Style>): void;
    updateExpandedTileOptions(mutatedExpandedTileOptions: Partial<ExpandedTileOptions>): void;
    updateWidgetConfig(mutatedConfig: Partial<Config>): void;
    updateInlineTileOptions(mutatedInlineTileOptions: Partial<ExpandedTileOptions>): void;
    updateFilterId(filterId: string): void;
    getPluginsSettings(): Record<string, { config: Record<string, never> }>;
    getElement(): Element;
    attachUGC(): void;
    loadComponents(): Promise<void>;
    getTilesService(): ITilesService;
    getAllTilesInDom(): any[] | NodeListOf<HTMLElement>;
    getShadowRoot(): ShadowRoot;
    querySelector<T extends Element = HTMLElement>(className: string): T;
    querySelectorAll<T extends Element = HTMLElement>(className: string): NodeListOf<T>;
    appendModuleScript(src: string): Promise<unknown>;
    getRootCSSImports(): string[];
    setRootCSSImports(content: string[]): void;
    getCustomStyles(component: string): string[];
    setCustomStyles(component: string, content: string): void;
    getWidgetCustomStyles(): string[];
    setWidgetCustomStyles(content: string): void;
    hasSharedStyles(componentName: string): boolean;
    setSharedCssCustomStyles(key: string, content: string, componentNames: string[]): void;
    getSharedCssStyleSheets(componentName: string): CSSStyleSheet[];
    getCustomTemplate(component: string): Template;
    setCustomTemplate(component: string, template: Template): void;
}

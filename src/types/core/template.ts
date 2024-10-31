export interface ITemplateService {
    loadTemplate(node: string | undefined, root: ShadowRoot | HTMLElement, templateType: string): Promise<unknown>;
    getGlobalCSSTemplate(node: string | undefined, templateType: string): string;
}

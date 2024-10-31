declare module "masonry-layout" {
    interface MasonryOptions {
        itemSelector?: string;
        columnWidth?: number | string;
        percentPosition?: boolean;
        gutter?: number | string;
        fitWidth?: boolean;
        originLeft?: boolean;
        originTop?: boolean;
        stamp?: string;
        visibleStyle?: object;
        hiddenStyle?: object;
        transitionDuration?: string;
        resize?: boolean;
        initLayout?: boolean;
        containerStyle?: object;
        stagger?: number;
    }

    class Masonry {
        constructor(options?: MasonryOptions);
        constructor(selector: string | Element, options?: MasonryOptions);

        masonry(): void;
        masonry(eventName: string, listener: any): void;

        layout(): void;
        layoutItems(items: any[], isStill?: boolean): void;
        stamp(elements: any[]): void;
        unstamp(elements: any[]): void;

        appended(elements: any[]): void;
        prepended(elements: any[]): void;
        addItems(elements: any[]): void;
        remove(elements: any[]): void;

        on(eventName: string, listener: any): void;
        off(eventName: string, listener: any): void;
        once(eventName: string, listener: any): void;

        reloadItems(): void;
        destroy(): void;
        getItemElements(): any[];
        data(element: Element): Masonry;
        option(options: MasonryOptions): void;
    }

    export = Masonry;
}

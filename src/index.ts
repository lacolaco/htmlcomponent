export interface ComponentOptions {
    template?: string;
    onInit?: (element: Element) => void;
    onDestroy?: (element: Element) => void;
}

export class RendereredHTML {
    constructor(private _html: string, private _destroyFn: () => void) {}

    get html() {
        return this._html;
    }

    destroy() {
        this._destroyFn();
    }
}

export class HTMLComponentRenderer {

    private _componentMap = new Map<string, ComponentOptions>();

    private _document: Document;

    constructor(d?: Document) {
        this._document = d || window.document;
    }

    registerComponent(selector: string, options: ComponentOptions) {
        this._componentMap.set(selector, options);
    }

    render(baseHTML: string): RendereredHTML {
        const host = this._document.createElement('div');
        host.innerHTML = baseHTML;

        const destroyFns = <Function[]>[];
        this._componentMap.forEach((component, selector) => {
            const elements = host.querySelectorAll(selector);
            if (!elements || elements.length === 0) {
                return;
            }
            Array.from(elements).forEach((element: Element) => {
                if (component.template) {
                    element.innerHTML = component.template;
                }
                if (component.onInit) {
                    component.onInit(element);
                }
                if (component.onDestroy) {
                    destroyFns.push(() => {
                        component.onDestroy(element);
                    });
                }
            });
        });
        const destroyFn = () => {
            destroyFns.forEach(fn => {
                fn();
            });
        };

        return new RendereredHTML(host.innerHTML, destroyFn);
    }
}
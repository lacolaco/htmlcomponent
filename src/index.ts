export interface HTMLDirective {
    selector: string;
    innerHTML?: string;
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

export class HTMLDirectiveRenderer {

    private _map = new Map<string, HTMLDirective>();

    private _document: Document;

    constructor(d?: Document) {
        this._document = d || window.document;
    }

    registerDirective(dir: HTMLDirective) {
        this._map.set(dir.selector, dir);
    }

    render(baseHTML: string): RendereredHTML {
        const host = this._document.createElement('div');
        host.innerHTML = baseHTML;

        const destroyFns = <Function[]>[];
        this._map.forEach((dir, selector) => {
            const elements = host.querySelectorAll(selector);
            if (!elements || elements.length === 0) {
                return;
            }
            Array.from(elements).forEach((element: Element) => {
                if (dir.innerHTML) {
                    element.innerHTML = dir.innerHTML;
                }
                if (dir.onInit) {
                    dir.onInit(element);
                }
                if (dir.onDestroy) {
                    destroyFns.push(() => {
                        dir.onDestroy(element);
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
const assert = require('assert');
const jsdom = require("jsdom").jsdom;

import {HTMLComponentRenderer} from '../index';

describe('HTMLComponentRenderer', () => {
    let doc: Document;

    beforeEach(() => {
        doc = jsdom("");
    });

    it('should render wo/ links', () => {
        const renderer = new HTMLComponentRenderer(doc);
        const result = renderer.render(`<div>Test</div>`);

        assert.deepStrictEqual(result.html, `<div>Test</div>`);
    });

    it('should render with simple component', () => {
        const renderer = new HTMLComponentRenderer(doc);
        renderer.registerComponent('custom-tag', {
            template: `<div>custom-tag</div>`,
        });

        const result = renderer.render(`<custom-tag></custom-tag>`);

        assert.deepStrictEqual(result.html, `<custom-tag><div>custom-tag</div></custom-tag>`);
    });

    it('should render with onInit callback', () => {
        const msgs = <string[]>[];
        const renderer = new HTMLComponentRenderer(doc);
        renderer.registerComponent('a[href]', {
            onInit: (anchor: HTMLAnchorElement) => {
                msgs.push(anchor.href);
            } 
        });

        const result = renderer.render(`<a href="test"></a>`);

        assert.deepStrictEqual(result.html, `<a href="test"></a>`);
        assert.deepStrictEqual(msgs, ["test"]);
    });
    it('should render with onDestroy callback', () => {
        const msgs = <string[]>[];
        const renderer = new HTMLComponentRenderer(doc);
        renderer.registerComponent('a[href]', {
            onDestroy: (anchor: HTMLAnchorElement) => {
                msgs.push(anchor.href);
            } 
        });

        const result = renderer.render(`<a href="test"></a>`);

        assert.deepStrictEqual(result.html, `<a href="test"></a>`);
        assert.deepStrictEqual(msgs, []);
        result.destroy();
        assert.deepStrictEqual(msgs, ["test"]);
    });
});
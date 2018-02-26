+(function(document) {
    xtag.register('nz-editor-autotrack-element', {
        lifecycle: {
            created: function() {
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/outline.css" inline>`;
                var innerHtml = '<div class="nz-editor-autotrack-element-highlight"></div>';
                shadow.innerHTML = style + innerHtml;
            }
        }
    })

    xtag.register('nz-editor-autotrack-selected-element', {
        lifecycle: {
            created: function() {
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/selected-element.css" inline>`;
                var innerHtml = '<div class="nz-editor-autotrack-selected-element-highlight"></div>';
                shadow.innerHTML = style + innerHtml;
            }
        }
    });

    xtag.register('nz-editor-autotrack-select-element-layer', {
        lifecycle: {
            created: function() {
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/select-element-layer.css" inline>`;
                var innerHtml =
                    `<div class="nz-editor-autotrack-select-element-highlight-layer"></div>`;
                shadow.innerHTML = style + innerHtml;
            }
        }
    });

    xtag.register('nz-editor-autotrack-select-prop-layer', {
        lifecycle: {
            created: function() {
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/select-prop-layer.css" inline>`;
                var innerHtml =
                    `<div class="nz-editor-autotrack-select-prop-highlight-layer"></div>`;
                shadow.innerHTML = style + innerHtml;
            }
        }
    });
}(document))
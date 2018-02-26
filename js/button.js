+(function(document) {
    xtag.register('nz-editor-button', {
        lifecycle: {
            created: function() {
                var shadow = this.createShadowRoot();
                var dotype = this.getAttribute('dotype');
                var className = this.getAttribute('class');
                var style = `<link rel="stylesheet" href="editor/css/button.css" inline>`;
                var innerHtml = '<div></div>';
                shadow.innerHTML = style + innerHtml;
                var buttonContent = shadow.querySelector('div');
                buttonContent.className = className;
                buttonContent.innerHTML = this.innerHTML;
                nzEvent(this).add('click', function(e) {
                    e.stopPropagation();
                    var editorLoader = document.querySelector('nz-editor-loader');
                    switch (dotype) {
                        case 'create':
                            nzEditorInspector.start();
                            editorLoader.create();
                            break;
                        case 'cancel':
                            nzEditorInspector.stop();
                            editorLoader.cancel();
                            break;
                        case 'save':
                            editorLoader.saveEvent();
                            break;
                        case 'saveProp':
                            editorLoader.setProp();
                            break;
                        case 'selectElementDone':
                            editorLoader.showModal();
                            editorLoader.create();
                            nzEditorInspector.restart();
                            break;
                        case 'selectElementCancel':
                            editorLoader.setEventCancel();
                            editorLoader.showModal();
                            editorLoader.create();
                            editorLoader.removePromptModal();
                            editorLoader.setSelectionType();
                            nzEditorInspector.restart();
                            break;
                        case 'selectPropCancel':
                            editorLoader.showModal();
                            editorLoader.create();
                            editorLoader.removeHighlight(true);
                            nzEditorInspector.restart();
                            break;
                        case 'promptCancel':
                            editorLoader.removePromptModal();
                            break;
                        case 'promptCreate':
                            if (editorLoader.setCustomCsspath()) {
                                editorLoader.removePromptModal();
                            }
                            break;
                    }
                    return false;
                });
            }
        },
    });
}(document))
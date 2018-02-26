+(function(document) {
    xtag.register('nz-editor-select-modal', {
        lifecycle: {
            created: function() {
                var that = this;
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/modal.css" inline>`;
                var innerHtml =
                    `<div class="nz-editor-select-dom-modal">
                        <div class="nz-editor-select-dom-modal-header-closeBtn">x</div>
                        <div class="nz-editor-select-dom-modal-header">
                            监测所有页面
                        </div>
                        <!-- 
                        <div class="nz-editor-select-dom-modal-event-count">
                            加载中...
                        </div>
                        -->
                        <div class="nz-editor-select-dom-modal-save-row">
                            <input type="text" placeholder="输入事件名称" class="nz-editor-select-dom-modal-save-row-input" />
                            <nz-editor-button dotype="save" class="nz-editor-button nz-editor-button-primary">保存</nz-editor-button>
                        </div>
                        <div class="nz-editor-select-dom-modal-additional-actions">
                            <div class="nz-editor-select-dom-modal-similar-elements">
                                <span class="nz-editor-select-dom-modal-hoverable">
                                    <div class="nz-editor-select-dom-modal-label">元素</div>
                                    <div class="nz-editor-select-dom-modal-add-btn add-element">+</div>
                                </span>
                                <span class="nz-editor-added"></span>
                            </div>
                            <div class="nz-editor-select-dom-modal-properties">
                                <span class="nz-editor-select-dom-modal-hoverable">
                                    <div class="nz-editor-select-dom-modal-label">属性</div>
                                    <div class="nz-editor-select-dom-modal-add-btn add-properties">+</div>
                                </span>
                                <span class="nz-editor-added"></span>
                            </div>
                        </div>
                    </div>`;
                shadow.innerHTML = style + innerHtml;

                //添加元素
                nzEvent(shadow.querySelector('.nz-editor-select-dom-modal-add-btn.add-element'))
                    .add('click', function() {
                        var editorLoader = document.querySelector('nz-editor-loader');
                        editorLoader.selectElement();
                        nzEditorInspector.stop();
                    });

                //添加属性
                nzEvent(shadow.querySelector('.nz-editor-select-dom-modal-add-btn.add-properties'))
                    .add('click', function() {
                        var editorLoader = document.querySelector('nz-editor-loader');
                        editorLoader.selectProperty();
                        nzEditorInspector.restart(true, true);
                    });
                //关闭按钮
                nzEvent(shadow.querySelector('.nz-editor-select-dom-modal-header-closeBtn'))
                    .add('click', function() {
                        that.remove();
                        var editorLoader = document.querySelector('nz-editor-loader');
                        editorLoader.removeHighlight();
                    });
            }
        }
    })

    xtag.register('nz-editor-prompt', {
        lifecycle: {
            created: function() {
                var that = this;
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/prompt.css" inline>`;

                var innerHtml =
                    `<div class="nz-editor-prompt-modal">
                        <div class="nz-editor-prompt-modal-content">
                            <div class="nz-editor-prompt-modal-title">自定义选择器</div>
                            <div class="nz-editor-prompt-modal-description">自定义CSS选择器使您可以自由定义事件</div>
                            <textarea autofocus placeholder="a.nav-item, a.mp-autotrack-header-item" class="nz-editor-prompt-modal-input"></textarea>
                            <div class="nz-editor-prompt-modal-action">
                                <div class="nz-editor-prompt-modal-action-left"></div>
                                <div class="nz-editor-prompt-modal-action-right">
                                    <nz-editor-button dotype="promptCancel" class="nz-editor-button">取消</nz-editor-button>
                                    <nz-editor-button dotype="promptCreate" class="nz-editor-button nz-editor-button-primary">应用</nz-editor-button>
                                </div>
                                <div class="nz-editor-prompt-modal-action-clear"></div>
                            </div>
                        </div>
                    </div>`;
                shadow.innerHTML = style + innerHtml;
            }
        }
    })

    xtag.register('nz-editor-select-prop-modal', {
        lifecycle: {
            created: function() {
                var that = this;
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/propModal.css" inline>`;

                var innerHtml =
                    `<div class="nz-editor-select-dom-modal">
                        <div class="nz-editor-select-dom-modal-header-closeBtn">x</div>
                        <div class="nz-editor-select-dom-modal-header">
                            添加属性
                        </div>
                        <div class="nz-editor-select-dom-modal-save-row">
                            <input type="text" placeholder="输入属性名称" class="nz-editor-select-dom-modal-save-row-input" />
                            <nz-editor-button dotype="saveProp" class="nz-editor-button nz-editor-button-primary">保存</nz-editor-button>
                        </div>
                    </div>`;
                shadow.innerHTML = style + innerHtml;
                nzEvent(shadow.querySelector('.nz-editor-select-dom-modal-header-closeBtn'))
                    .add('click', function() {
                        that.remove();
                        var editorLoader = document.querySelector('nz-editor-loader');
                        editorLoader.removeHighlight(true);
                    });
            }
        }
    })
}(document))
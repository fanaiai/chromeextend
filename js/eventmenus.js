+(function(document) {
    var generateContents = function(show, events, search) {
        if (show && events) {
            if (events.length == 0 && !search) {
                return `<div class="contents">
                    <div class="event-list">
                        <div class="no-event">
                            <div class="title">还没有创建事件</div>
                            <div class="body">点击创建按事件按钮来监测你的事件</div>
                        </div>
                    </div>
                </div>`;
            } else {
                var eventRows = `<div class="event-rows">`;
                if (events.length > 0) {
                    events.forEach(function(element) {
                        eventRows += `<div class="event-row">
                    <div class="name">` + element.name + `</div>
                        <div class="delete" data-eid="` + element.e_id + `">
                            <div class="icon">
                                <div>
                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 10 11" style="enable-background:new 0 0 10 11;" xml:space="preserve"><style type="text/css">	.trash{fill:#D8E0E7;}</style><path class="trash" d="M8,1c0-0.6-0.4-1-1-1H3C2.4,0,2,0.4,2,1v2H1C0.4,3,0,3.4,0,4l0,0c0,0.6,0.4,1,1,1l0,0v4v1c0,0.6,0.4,1,1,1h6	c0.6,0,1-0.4,1-1V5l0,0c0.6,0,1-0.4,1-1l0,0c0-0.6-0.4-1-1-1H8V1z M4,2h2v1H4V2z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    }, this);
                } else {
                    eventRows += `<div class="event-row" style="text-align: center;font-size: 12px;line-height: 40px;">没有数据</div>`;
                }
                eventRows += `</div>`;
                return `<div class="contents">
                <div class="event-list">
                    <div class="search-row">
                        <input type="text" placeholder="输入事件名称,按回车查询" class="search"/>
                    </div>
                    <!-- 
                    <div class="page-btn-row">
                        <div class="page-btn">
                            <div class="page-btn this-page selected">本页</div>
                            <div class="page-btn all-page">所有页面</div>
                        </div>
                    </div>
                    -->
                    ` + eventRows +
                    `</div>
            </div>`;
            }
        }
    }

    xtag.register('nz-editor-event-menus', {
        lifecycle: {
            created: function() {
                var shadow = this.createShadowRoot();
                var style = `<link rel="stylesheet" href="editor/css/eventmenus.css" inline>`;
                var getInnerHtml = function(contents) {
                    return `<div class="nz-editor-app-loader-event-menus">
                        <div class="btn">
                            <div class="label">所有事件</div>
                            <div class="icon">
                                <div>
                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 10 6" style="enable-background:new 0 0 10 6;" xml:space="preserve"><path class="arrow" d="M9.8,1.5C10,1.3,10,1,9.8,0.8L9.1,0.2C8.9,0,8.6,0,8.4,0.2L5,3.4L1.6,0.1C1.4,0,1.1,0,0.9,0.1L0.1,0.8	C0,1,0,1.3,0.1,1.5l4.5,4.3C4.8,6,5.2,6,5.4,5.8L9.8,1.5z"></path></svg>
                                </div>
                            </div>
                        </div>
                        ` + (contents || '') + `
                    </div>`;
                }

                var show = false;
                var setInnrHtml = function(contents, keyword) {
                    shadow.innerHTML = style + getInnerHtml(contents);
                    nzEvent(shadow.querySelector('.nz-editor-app-loader-event-menus>.btn')).add('click', function(e) {
                        show = !show;
                        var editorLoader = document.querySelector('nz-editor-loader');
                        var events = editorLoader.getEvents();
                        setInnrHtml(generateContents(show, events));
                    });
                    var searchInputEle = shadow.querySelector('.nz-editor-app-loader-event-menus>.contents>.event-list>.search-row>input');
                    if (!!searchInputEle) {
                        if (keyword) {
                            searchInputEle.focus();
                            searchInputEle.value = keyword;
                        }
                        nzEvent(searchInputEle).add('keyup', function(e) {
                            if (e.keyCode == 13) {
                                var editorLoader = document.querySelector('nz-editor-loader');
                                var events = editorLoader.getEvents();
                                var name = this.value;
                                setInnrHtml(generateContents(show, events.filter(function(event) {
                                    if (event.name.toLowerCase().indexOf(name) != -1) {
                                        return event;
                                    }
                                }), true), name);
                            }
                        });
                    }

                    var nameEle = shadow.querySelector('.nz-editor-app-loader-event-menus>.contents>.event-list>.event-rows>.event-row>.name');
                    if (!!nameEle) {
                        nzEvent(nameEle).add('click', function(e) {
                            var editorLoader = document.querySelector('nz-editor-loader');
                            var name = this.innerText;
                            editorLoader.backfill(name);
                        });
                    }

                    var rowEles = shadow.querySelectorAll('.nz-editor-app-loader-event-menus>.contents>.event-list>.event-rows>.event-row');
                    if (rowEles.length > 0) {
                        rowEles.forEach(function(element) {
                            nzEvent(element).add('mouseover', function(e) {
                                var editorLoader = document.querySelector('nz-editor-loader');
                                var name = this.innerText;
                                editorLoader.backfill(name, true);
                            }).add('click', function(e) {
                                var editorLoader = document.querySelector('nz-editor-loader');
                                var name = this.innerText;
                                editorLoader.editEvent(name);
                            });
                            nzEvent(element).add('mouseout', function(e) {
                                var editorLoader = document.querySelector('nz-editor-loader');
                                editorLoader.setElementHighLight();
                            });
                            nzEvent(element.querySelector('.delete')).add('click', function(e) {
                                e.stopPropagation();
                                var editorLoader = document.querySelector('nz-editor-loader');
                                editorLoader.deleteEvent(this.getAttribute('data-eid'));
                            });
                        }, this);
                    }
                };
                setInnrHtml(generateContents(show));
            }
        }
    })
}(document))
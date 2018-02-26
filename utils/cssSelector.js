+(function(window) {
    window.generateCssSelector = function(element) {
        return OptimalSelect.select(element, {
            root:"body",
            ignore: {
                id(id) {
                    // don't use id if it looks like a generated id
                    return /[0-9]{3}/.test(id);
                },
                attribute(attr, val) {
                    switch (attr) {
                        case 'href':
                            // don't use href if it looks dynamic
                            return /[0-9]{3}|\?/.test(val);
                        default:
                            // don't use any other attributes (such as data-) as they tend to be dynamic
                            return true;
                    }
                },
                class(c) {
                    return !shouldIncludeCssClass(c);
                },
            },
        });
    }

    window.generateGeneralCssSelector = function(element) {
        const generalizedClasses = (element.getAttribute('class') || '')
            .split(' ')
            .filter(shouldIncludeCssClass)
            .map(c => cssesc(c, { isIdentifier: true }));
        let generalizedSelector = element.tagName;
        if (generalizedClasses.length) {
            generalizedSelector += '.' + generalizedClasses.join('.');
        }
        for (let curEl = element.parentNode; curEl !== document.body && curEl.parentNode; curEl = curEl.parentNode) {
            if (Array.from(curEl.querySelectorAll(generalizedSelector)).length > 1) {
                const sel = generateCssSelector(curEl) + ' ' + generalizedSelector;
                return sel;
            }
        }
        return generalizedSelector;
    }

    window.shouldIncludeCssClass = function(cls) {
        if (!cls) {
            return false;
        }

        if (['odd', 'even', 'active', 'selected', 'highlight', 'required', 'req', 'first', 'last', 'hover'].includes(cls)) {
            return false;
        }

        if (cls.includes('(')) {
            return false;
        }
        return true;
    }
}(window))
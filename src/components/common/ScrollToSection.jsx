// src/components/common/ScrollToSection.js
export function getScrollParent(node) {
    if (!node) return null;
    let parent = node.parentElement;
    const overflowRegex = /(auto|scroll|overlay)/;

    while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;
        const overflowX = style.overflowX;
        const canScrollY = overflowRegex.test(overflowY);
        const canScrollX = overflowRegex.test(overflowX);

        if (canScrollY || canScrollX) return parent;
        parent = parent.parentElement;
    }
    // If none found, fallback to document.scrollingElement or window
    return document.scrollingElement || document.documentElement;
}

function scrollElementIntoViewWithinScrollParent(scrollParent, targetEl, offset = 16) {
    if (!scrollParent || !targetEl) return;
    // Compute top relative to the scrollParent
    const parentRect = scrollParent.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // If scrollParent is the document element, use window.scrollTo behavior
    const isDocument = (scrollParent === document.documentElement || scrollParent === document.scrollingElement);
    if (isDocument) {
        const top = window.pageYOffset + targetRect.top - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
    }

    // Otherwise compute desired scrollTop inside the scrollParent
    const currentScroll = scrollParent.scrollTop;
    // distance from top of scrollParent to top of target element
    const relativeTop = targetRect.top - parentRect.top;
    const targetScroll = currentScroll + relativeTop - offset;

    scrollParent.scrollTo({ top: targetScroll, behavior: 'smooth' });
}

export function scrollToSection(id, options = {}) {
    if (!id) return;
    const selector = typeof id === 'string' && id.startsWith('#') ? id : `#${id}`;

    const tryScroll = (el) => {
        const scrollParent = getScrollParent(el);
        scrollElementIntoViewWithinScrollParent(scrollParent, el, options.offset ?? 16);
    };

    // Try immediate find
    let el = document.querySelector(selector);
    if (el) {
        tryScroll(el);
        return;
    }

    // If not found, observe mutations for a short time (page navigation/render)
    const observer = new MutationObserver((mutations, obs) => {
        const found = document.querySelector(selector);
        if (found) {
            tryScroll(found);
            obs.disconnect();
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Safety: stop observing after 2.5s
    setTimeout(() => observer.disconnect(), 2500);
}

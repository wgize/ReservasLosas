// src/components/utils/ScrollWithOffset.js
export function getScrollableParent(element) {
    if (!element) return null;
    let parent = element.parentElement;
    const overflowRegex = /(auto|scroll|overlay)/;

    while (parent) {
        const style = window.getComputedStyle(parent);
        if (overflowRegex.test(style.overflowY) || overflowRegex.test(style.overflow)) {
            return parent;
        }
        parent = parent.parentElement;
    }
    return document.scrollingElement || document.documentElement;
}

export function scrollWithOffset(id, offset = 20) {
    const el = document.getElementById(id);
    if (!el) return false;

    const parent = getScrollableParent(el);
    if (!parent) return false;

    const parentRect = parent.getBoundingClientRect();
    const targetRect = el.getBoundingClientRect();
    const scrollTop = parent.scrollTop + (targetRect.top - parentRect.top) - offset;

    parent.scrollTo({ top: scrollTop, behavior: "smooth" });
    return true;
}

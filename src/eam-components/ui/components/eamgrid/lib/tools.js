/**
 * Implementation of findIndex which is compatible with IE 11
 * @param items, itemLabel, itemToBeFound
 */
export function findIndex(items, itemLabel, itemToBeFound) {
    let index = -1;
    items.some(function(el, i) {
        if (el[itemLabel] === itemToBeFound) {
            index = i;
            return true;
        }
    });
    return index;
}
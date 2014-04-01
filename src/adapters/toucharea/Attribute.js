/**
 * Attribute name
 *
 * @type String
 * @static
 * @final
 */
var ATTRIBUTE = 'touch-action';

/**
 * @class Pointer.Adapter.TouchArea.Attribute
 * @static
 */
var TouchAreaAttribute = {

    /**
     * Determine if `target` or a parent node of `target` has
     * a `touch-action` attribute with a value of `none`.
     *
     * @method hasTouchAction
     * @param {Element} target
     * @param {Function} target.getAttribute
     * @returns {Boolean}
     */
    detect: function(target) {
        while (target.getAttribute && !target.getAttribute(ATTRIBUTE)) {
            target = target.parentNode;
        }

        return target.getAttribute && target.getAttribute(ATTRIBUTE) === 'none' || false;
    }

};

module.exports = TouchAreaAttribute;
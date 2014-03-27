/**
 * Default properties to apply to newly created events
 *
 * These values are only used in values do not exists in the
 * `properties` or `originalEvent` object called with `create` method
 *
 * @type Object
 * @static
 */
var PROPS = {
    view: null,
    detail: null,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: null
};

/**
 * Method names to override in event
 *
 * @type String[]
 * @static
 */
var OVERRIDE_METHODS = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'];

/**
 * Override original method in `event` to also call same method in `originalEvent`
 *
 * @param {Event} event
 * @param {MouseEvent|TouchEvent} originalEvent
 * @param {String} method
 * @private
 */
var _overrideMethod = function(event, originalEvent, method) {
    var originalMethod = event[method];
    event[method] = function() {
        originalEvent[method]();
        originalMethod.call(this);
    };
};

/**
 * Native pointer event creation and dispatching.
 * Only IE9+ is supported
 *
 * @class Pointer.Adapter.Native
 * @static
 */
var Native = {

    /**
     * @method create
     * @param {String} type
     * @param {MouseEvent|TouchEvent} originalEvent
     * @param {Object} properties
     * @param {Boolean} [properties.noBubble]
     * @return {Event}
     */
    create: function(type, originalEvent, properties) {
        var event = document.createEvent('Event');
        event.initEvent(type, !properties.noBubble, true);

        var prop;

        // Add event properties
        for (prop in PROPS) {
            if (PROPS.hasOwnProperty(prop)) {
                event[prop] = properties[prop] || originalEvent[prop] || PROPS[prop];
            }
        }

        var i = 0;
        var length = OVERRIDE_METHODS.length;

        // Override event methods to also call `originalEvent` methods
        for (; i < length; i++) {
            _overrideMethod(event, originalEvent, OVERRIDE_METHODS[i]);
        }

        return event;
    },

    /**
     * @method trigger
     * @param {Event} event
     * @param {HTMLElement} target
     */
    trigger: function(event, target) {
        target.dispatchEvent(event);
    }

};

module.exports = Native;
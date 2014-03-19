var Events = require('./event/Events');
var EventMap = require('./event/Map');
var Adapter = require('Adapter');
var Util = require('./Util');

/**
 * Pointer events that should not bubble
 * @type String[]
 * @static
 */
var NO_BUBBLE_EVENTS = [Events.ENTER, Events.LEAVE];

/**
 * Properties to copy from original event to new event
 *
 * @type String[]
 * @static
 */
var PROPS = 'screenX screenY pageX pageY offsetX offsetY'.split(' ');

/**
 * Create and trigger pointer events
 *
 * @class Pointer.PointerEvent
 * @static
 */
var PointerEvent = {

    /**
     * Create a new pointer event
     *
     * @method create
     * @param {String} type
     * @param {MouseEvent|TouchEvent} originalEvent
     * @return {*} Event created from adapter
     */
    create: function(type, originalEvent) {
        var properties = {
            noBubble: Util.indexOf(NO_BUBBLE_EVENTS, type) !== -1
        };

        var source = originalEvent;

        if (originalEvent.type.indexOf('touch') === 0) {
            properties.changedTouches = originalEvent.changedTouches;
            properties.touches = originalEvent.touches;
            source = properties.changedTouches[0];
        }

        var i = 0;
        var length = PROPS.length;

        for (; i < length; i++) {
            if (source.hasOwnProperty(PROPS[i])) {
                properties[PROPS[i]] = source[PROPS[i]];
            }
        }

        return Adapter.create(type, originalEvent, properties);
    },

    /**
     * Trigger a pointer event from a native mouse/touch event
     *
     * @method trigger
     * @param {MouseEvent|TouchEvent} originalEvent
     * @param {String} [overrideType] Use this event instead of `originalEvent.type` when mapping to a pointer event
     */
    trigger: function(originalEvent, overrideType) {
        if (!originalEvent || !EventMap.hasOwnProperty(originalEvent.type)) {
            return;
        }

        var eventName = overrideType || originalEvent.type;
        var types = EventMap[eventName];

        var i = 0;
        var length = types.length;
        var event;

        for (; i < length; i++) {
            event = PointerEvent.create(types[i], originalEvent);
            if (event) {
                Adapter.trigger(event, originalEvent.target);
            }
        }
    }

};

module.exports = PointerEvent;
var App = {

    defaultOpts: {
        'audioSrc': null,
        'container': 'body',
        'fadeInTime': 2000,
        'fadeOutTime': 2000
    },

    displayed: null,

    events: {
        events: [],
        
        push: function(timestamp, item) {
            this.events.push([timestamp, item]);
            this.events.sort(function (item1, item2) {
                if (item1[0] < item2[0]) { return -1; }
                if (item1[0] > item2[0]) { return 1; }
                return 0;
            });
        },

        /*
         * Find the item that should be displayed for the given timestamp
         */
        lookup: function (timestamp) {
            //
            // Timeline:   1             2             3              4             5
            // Events:                     2.2       2.9      3.5                4.9
            // 
            // Lookup of 2.8 should return the event at 2.2
            // Lookup of 1.1 should return null
            // Lookup of 5.0 should return event at 4.9
            // Lookup of 3.5 should return event at 3.5
            //
            var prev = null;
            $.each(this.events, function (index, item) {
                prev = item[1];
                if (item[0] > timestamp) {
                    return false;
                }
            });

            return prev;
        }
    },

    init: function (opts) {
        this.opts = App.util.extend({}, this.defaultOpts, opts);

        this.makeAudio(this.opts.audioSrc, this.opts.container);

        // Add the default first event at timestamp 0
        this.addEvent(0, '');
    },

    makeAudio(src, container) {
        var $container = $(container);
        var $audio = $('<audio>', {'src': src, 'class': 'audio'});
        $container.append($audio);
        this.audio = $audio.get(0);

        this.audio.addEventListener('timeupdate', function (event){
            var currentTime = parseFloat(App.audio.currentTime.toFixed(1));
            App.nextUp(currentTime);
        },false);
    },

    addEvent: function (timestamp, message) {
        var $div = $('<div>', {'style': 'display: none;', 'class': 'message'});
        $div.html(message);
        $('body').append($div);
        this.events.push(timestamp, $div);
    },

    nextUp: function(timestamp) {
        var item = this.events.lookup(timestamp);

        if (this.displayed !== null && this.displayed !== item) {
            this.displayed.fadeOut(this.opts.fadeOutTime);
        }
        
        if (this.displayed !== item) {
            this.displayed = item;
            this.displayed.fadeIn(this.opts.fadeInTime);
        }
    },

    play: function() {
        this.audio.play();
    }
};
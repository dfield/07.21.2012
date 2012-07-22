function Oscillator(period, amplitude) {
    this.currenttime = 0;
    this.period = (period || 1) / 2 / Math.PI;
    this.amplitude = amplitude || 1;
}

Oscillator.prototype = {
    advance: function(seconds) {
        this.currenttime = (this.currenttime + seconds / this.period) % (2 * Math.PI);
    },
    
    advanceToZero: function(seconds) {
        if (this.currenttime < Math.PI) {
                this.currenttime = Math.max(0, Math.min(this.currenttime, Math.PI - this.currenttime) - seconds / this.period);
            } else {
                    this.currenttime = Math.max(Math.PI, Math.min(this.currenttime, 3 * Math.PI - this.currenttime) - seconds / this.period);
                    if (this.currenttime == Math.PI) this.currenttime = 0;
                } 
    },

    advanceToMax: function(seconds) {
    },

    get: function(offset) {
        return Math.sin(this.currenttime + (offset || 0)) * this.amplitude;
    }
};


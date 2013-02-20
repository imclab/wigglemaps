function TimeSeries (selector, options) {
    if (options === undefined)
        options = {};
    BaseEngine.call (this, selector, options);

    default_model (options, {
        'range': new Box (new vect (0, 0), new vect (1, 1))
    });

    this.styles = {
        'default': {
            'fill': new Color (.02, .44, .69, 1.0),
            'fill-opacity': .5,
            'stroke': new Color (.02, .44, .69, 1.0),
            'stroke-opacity': 1.0,
            'stroke-width': 2.0,
        }
    };
    
    this.Renderers = {
        'default': TimeSeriesRenderer
    };
};

var SHP_HEADER_LEN = 8;

var SHP_NULL = 0;
var SHP_POINT = 1;
var SHP_POLYGON = 5;

var read_header = function (data) {
    var code = bint32 (data, 0);
    var length = bint32 (data, 24);
    var version = lint32 (data, 28);
    var shapetype = lint32 (data, 32);
    
    var xmin = ldbl64 (data, 36);
    var ymin = ldbl64 (data, 44);
    var xmax = ldbl64 (data, 52);
    var ymax = ldbl64 (data, 60);
    return {
        code: code,
        length: length,
        version: version,
        shapetype: shapetype,
        bounds: new Box (vect (xmin, ymin), vect (xmax, ymax))
    };
};

var load_shx = function (data) {
    var indices = [];
    var append_index = function (offset) {
        indices.push (2 * bint32 (data, offset));
        return offset + 8;
    };
    var offset = 100;
    while (offset < data.length) {
        offset = append_index (offset);
    }
    return indices;
};

var Shapefile = function (options) {
    var path = options.path;
    $.ajax ({
        url: path + '.shx',
        mimeType: 'text/plain; charset=x-user-defined',
        success: function (data) {
            var indices = load_shx (data);

            $.ajax ({
                url: path + '.shp',
                mimeType: 'text/plain; charset=x-user-defined',
                success: function (data) {
                    $.ajax ({
                        url: path + '.dbf',
                        mimeType: 'text/plain; charset=x-user-defined',
                        success: function (dbf_data) {
                            var layer = load_shp (data, dbf_data, indices, options);
                            options.success (layer);
                        }
                    });
                }
            });
        }
    });
};

var load_dbf = function (data) {
    var read_header = function (offset) {
        var name = str (data, offset, 10);
        var type = str (data, offset + 11, 1);
        var length = int8 (data, offset + 16);
        return {
            name: name,
            type: type,
            length: length
        };
    };

    // Level of the dBASE file
    var level = int8 (data, 0);

    if (level == 4)
        throw "Level 7 dBASE not supported";

    // Date of last update
    var year = int8 (data, 1);
    var month = int8 (data, 2);
    var day = int8 (data, 3);

    var num_entries = lint32 (data, 4);

    var header_size = lint16 (data, 8);
    var record_size = lint16 (data, 10);

    var FIELDS_START = 32;
    var HEADER_LENGTH = 32;
    
    var header_offset = FIELDS_START;
    var headers = [];
    while (header_offset < header_size - 1) {
        headers.push (read_header (header_offset));
        header_offset += HEADER_LENGTH;
    }

    var records = [];
    var record_offset = header_size;
    while (record_offset < header_size + num_entries * record_size) {
        var declare = str (data, record_offset, 1);
        if (declare == '*') {
            // Record size in the header include the size of the delete indicator
            record_offset += record_size;
        }
        else {
            // Move offset to the start of the actual data
            record_offset ++;
            var record = {};
            for (var i = 0; i < headers.length; i ++) {
                var header = headers[i];
                var value;
                if (header.type == 'C') {
                    value = str (data, record_offset, header.length).trim ();
                }
                else if (header.type == 'N') {
                    value = parseFloat (str (data, record_offset, header.length));
                }
                record_offset += header.length;
                record[header.name] = value;
            }
            records.push (record);
        }
    }
    return records;
};

var load_shp = function (data, dbf_data, indices, options) {
    var features = [];

    var read_ring = function (offset, start, end) {
        var ring = [];
        for (var i = end - 1; i >= start; i --) {
            var x = ldbl64 (data, offset + 16 * i);
            var y = ldbl64 (data, offset + 16 * i + 8);
            ring.push ([x, y]);
        }
        //if (ring.length <= 3)
        //    return [];
        return ring;
    };

    var read_record = function (offset) {
        var index = bint32 (data, offset);
        var record_length = bint32 (data, offset + 4);

        var record_offset = offset + 8;

        var geom_type = lint32 (data, record_offset);

        if (geom_type == SHP_NULL) {
            console.log ("NULL Shape");
            //return offset + 12;
        }
        else if (geom_type == SHP_POINT) {
            var x = ldbl64 (data, record_offset + 4);
            var y = ldbl64 (data, record_offset + 12);
            
            features.push ({
                type: 'Point',
                attr: {},
                geom: [[x, y]]
            });
        }
        else if (geom_type == SHP_POLYGON) {
            var num_parts = lint32 (data, record_offset + 36);
            var num_points = lint32 (data, record_offset + 40);
            
            var parts_start = offset + 52;
            var points_start = offset + 52 + 4 * num_parts;

            var rings = [];
            for (var i = 0; i < num_parts; i ++) {
                var start = lint32 (data, parts_start + i * 4);
                var end;
                if (i + 1 < num_parts) {
                    end = lint32 (data, parts_start + (i + 1) * 4);
                }
                else {
                    end = num_points;
                }
                var ring = read_ring (points_start, start, end);
                rings.push (ring);
            }
            features.push ({
                type: 'Polygon',
                attr: {},
                geom: [rings]
            });
        }
        else {
            throw "Not Implemented: " + geom_type;
        }
        //return offset + 2 * record_length + SHP_HEADER_LEN;
    };

    var attr = load_dbf (dbf_data);

    //var offset = 100;
    //while (offset < length * 2) {
    //    offset = read_record (offset);
    //}
    for (var i = 0; i < indices.length; i ++) {
        var offset = indices[i];
        read_record (offset);
    }

    var layer = new Layer ();

    for (var i = 0; i < features.length; i ++) {
        var feature = features[i];
        feature.attr = attr[i];
        layer.append (feature);
    }

    return layer;
};

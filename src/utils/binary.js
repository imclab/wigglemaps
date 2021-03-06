var int8 = function (data, offset) {
    return data.charCodeAt (offset);
};

var bint32 = function (data, offset) {
    return (
        ((data.charCodeAt (offset) & 0xff) << 24) +
            ((data.charCodeAt (offset + 1) & 0xff) << 16) +
            ((data.charCodeAt (offset + 2) & 0xff) << 8) +
            (data.charCodeAt (offset + 3) & 0xff)
    );
};

var lint32 = function (data, offset) {
    return (
        ((data.charCodeAt (offset + 3) & 0xff) << 24) +
            ((data.charCodeAt (offset + 2) & 0xff) << 16) +
            ((data.charCodeAt (offset + 1) & 0xff) << 8) +
            (data.charCodeAt (offset) & 0xff)
    );
};

var bint16 = function (data, offset) {
    return (
        ((data.charCodeAt (offset) & 0xff) << 8) +
            (data.charCodeAt (offset + 1) & 0xff)
    );
};

var lint16 = function (data, offset) {
    return (
        ((data.charCodeAt (offset + 1) & 0xff) << 8) +
            (data.charCodeAt (offset) & 0xff)
    );
};

var ldbl64 = function (data, offset) {
    var b0 = data.charCodeAt (offset) & 0xff;
    var b1 = data.charCodeAt (offset + 1) & 0xff;
    var b2 = data.charCodeAt (offset + 2) & 0xff;
    var b3 = data.charCodeAt (offset + 3) & 0xff;
    var b4 = data.charCodeAt (offset + 4) & 0xff;
    var b5 = data.charCodeAt (offset + 5) & 0xff;
    var b6 = data.charCodeAt (offset + 6) & 0xff;
    var b7 = data.charCodeAt (offset + 7) & 0xff;

    var sign = 1 - 2 * (b7 >> 7);
    var exp = (((b7 & 0x7f) << 4) + ((b6 & 0xf0) >> 4)) - 1023;
    //var frac = (b6 & 0x0f) * Math.pow (2, -4) + b5 * Math.pow (2, -12) + b4 * Math.pow (2, -20) + b3 * Math.pow (2, -28) + b2 * Math.pow (2, -36) + b1 * Math.pow (2, -44) + b0 * Math.pow (2, -52);

    //return sign * (1 + frac) * Math.pow (2, exp);
    var frac = (b6 & 0x0f) * Math.pow (2, 48) + b5 * Math.pow (2, 40) + b4 * Math.pow (2, 32) + b3 * Math.pow (2, 24) + b2 * Math.pow (2, 16) + b1 * Math.pow (2, 8) + b0;

    return sign * (1 + frac * Math.pow (2, -52)) * Math.pow (2, exp);
};

var lfloat32 = function (data, offset) {
    var b0 = data.charCodeAt (offset) & 0xff;
    var b1 = data.charCodeAt (offset + 1) & 0xff;
    var b2 = data.charCodeAt (offset + 2) & 0xff;
    var b3 = data.charCodeAt (offset + 3) & 0xff;

    var sign = 1 - 2 * (b3 >> 7);
    var exp = (((b3 & 0x7f) << 1) + ((b2 & 0xfe) >> 7)) - 127;

    var frac = (b2 & 0x7f) * Math.pow (2, 16) + b1 * Math.pow (2, 8) + b0;

    return sign * (1 + frac * Math.pow (2, -23)) * Math.pow (2, exp);
};

var str = function (data, offset, length) {
    var chars = [];
    var index = offset;
    /*while (true) {
        var c = data[index];
        if (c.charCodeAt (0) != 0)
            chars.push (c);
        else
            return chars.join ('');
        index ++;
    }*/
    while (index < offset + length) {
        var c = data[index];
        if (c.charCodeAt (0) !== 0)
            chars.push (c);
        else {
            break;
        }
        index ++;
    }
    return chars.join ('');
};

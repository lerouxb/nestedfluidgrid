(function () {
var fluidcss = {};

/*
Options:
numColumns
maxWidth
minWidth
maxHalfGap (margin to left and right of each column except for first and last)

We're not concerned with margins/gutters at the start or end and we're not
concerned with font sizes or vertical gaps/gutters/paddings/margins.
To make those fluid you'll have to use media queries or JavaScript.
*/

/* Return a settings object with all the required attributes filled in. */
fluidcss.makeSettings = function(options) {
    var settings = {
        numColumns: 12,
        maxWidth: 940,
        minWidth: 470,
        maxHalfGap: 10
    };
    _.extend(settings, options);
    return settings;
};

/* Precompute the minWidth and maxWidth for the gaps and spans. */
fluidcss.getMinMaxMap = function(settings) {
    var map = {}, i, colNum, minWidth, maxWidth, minGap;

    // this is just for display/debug purposes
    // (it doesn't get added to the css)
    minHalfGap = settings.minWidth/settings.maxWidth*settings.maxHalfGap;
    map['gaps'] = {
        minWidth: minHalfGap*2,
        maxWidth: settings.maxHalfGap*2
    };

    minGapsTotal = minHalfGap*2*(settings.numColumns-1);
    minColumnWidth = (settings.minWidth-minGapsTotal)/settings.numColumns;

    maxGapsTotal = settings.maxHalfGap*2*(settings.numColumns-1);
    maxColumnWidth = (settings.maxWidth-maxGapsTotal)/settings.numColumns;

    for (i=0; i<settings.numColumns; i++) {
        colNum = i+1;

        minWidth = minColumnWidth*colNum + minHalfGap*i*2;
        maxWidth = maxColumnWidth*colNum + settings.maxHalfGap*i*2;

        map['span-'+colNum] = {
            // this becomes the min-width and max-width values in css
            minWidth: minWidth,
            maxWidth: maxWidth
        };
    }

    return map;
};

/*
Precompute the half-gap and percentage widths for each possible
parent/direct descendant combination.

In other words:
The half-gap width for columns directly inside a span-3 column as a percentage
of the width of the span-3 column
and then the column width for span-1 and span-2 both as percentages of the
width of the span-3 column.

(This might be easier to understand by looking at the css that gets generated.)
*/
fluidcss.getPercentageMap = function(settings, minMaxMap) {
    var map = {}, p, c, parentNum, childNum,
        maxWidth, halfGapPercent, oneColumnPercent, widthPercent;

    for (p=0; p<settings.numColumns; p++) {
        parentNum = p+1;
        map['span-'+parentNum] = {};

        maxWidth = minMaxMap['span-'+parentNum].maxWidth;
        halfGapPercent = settings.maxHalfGap/maxWidth*100;
        map['span-'+parentNum].halfGapPercent = halfGapPercent;

        oneColumnPercent = (100-(p*halfGapPercent*2))/parentNum;

        for (c=0; c<p; c++) {
            childNum = c+1;
            widthPercent = childNum*oneColumnPercent + c*halfGapPercent*2;
            map['span-'+parentNum]['span-'+childNum] = widthPercent;
        }
    }
    return map;
};

/* Use the precomputed mappings to generate the lines of CSS. */
fluidcss.getGridCSS = function(settings, minMaxMap, percentageMap) {
    var lines = [], colNum, key, minWidth, maxWidth;

    for (colNum=settings.numColumns; colNum>0; colNum--) {
        key = 'span-'+colNum;
        minWidth = minMaxMap[key].minWidth;
        maxWidth = minMaxMap[key].maxWidth;
        lines.push(
            '.'+key+' {min-width: '+minWidth+'px; max-width: '+maxWidth+'px;}'
        );
        if (colNum==1) {
            continue;
        }

        var halfGapPercent = percentageMap[key].halfGapPercent;
        lines.push(
            '.'+key+' .cell {margin-left: '+halfGapPercent+'%; '+
            'margin-right: '+halfGapPercent+'%;}'
        );

        var subkeys = _.keys(percentageMap[key]);
        _.each(subkeys, function(subkey) {
            if (subkey.indexOf('span-') != 0) {
                return;
            }
            var width = percentageMap[key][subkey];
            lines.push('.'+key+' .'+subkey+' {width: '+width+'%;}');
        });
    }

    return lines.join('\n');
};

var root = this;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = fluidcss;
} else {
    root.fluidcss = fluidcss;
}

}());

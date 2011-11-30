(function () {

var fluidbuilder = {};

var paragraphs = [
'Apple pie cupcake powder. Icing icing chocolate cake bear claw dessert biscuit candy toffee. Caramels cupcake candy sweet roll. Oat cake soufflé dragée toffee. Croissant topping gingerbread tiramisu fruitcake caramels. Cake chocolate apple pie jelly-o topping pie. Wafer pudding tiramisu. Bonbon tootsie roll brownie tootsie roll applicake jujubes apple pie lollipop candy. Cupcake macaroon donut biscuit halvah.',
'Croissant chupa chups dragée. Sweet roll macaroon sesame snaps dessert wafer chocolate bar. Marshmallow gummi bears oat cake lollipop tootsie roll marshmallow. Tart caramels marshmallow chocolate cake pie. Pie sweet cake chocolate bar pudding chupa chups. Donut tart cake applicake marshmallow. Dessert bonbon cheesecake candy canes topping. Cheesecake oat cake cookie.',
'Macaroon halvah muffin chocolate cake. Tootsie roll oat cake croissant gummies. Sweet roll dragée jelly halvah sweet roll cookie tiramisu marzipan. Pie chocolate liquorice cookie donut. Dragée liquorice carrot cake lemon drops gingerbread soufflé oat cake. Jelly beans bear claw lemon drops. Chupa chups soufflé candy tootsie roll sesame snaps marshmallow dragée cheesecake cupcake.',
'Applicake cheesecake wafer gingerbread chupa chups carrot cake cotton candy. Fruitcake sweet roll chupa chups sesame snaps. Pastry soufflé fruitcake sweet pie sesame snaps. Gummies croissant ice cream gingerbread marzipan candy cookie gummies marzipan. Gummies marshmallow cake donut caramels toffee ice cream faworki apple pie. Cheesecake cotton candy powder faworki liquorice ice cream fruitcake. Cookie sesame snaps cotton candy sweet roll brownie apple pie pastry macaroon macaroon.',
'Toffee jelly beans bear claw tootsie roll carrot cake fruitcake gummi bears marshmallow. Cookie chocolate bar dessert brownie jujubes toffee. Chocolate apple pie gummi bears cheesecake. Caramels cheesecake fruitcake chupa chups caramels biscuit dragée. Jujubes marshmallow cheesecake tiramisu chupa chups muffin. Tootsie roll jujubes bonbon dragée pastry caramels lollipop. Macaroon fruitcake muffin gummies lemon drops applicake sugar plum sweet roll icing. Tootsie roll donut pudding. Tart brownie gummi bears cheesecake.'];

var getRandomParagraph = function() {
    return  '<p>'+
            paragraphs[Math.floor(Math.random()*paragraphs.length)]+
            '</p>';
};

var getImageForSpan = function(span, minMaxMap, heightRatio) {
    var w, h;
    w = Math.ceil(minMaxMap['span-'+span].maxWidth);
    h = w;
    if (heightRatio) {
        h = w*heightRatio;
    }
    h = Math.ceil(h);
    return '<img src="http://placehold.it/'+w+'x'+h+'">';
};

var getFactors = function(numColumns) {
    var factors = [];
    // yes, 1 deliberately and deliberately not including numColumns
    for (var i=1; i<numColumns; i++) {
        if (numColumns % i == 0) {
            factors.push(i);
        }
    }
    return factors;
};

// paragraph
// row split in two: first is #debug, second is paragraph, image, row, paragraph
// then rows for each "factor" (12 would mean 1, 2, 3, 4, 6) with one image each
// then another paragraph
/* Return a settings object with all the required attributes filled in. */

fluidbuilder.makeTestHTML = function(numColumns, minMaxMap) {
    var grid, half1, half2, row, cell, child;

    grid = $('<div class="cell span-'+numColumns+'" id="grid"></div>');


    // add a paragraph of text that will span the full width
    grid.append(getRandomParagraph());

    half1 = Math.floor(numColumns/2);

    // only proceed if we have more than 1 column
    if (half1) {
        half2 = numColumns-half1;

        // split everything in two
        row = $('<div class="row"></div>');
        grid.append(row);

        // add a column that will hold the debug output
        cell = $('<div class="cell span-'+half1+'"></div>');
        cell.append($('<div id="debug"></div>'));
        row.append(cell);

        // add a column with text and an image
        cell = $('<div class="cell span-'+half2+'"></div>');
        row.append(cell);
        cell.append(getRandomParagraph());
        cell.append(getImageForSpan(half2, minMaxMap, 0.5));

        half1 = Math.floor(half2/2);

        // only proceed if we have more than 2 columns
        if (half1) {
            // then split the right column further
            half2 = half2-half1;

            row = $('<div class="row"></div>');
            cell.append(row);

            child = $('<div class="cell span-'+half1+'"></div>');
            child.append(getRandomParagraph());
            row.append(child);

            child = $('<div class="cell span-'+half2+'"></div>');
            child.append(getRandomParagraph());
            row.append(child);
        }

        // then add a paragraph to sit below the second split
        cell.append(getRandomParagraph());

        grid.append('<textarea id="generatedcss"></textarea>');

        // add a bunch of image rows for all the possible equal splits
        var factors = getFactors(numColumns);
        _.each(factors, function(factor) {
            row = $('<div class="row"></div>');
            grid.append(row);

            var amount = numColumns/factor;
            for (var i=0; i<amount; i++) {
                child = $('<div class="cell span-'+factor+'"></div>');
                row.append(child);

                child.append(getImageForSpan(factor, minMaxMap));
            }
        });


        return grid;
    }
};

var root = this;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = fluidbuilder;
} else {
    root.fluidbuilder = fluidbuilder;
}

}());

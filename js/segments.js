
function sortArray(arrOfTuples) {
    return arrOfTuples.sort(function(tuple1, tuple2) {return tuple1[0] === tuple2[0] ? tuple1[1] > tuple2[1] : tuple1[0] > tuple2[0];})
}

function mergeArray(arrOfTuples) {
    var result = [];
    arrOfTuples.forEach(function(tuple, index, arr) {
        var addTuple = true;
        result = result.map(function(sofarTuple) {
            var sorted = sortArray([sofarTuple, tuple]);
            if (sorted[0][1] + 1 >= sorted[1][0]) {
                // overlap! merge the tuple - dont add it at the end
                addTuple = false;
                return [Math.min(sorted[0][0],sorted[1][0]),Math.max(sorted[0][1], sorted[1][1])];
            } else {
                return sofarTuple;
            }
        });
        if (addTuple) {
            result.push(tuple);
        }
    });
    return result;
}


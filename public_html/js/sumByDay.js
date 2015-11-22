
var byDay = d3.time.format("%Y-%m-%d");
var sum = d3.sum;

function aggregateData(data, aggragateFunc, byTime)
{
    var aggregated  = d3.nest()
            .key(function (d) {
                return byTime(d.date);
            })
            .rollup(function (d) {
                return aggragateFunc(d, function (g) {
                    return g.value;
                });
            })
            .entries(data);
    
    aggregated.forEach(function(d) {
        d.date = byTime.parse(d.key);
        d.value = d.values;
    });
    return aggregated ;
}
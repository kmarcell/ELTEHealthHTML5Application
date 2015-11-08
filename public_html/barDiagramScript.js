function presentBarDiagram(data, div_id, y_title)
{
    var margin = {top: 20, right: 20, bottom: 120, left: 40};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
            .range([height, 0]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format("%Y-%m-%d"));

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")

    var svg = d3.select(div_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    x.domain(data.map(function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.value;
    })]);

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("x", -10)
                .attr("dy", ".15em")
                .attr("transform", "rotate(-75)")
                .attr("font-size", "9px");

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(y_title);

    svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.date);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            });
};
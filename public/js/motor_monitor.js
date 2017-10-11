var bar, g, x, y, height, width, margin, svg;
var data = [{
        x0: 0.15,
        x1: 0.35,
        y: 0
    }, {
        x0: 0.65,
        x1: 0.85,
        y: 0
    }
];

function updateBars(m1, m2) {
    if (bar !== undefined) {
        bar.remove();
    } else {
        svg = d3.select("svg");
        margin = {top: 10, right: 30, bottom: 30, left: 30};
        width = +svg.attr("width") - margin.left - margin.right;
        height = +svg.attr("height") - margin.top - margin.bottom;
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x = d3.scaleLinear()
            .rangeRound([0, width]);

        y = d3.scaleLinear()
            .domain([-100, 100])
            .range([height, 0]);

        svg.append("rect")
            .attr("x", margin.left + x(data[0].x0))
            .attr("y", margin.top)
            .attr("width", x(data[0].x1) - x(data[0].x0) + 1)
            .attr("height", y(-100) - y(100) - 1);

        svg.append("rect")
            .attr("x", margin.left + x(data[1].x0))
            .attr("y", margin.top)
            .attr("width", x(data[0].x1) - x(data[0].x0) + 1)
            .attr("height", y(-100) - y(100) - 1);

        svg.append("line")
            .attr("x1", margin.left + x(0.05))
            .attr("y1", height/2 + margin.top)
            .attr("x2", width + margin.left - x(0.05))
            .attr("y2", height/2 + margin.top)
            .attr("stroke", "#566566")
            .attr("stroke-width", 1);

        svg.selectAll("rect").attr("fill", "none");
        svg.selectAll("rect").attr("stroke", "#566566");
    }

    data[0].y += m1;
    data[1].y += m2;

    bar = g.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].x1) - x(data[0].x0) - 1)
        .attr("height", function(d) {
            return d.y > 0 ? (height/2) - y(d.y) : y(d.y) - (height/2);
        })
        .attr("transform", function(d) {
            var dh = d.y < 0 ? ((height/2) - y(d.y)) : 0;
            return "translate(0, " + dh + ")";
        });
}

$(document).ready(function() {
    updateBars(-20.5, 34.8);
});


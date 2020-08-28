const margin = { top: 40, right: 20, bottom: 50, left: 100 }
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 300 - margin.top - margin.bottom

let color = d3.scaleOrdinal(d3.schemeCategory10);


const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom)

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.right}, ${margin.top})`);

// scales
const x = d3.scaleTime().range([0, graphWidth])
const y = d3.scaleLinear().range([graphHeight, 0])

// axes group
const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${graphWidth}, 0)`)

const lines = graph.append('g')
    .attr('class', 'lines');

// Creating Tooltip
const tip = d3.tip()
    .attr('class', 'tip card')
    .html(d => {
        let content = `<div class="date">${d.date}</div>`;
        content += `<div class="distance">${d.price} USD</div>`;
        return content
    })

graph.call(tip)


// create dotted line group and append to graph
const dottedLines = graph.append('g')
    .attr('class', 'lines')
    .style('opacity', 0);

// create x dotted line and append to dotted line group
const xDottedLine = dottedLines.append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 4)

// // create y dotted line and append to dotted line group
const yDottedLine = dottedLines.append('line')
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 4)


const update = (data) => {
    var parseDate = d3.timeParse("%Y");
    data.forEach(function (d) {
        d.values.forEach(function (d) {
            d.date = parseDate(d.date);
            d.price = +d.price;
        });
    });
    //set scale domains
    x.domain(d3.extent(data[2].values, d => d.date))
    y.domain([0, d3.max(data[2].values, d => d.price)])

    const line = d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.price) })


    // d3 line path generator
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')
        .on("mouseover", showName)
        .on("mouseout", hideName)
        .append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => color(i))

    /* Add circles in the line */
    lines.selectAll("circle-group")
        .data(data).enter()
        .append("g")
        .style("fill", (d, i) => color(i))
        .selectAll("circle")
        .data(d => d.values).enter()
        .append("g")
        .attr("class", "circle")
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.price))
        .attr("r", 6)


    graph.selectAll('circle')
        .on('mouseover', (d, i, n) => {
            tip.show(d, n[i])
            handleMouseOver(d, i, n)
        })
        .on('mouseleave', (d, i, n) => {
            tip.hide(d, n[i])
            handleMouseOut(d, i, n)
        })

    // create axes
    const xAxis = d3.axisBottom(x)
        .ticks(6)

    const yAxis = d3.axisRight(y)
        .ticks(6)
        .tickFormat(d => d + ' USD')

    // call axes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    // rotate axis text
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')


    graph.selectAll('.line')
        .each(teste)


    function teste(d, i, n) {
        let totalLength = n[i].getTotalLength();
        d3.select(n[i])
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }

}

// data adn firestore
let data = []
d3.json('data.json').then(data => {
    update(data)
})

// event handlers
const handleMouseOver = (d, i, n) => {
    d3.select(n[i])
        .transition().duration(100)
        .attr('r', 8)

    // set x dotted line coords(x1, x2, y1,y2)
    xDottedLine
        .attr('x1', x(d.date))
        .attr('x2', x(d.date))
        .attr('y1', graphHeight)
        .attr('y2', y(d.price));

    // set y dotted line coords(x1, x2, y1,y2)
    yDottedLine
        .attr('x1', x(d.date))
        .attr('x2', graphWidth)
        .attr('y1', y(d.price))
        .attr('y2', y(d.price));

    // show the dotted line group(.style, opacity)
    dottedLines.style('opacity', 1)
}

const handleMouseOut = (d, i, n) => {

    d3.select(n[i])
        .transition().duration(100)
        .attr('r', 6)

    // hide the dotted line group(.style, opacity)
    dottedLines.style('opacity', 0)
}

const showName = (d, i, n) => {
    graph.append("text")
        .attr("class", "title-text")
        .style("fill", color(i))
        .text(d.name)
        .attr("text-anchor", "middle")
        .attr("x", (width - margin) / 2)
        .attr("y", 5);
}

const hideName = (d, i, n) => {
    graph.select(".title-text").remove();
}

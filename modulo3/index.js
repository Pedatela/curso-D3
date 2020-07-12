const data = [
    { width: 200, height: 100, fill: 'green' }
]
const svg = d3.select('svg')

const rect = svg.select('rect')
    .data(data)
    .attr('width', function (d) {
        return d.width
    })
    .attr('height', function (d) {
        return d.height
    })
    .attr('fill', function (d) {
        return d.fill
    });
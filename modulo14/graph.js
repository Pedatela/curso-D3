//SVG CONTENT
//--------------
let totalRefLines = 10
let w = 780
let radius = w / 2 - 20
let total = { totalInMeta: 7, totalOutMeta: 8, totalNoValue: 4 }
let radiusInner = radius * 0.25
let metaRadiusStart = radius * 0.65
let metaRadiusEnd = radius * 0.95
let selectIndicador = false
let metaScale = d3.scaleLinear()
    .domain([0, 100, 200])
    .range([radiusInner + 20, metaRadiusStart, radius]);

let svg =

    d3.select('.canvas')
        .html('')
        .append('svg')
        .attr('viewBox', `0 0 ${w} ${w}`)
        .attr("height", 710)
        .attr("width", 710)
        .attr('preserveAspectRatio', `xMidYMid meet`).html(`
                          <defs> 
                                  <pattern id="diagonal-stripe-4" patternUnits="userSpaceOnUse" width="10" height="10"> <image xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSdibGFjaycvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzMnLz4KPC9zdmc+" x="0" y="0" width="10" height="10"> </image> </pattern> 
                                  <filter id="shadow" x="0" y="0" width="200%" height="200%">
                                    <feOffset result="offOut" in="SourceAlpha" dx="10" dy="10" />
                                    <feGaussianBlur result="blurOut" in="SourceGraphic" stdDeviation="2" />
                                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                                    </filter>
                         </defs>`)

//META AREA
//----------------------
let arc = d3
    .arc()
    .innerRadius(metaRadiusStart - 5)
    .outerRadius(metaRadiusEnd + 5)
    .startAngle(0) //converting from degs to radians
    .endAngle(360) //just radians
svg.append('path')
    .attr('d', arc)
    .attr('transform', `translate(${w / 2},${w / 2})`)
    .style('fill', 'url(#diagonal-stripe-4)')
    .style('opacity', 0.04)
svg.append('path')
    .classed('metaarea', true)
    .attr('d', arc)
    .attr('transform', `translate(${w / 2},${w / 2})`)

//THE INDICATORS BAR GROUP // willl populate as content arraives
//----------------------
let barsGroup = svg.append('g').attr('id', 'barsgroup')

//LINHAS DE REFERENCIA
//----------------------
let lineRefScale = d3
    .scaleLinear()
    .domain([0, totalRefLines])
    .range([radius, radiusInner])

let linesGroup = svg.append('g').attr('id', 'linegroup')

for (let i = 0; i < totalRefLines; i++) {
    linesGroup
        .append('circle')
        .attr('class', 'refline')
        .attr('cx', `${w / 2}`)
        .attr('cy', `${w / 2}`)
        .style('opacity', 0)
        .attr('r', radiusInner)
        .transition()
        .duration(1250)
        .attr('r', lineRefScale(i))
        .style('opacity', 0.2)
}


//META LINHAS
//----------------------
let metaGroup = svg.append('g').attr('id', 'metagroup')
metaGroup
    .append('circle')
    .attr('class', 'metaline')
    .attr('cx', `${w / 2}`)
    .attr('cy', `${w / 2}`)
    .style('opacity', 0)
    .transition()
    .delay(300)
    .duration(1250)
    .attr('r', metaRadiusStart)
    .style('opacity', 1)
metaGroup
    .append('circle')
    .attr('class', 'metalineEnd')
    .attr('cx', `${w / 2}`)
    .attr('cy', `${w / 2}`)
    .style('opacity', 0)
    .transition()
    .delay(400)
    .duration(1250)
    .attr('r', metaRadiusStart + 5)
    .style('opacity', 0)
//CENTER INFO AREA
//----------------------
let centerg = svg.append('g').attr('class', 'info-center')

//In Meta Numbers
centerg
    .append('g')
    .attr(
        'transform',
        (d) =>
            `rotate(0) translate(${w / 2},${w / 2 - 40})`
    )
    .append('text')
    .attr('id', 'totalinmeta')
    .attr('x', '0')
    .attr('y', '0')
    .attr('font-size', '40')
    .attr('fill', '#63b3b5')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text(total.totalInMeta)

centerg
    .append('g')
    .attr(
        'transform',
        (d) =>
            `rotate(0) translate(${w / 2},${w / 2 - 20})`
    )
    .append('text')
    .attr('x', '0')
    .attr('y', '0')
    .attr('font-size', '10')
    .attr('fill', '#63b3b5')
    .attr('font-weight', 'light')
    .attr('text-anchor', 'middle')
    .text('NA META')

//Line Metas
centerg
    .append('g')
    .attr(
        'transform',
        (d) =>
            `rotate(0) translate(${w / 2},${w / 2 - 4})`
    )
    .append('line')
    .attr('x1', (d) => -radiusInner * 0.3)
    .attr('x2', (d) => radiusInner * 0.3)
    .attr('y1', 0)
    .attr('y', 0)
    .attr('class', 'metaline')

//Out Meta Numbers
centerg
    .append('g')
    .append('text')
    .attr('id', 'totaloutmeta')
    .attr(
        'transform',
        (d) =>
            `rotate(0) translate(${w / 2},${w / 2 + 40})`
    )
    .attr('x', '0')
    .attr('y', '0')
    .attr('font-size', '40')
    .attr('fill', '#bc548d')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text(total.totalOutMeta)

centerg
    .append('g')
    .attr(
        'transform',
        (d) =>
            `rotate(0) translate(${w / 2},${w / 2 + 60})`
    )
    .append('text')
    .attr('x', '0')
    .attr('y', '0')
    .attr('font-size', '10')
    .attr('fill', '#bc548d')
    .attr('font-weight', 'light')
    .attr('text-anchor', 'middle')
    .text('FORA DA META')

d3.json('data.json').then(dataBars => {
    let barsGroup = d3.select('.canvas').select('#barsgroup')

    let arcPath = d3.arc()
        .outerRadius(function (d, i, n) {
            d.outerRadius = metaScale(d.metaPercentBars)
            d.angle = (360 / 20) * 1.2 * i
            return metaScale(d.metaPercentBars)
        })
        .innerRadius(radiusInner)
        .startAngle((-20 / 2) * Math.PI / 180)
        .endAngle((20 / 2) * Math.PI / 180);


    //get all bars
    let bars = barsGroup.selectAll('g.bar').data(dataBars)

    //create new bars content
    let newBars = bars
        .enter()
        .append('g')
        .attr('class', 'bar')
        .style('opacity', 0)

    bars.exit().remove()

    //CONTRUCT NEW BARS
    //----------------

    //new bar arcs
    newBars
        .attr('transform', `translate(${w / 2},${w / 2})`)
        .append('g')
        .attr('class', 'bar-rotation')
        .attr('transform', `rotate(0)`)
        .append('path')
        .classed('mandala-bar', true)
        .attr('d', d => arcPath(d))
        .style('filter', 'url(#shadow)')
        .style('fill', (d) => {
            if (d.value === false) {
                return '#888'
            } else {
                return d.meta < 100
                    ? '#b04c7e'
                    : '#6db6b8'
            }
        })


    //new bar setas
    newBars
        .selectAll('g.bar-rotation')
        .append('g')
        .attr('class', 'seta-wrap')
        .append('g')
        .attr('transform', (d) => {
            return `rotate(${(d.direction == 'up' && 180) || 0})`
        })
        .append('g')
        .attr('transform', (d) => {
            return `translate(-7,0)`
        })
        .attr('class', 'seta')
        .append('path')
        .attr('d', 'M0,0 L 10,15 L0,30 L 3,15')
        .style('opacity', (d) => {
            if (d.value === false) {
                return 0.1
            } else {
                return 0.4
            }
        })

    //create the bar index circle
    newBars
        .selectAll('g.bar-rotation')
        .append('g')
        .attr('class', 'text-label')
        .attr(
            'transform',
            (d) => `rotate(0) translate(0,-${d.outerRadius + 15})`
        )
        .append('circle')
        .style('fill', '#666666')
        .attr('cx', '0')
        .attr('cy', '0')
        .attr('r', '10')
        .style('opacity', (d) => {
            if (d.value === false) {
                return 0.4
            } else {
                return 1
            }
        })

    //create the bar index numbers
    newBars
        .selectAll('g.text-label')
        .append('text')
        .attr('x', '0')
        .attr('y', '0')
        .attr('font-size', '9')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((d) => d.indice)
        .style('opacity', 0)
        .transition()
        .duration(2000)
        .delay(500)
        .style('opacity', 1)

    //UPDATE BARS ELEMENTS POSITIONS
    //------------------

    //update bar path
    newBars
        .select('path.mandala-bar')
        .attr('d', arcPath)
        .style('fill', (d) => {
            if (d.value === false) {
                return '#888'
            } else {
                return d.meta < 100
                    ? '#b04c7e'
                    : '#6db6b8'
            }
        })

    // update bar seta position
    newBars.select('g.seta-wrap').attr('transform', function (d) {
        return `rotate(-90) translate(${
            d.outerRadius - 10
            },${((d.direction == 'up' && 1) || -1) * 15 * 0.6}) scale(0.6)`
    })

    // update bar number index position
    newBars
        .select('g.text-label')
        .attr(
            'transform',
            (d) => `rotate(0) translate(0,-${d.outerRadius + 15})`
        )

    //show bars loaded
    newBars.transition().duration(2000).style('opacity', 1)

    // rotate the bars loaded
    newBars
        .select('.bar-rotation')
        .transition()
        .duration(2000)
        .attr('transform', (d) => {
            return `rotate(${d.angle})`
        })
})

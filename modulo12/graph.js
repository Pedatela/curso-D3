const colors = ["red", "yellow", "green", "blue"];
const twoPi = 2 * Math.PI;
const radius = 120;
const border = 14;
const padding = 50;
const boxSize = (radius + padding) * 2;
const currentSegment = d3.local();
const segmentRadius = d3.local();


d3.json('data.json').then(data => {

    let formatPercent = d3.format('.0%');


    let svg = d3.select('svg')
        .attr('width', boxSize)
        .attr('height', boxSize);

    const tip = d3.tip()
        .attr('class', 'tip')
        .html(d => {
            let content = `<div class="tip-name">Ativo: ${d.nome}</div>`
            content += `<div class="tip-cost">Porcentagem: ${formatPercent(d.porcentagem)}</div>`;;
            return content
        })

    svg.call(tip)


    let arc = d3.arc()
        .innerRadius(function () { return segmentRadius.get(this).innerRadius })
        .outerRadius(function () { return segmentRadius.get(this).outerRadius })
        .cornerRadius(50);

    let backGroudArc = d3.arc()
        .innerRadius(function () { return segmentRadius.get(this).innerRadius })
        .outerRadius(function () { return segmentRadius.get(this).outerRadius })
        .cornerRadius(50);

    const graph = svg.append("g").attr("transform", "translate(" + boxSize / 2 + "," + boxSize / 2 + ")");

    const paths = graph.selectAll("path")
    paths.exit().remove();

    paths.data(data)
        .enter().append("path")
        .attr("fill", "#2D2E2F")
        .each(background)
        .attr('d', backGroudArc.endAngle(twoPi))


    paths.data(data)
        .enter().append("path")
        .attr("fill", function (d, i) { return colors[i]; })
        .attr('class', 'foreground')
        .each(arcFunction)
        .transition().duration(2500)
        .attrTween('d', arcTween)
        .each(function (d) { currentSegment.set(this, d) });


    function arcFunction(d, i, n) {
        d.startAngle = 0;
        d.endAngle = twoPi * d.porcentagem;
        segmentRadius.set(this, {
            innerRadius: radius - (border * (i * 2)),
            outerRadius: radius - (border * (i + i + 1))
        });
    }


    function background(d, i, n) {
        d.startAngle = 0;
        d.endAngle = twoPi;
        segmentRadius.set(this, {
            innerRadius: radius - (border * (i * 2)),
            outerRadius: radius - (border * (i + i + 1))
        });
    }

    function arcTween(d) {
        let thisPath = this;
        let interpolate = d3.interpolate({ startAngle: 0, endAngle: d.porcentagem }, currentSegment.get(this));
        currentSegment.set(this, interpolate(0));


        return function (t) {
            return arc.call(thisPath, interpolate(t));
        };
    }

    d3.selectAll('path.foreground')
        .on('mouseover', (d, i, n) => {
            tip.show(d, n[i])
            handleMouseOver(d, i, n)
        })
        .on('mouseout', (d, i, n) => {
            tip.hide(d, n[i])
            handleMouseOut(d, i, n)
        })


    // event handlers
    const handleMouseOver = (d, i, n) => {
        d3.select(n[i])
            .transition('changeSliceFill').duration(300)
            .attr('fill', '#FFF')
    }

    const handleMouseOut = (d, i, n) => {
        d3.select(n[i])
            .transition('changeSliceFill').duration(300)
            .attr('fill', d.cor)
    }

})



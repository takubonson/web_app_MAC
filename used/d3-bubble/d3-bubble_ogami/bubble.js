const file = 'data.json';
const offset = 60;
const blank_size = 30;
const min_year = 1950;
const max_year = 2020;
const width = window.innerWidth;
const height = window.innerHeight;
const colors = {
    html: '#F16529',
    css: '#1C88C7',
    js: '#FCC700'
};

const generateChart = data => {
    var drag_delta;
    var drag_threshold = (width-2*blank_size)/(max_year - min_year);
    var currentYear = min_year;


    const bubble = data => d3.pack()
        .size([width, height - offset])
        .padding(2)(d3.hierarchy({ children: data }).sum(d => d.score));
        //padding は円どうしの間隔

    const svg = d3.select('#bubble-chart')
        .style('width', width)
        .style('height', height);

    svg.call(
        d3.drag()
            .on("start",dragstarted)
            .on("drag",dragged)
            .on("end",dragended));
    const root = bubble(data);
    const tooltip = d3.select('.tooltip');

    const node = svg.selectAll()
        .data(root.children)
        .enter().append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const circle = node.append('circle')
        .style('fill', d => colors[d.data.category])
        .on('mouseover', function (e, d) {
            tooltip.select('img').attr('src', d.data.img);
            tooltip.select('a').attr('href', d.data.link).text(d.data.name);
            tooltip.select('span').attr('class', d.data.category).text(d.data.category);
            tooltip.style('visibility', 'visible');

            d3.select(this).style('stroke', '#222');
        })
        .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
                                     .style('left', `${e.pageX + 10}px`))
        .on('mouseout', function () {
            d3.select(this).style('stroke', 'none');
            return tooltip.style('visibility', 'hidden');
        })
        .on('click', (e, d) => window.open(d.data.link));
    
    const label = node.append('text')
        .attr('dy', 2)
        .text(d => d.data.name.substring(0, d.r / 3));

    var yearLabel = svg.append("text")
    .attr("class", "yearLabel")
    .attr("text-anchor", "end")
    .attr("font-size", 100)
    .attr("x", width - 80)
    .attr("y", height - 50)
    .attr("height",20)
    .attr("width",20)
    .attr("fill","black")
    .text(currentYear);
    
    var YearScale = d3.scaleLinear().domain([min_year,max_year]).range([0,width-2*blank_size]);
    var YearAxis = d3.axisBottom(YearScale).ticks(5, d3.format(",d"));

    svg.append("g")
        .attr("class","incomeAxis")
        .attr("fill", "none")
        .attr("stroke","black")
        .attr("transform",`translate(${blank_size},${height - blank_size})`)
        .call(YearAxis);

    var scroller = svg.append("g")
        .append("circle")
        .attr("class","scroller")
        .attr("cx", blank_size + (width-2*blank_size)*(currentYear - min_year)/(max_year - min_year))
        .attr("cy", height - blank_size)
        .attr("r",5)
        .attr("fill","red")
    
    svg.append("g")
        .append("circle")
        .attr("r",5)
        .attr("cx",blank_size +(width-2*blank_size)*(2011 - min_year)/(max_year - min_year) )
        .attr("cy",height - blank_size)
        .attr("fill", "blue")
        .on('mouseover', function (e, d) {
            d3.selectAll(".tooltip_event")
                .style('visibility', 'visible');
            d3.select(this).style('stroke', '#222');
        })
        .on ('mouseout', function(e,d) {
            d3.selectAll(".tooltip_event")
                .style('visibility', 'hidden')
        })

/*         .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
                                     .style('left', `${e.pageX + 10}px`))
        .on('mouseout', function () {
            d3.select(this).style('stroke', 'none');
            return tooltip.style('visibility', 'hidden');
        })
        .on('click', (e, d) => window.open(d.data.link)); */
    
    node.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    circle.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('r', d => d.r);
        

    label.transition()
        .delay(700)
        .ease(d3.easeExpInOut)
        .duration(1000)
        .style('opacity', 1)

    function dragstarted() {
        drag_delta = 0;
    }
    
    function dragged(event) {
        drag_delta += event.dx;
        year_delta = drag_delta / drag_threshold;
    
        if (year_delta !=0) {
            nextYear = currentYear + year_delta;
            if (nextYear < min_year ) nextYear = min_year;
            else if (nextYear > max_year) nextYear = max_year;
        
        currentYear = nextYear;
        yearLabel.text(Math.floor(currentYear));
        scroller
            .attr("cx",blank_size + (width-2*blank_size)*(currentYear - min_year)/(max_year - min_year))
        drag_delta = 0;
    
        }
    }
    
    function dragended() {
    }        
};


(async () => {
    data = await d3.json(file).then(data => data);
    generateChart(data);
})();

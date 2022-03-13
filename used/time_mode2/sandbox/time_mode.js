var selected_list = ["html", "css", "js"]
d3.selectAll(".checkbox").on("change", update);

const file = 'finished.json';
const offset = 60;
const blank_size = 30;
const min_year = 2001;
const max_year = 2003;
const width = window.innerWidth;
const height = window.innerHeight;
const colors = {
    html: '#F16529',
    css: '#1C88C7',
    js: '#FCC700'
};

var selected_data = []

var bubble
var root 
var node
var circle

var current_index = 0
const total_sample_num = 300
const max_index = total_sample_num-1
const min_index = 0

const generateChart = data => {
    var drag_delta;
    var drag_threshold = 0.5 * (width-2*blank_size)/(max_index - min_index);
    var currentYear = min_year;

    d3.selectAll("svg > *").remove();

    data.forEach(function(d){
        // if (selected_list.includes(d.category)){
        //     selected_data.push(d)
        // }
        selected_data.push(d)
    })
    var bubble = data => d3.pack()
        .size([width, height - offset])
        .padding(30)(d3.hierarchy({ children: selected_data }).sum(function(d){
            console.log(d)
            if (!d.children){
                return d.value[0][1]
                // ここを調節する
            }else{
                return d.value
            }
        }));
        //padding は円どうしの間隔
    const svg = d3.select('#bubble-chart')
        .style('width', width)
        .style('height', height);

    var root = bubble(data);
    const tooltip = d3.select('.tooltip');

    node = svg.selectAll()
        .data(root.children)
        .enter().append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .call(d3.drag()
				.on('start', (d) => {
					if (!d3.event.active) simulation.alphaTarget(0.03).restart();
					d.fx = d.x;
					d.fy = d.y;
				})
				.on('drag', (d) => {
					d.fx = d3.event.x;
					d.fy = d3.event.y;
				})
				.on('end', (d) => {
					if (!d3.event.active) simulation.alphaTarget(0.03);
					d.fx = null;
					d.fy = null;
				}));

    circle = node.append('circle')
        .style('fill', d => colors[d.data.category])
        .attr("opacity", 0.3)
        .attr("stroke", "black")
        // .on('mouseover', function (e, d) {
        //     tooltip.select('img').attr('src', d.data.img);
        //     tooltip.select('a').attr('href', d.data.link).text(d.data.name);
        //     tooltip.select('span').attr('class', d.data.category).text(d.data.category);
        //     tooltip.style('visibility', 'visible');

        //     d3.select(this).style('stroke', '#222');
        // })
        .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
                                     .style('left', `${e.pageX + 10}px`))
        .on('mouseout', function () {
            d3.select(this).style('stroke', 'none');
            return tooltip.style('visibility', 'hidden');
        })
        .on('click', (e, d) => window.open(d.data.link));

    // const simulation = d3
    //     .forceSimulation()
    //     .force(
    //       "center",
    //       d3
    //         .forceCenter()
    //         .x(width / 2)
    //         .y(height / 2)
    //     ) // Attraction to the center of the svg area
    //     .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    //     .force(
    //       "collide",
    //       d3.forceCollide().strength(1).radius(90).iterations(1)
    //     );

    // simulation.nodes(selected_data).on("tick", function (d) {
    //         circle.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    //       });
    const label = node.append('text')
        .attr('dy', 2)
        .text(d => d.data.company_name.substring(0, d.r / 3));
    

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
        .attr("r",10)
        .attr("fill","red")
        .call(
            d3.drag()
                .on("start",dragstarted)
                .on("drag",dragged)
                .on("end",dragended));
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
        index_delta = drag_delta / drag_threshold;
    
        if (index_delta !=0) {
            next_index = current_index + index_delta;
            if (next_index < min_index ) next_index = min_index;
            else if (next_index > max_index) next_index = max_index;
        
        current_index = next_index;
        // yearLabel.text(Math.floor(currentYear));
        // scroller
        //     .attr("cx",blank_size + (width-2*blank_size)*(currentYear - min_year)/(max_year - min_year))
        drag_delta = 0;
        refresh_chart_dragging(Math.floor(current_index))
        }
    }
    
    function dragended() {
        refresh_chart_drag_end(Math.floor(current_index))
    }
};

function refresh_chart_dragging(current_index){
    // var bubble = data => d3.pack()
    // .size([width, height - offset])
    // .padding(30)(d3.hierarchy({ children: selected_data }).sum(function(d){
    //     if (!d.children){
    //         console.log(d.value)
    //         return d.value[current_index][1]
    //         // ここを調節する
    //     }else{
    //         return d.value
    //     }
    // }));
    //padding は円どうしの間隔
    // root = bubble(selected_data);
    // d3.selectAll("node > *").remove();
    // node.data(root.children)
        // .enter().append('g')
        // .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    circle = node.select('circle')
                .transition()
                .ease(d3.easeLinear)
                .duration(200)
                .attr('r', function(d){
                    current_v = +d.data.value[current_index][1]
                    next_v = +d.data.value[current_index+1][1]
                    if (current_v == 0){
                        return 0
                    }
                    else{
                        ratio = next_v/current_v
                        return (d.r * ratio)
                    }
                });
                
}

function refresh_chart_drag_end(current_index){
    var bubble = data => d3.pack()
    .size([width, height - offset])
    .padding(30)
    (d3.hierarchy({ children: selected_data }).sum(function(d){
        if (!d.children){
            return d.value[current_index][1]
            // ここを調節する
        }else{
            return d.value
        }
    }));
    //padding は円どうしの間隔
    root = bubble(selected_data);
    // d3.selectAll("node > *").remove();
    node.data(root.children)
        // .enter().append('g')
        // .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    circle = node.select('circle')
                .transition()
                .ease(d3.easeLinear)
                .duration(200)
                .attr('r', d => d.r);
                
}

function update(){
    if (this.checked){
        selected_list.push(this.id)
    }else{
        let s = this.id
        selected_list = selected_list.filter(function(e){return (e !== s)})
    }
    selected_data = []
    generateChart(data)
}

(async () => {
    data = await d3.json(file).then(data => data);
    generateChart(data);
})();

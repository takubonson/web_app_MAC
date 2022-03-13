var selected_list = ["html", "css", "js"]
d3.selectAll(".checkbox").on("change", update);

const file = 'data.json';
const width = window.innerWidth;
const height = window.innerHeight;
const colors = {
    html: '#F16529',
    css: '#1C88C7',
    js: '#FCC700'
};

var selected_data = []
const generateChart = data => {
    d3.selectAll("svg > *").remove();

    data.forEach(function(d){
        if (selected_list.includes(d.category)){
            selected_data.push(d)
        }
        // selected_data.push(d)
    })
    const bubble = selected_data => d3.pack()
        .size([width, height])
        .padding(2)(d3.hierarchy({ children: selected_data }).sum(d => d.score));
    
    const svg = d3.select('#bubble-chart')
        .style('width', width)
        .style('height', height);
    // svg.selectAll("*").remove();
    
    const root = bubble(selected_data);
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

    node.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('transform', function(d) {
            return `translate(${d.x}, ${d.y})`;
        });
    
    circle.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr("r", d => d.r)
    
    label.transition()
        .delay(700)
        .ease(d3.easeExpInOut)
        .duration(1000)
        .style('opacity', 1)

};

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

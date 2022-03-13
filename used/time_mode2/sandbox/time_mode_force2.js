var selected_list = ["html","css","js"]
d3.selectAll(".checkbox").on("change",update)

const file = 'finished.json';
const offset = 60;
const blank_size = 30;
const min_year = 2001;
const max_year = 2021;
const width = window.innerWidth;
const height = window.innerHeight;
const padding = 2;
const radius_min = 15;
const radius_max = 100;
var color = d3.scaleOrdinal(d3.schemeCategory10);
var simulation = d3.forceSimulation()
var selected_data = []
var bubble
var root
var node
var circle


var current_index = 0;
const total_sample_num = 252;
const max_index = total_sample_num -1;
const min_index = 0;
var drag_delta;
var drag_threshold = (width-2*blank_size)/(max_index - min_index);
var max_data = Array(total_sample_num).fill(0.01);
var min_data = Array(total_sample_num).fill(1000);

function index_to_str(index) {
    month = index % 12 + 1;
    year = 2001 + Math.floor(index /12);
    return year + "-" + month;
}


const generateChart = data => {
    //固定スケールにするならここも消してok
    data.forEach(function(d) {
        for (i=0;i<=max_index;i++) {
            var tmp = d.value[i][1];
            if (tmp>0) {
                max_data[i] = Math.max(max_data[i],tmp);
                min_data[i] = Math.min(min_data[i],tmp);
        
            }
        }
    })
    //console.log(max_data);
    //console.log(min_data);
    var maxmax = max_data.reduce(function(a, b) {
        return Math.max(a, b);
    });
    var minmin = min_data.reduce(function(a, b) {
        return Math.min(a, b);
    });
    //scaleの元になるデータの取得 削除してok
    //console.log(maxmax);
    //console.log(minmin);

    var svg = d3.select('#bubble-chart')
    .style('width', width)
    .style('height', height)

    var yearLabel = svg.append("text")
/*     yearLabel.call(d3.drag()
    .on("start",dragstarted_axis))
    .on("drag",dragged_axis)
    .on("end",dragended_axis); */

    var scroller = svg.append("g")
    .append("circle")
    .attr("class","scroller")
    .attr("cx", blank_size + (width-2*blank_size)*(current_index - min_index)/(max_index - min_index))
    .attr("cy", height - blank_size)
    .attr("r",10)
    .attr("fill","red")
    .call(
        d3.drag()
            .on("start",dragstarted_axis)
            .on("drag",dragged_axis)
            .on("end",dragended_axis));


            
/*     function get_data(index) {
        return data.map(
            function(d) {
                return {
                    name: d.company_name,
                    code: d.company_code,
                    value: d.value[index],
                    category_new: d.category_new,
                    category_orig: d.category_orig
                };
            }
        )
    } */

    //var nodesData = get_data(current_index);
    nodesData = data.map(
        function(d) {
            return {
                name: d.company_name,
                code: d.company_code,
                value: d.value,
                category_new: d.category_new,
                category_orig: d.category_orig
            }
        }
    )

    node = svg.selectAll()
        .data(nodesData)
        .enter()

    circles = node.append("circle")
        .attr("class","node_circle")
        .attr("id",d => d.code)
        .call(set_radius,Math.floor(current_index))
        .sort(order)
        .attr("fill", function(d) {return color(d.category_new);})
        .call(d3.drag()
        .on("start", dragstarted_node)
        .on("drag", dragged_node)
        .on("end", dragended_node));
    
    node.append('clipPath')
        .attr('id',function(d) {
            return `clip-${d.code}`;
        })
        .append("circle")
        // .attr("cx",5)
        // .attr("cy",5)
        // .attr("r",1)
        .append('use')
        .attr('href', function(d) {
            return `#${d.code}`;
        })
    
    node
        .append('image')
        .attr('clip-path', d => `url(#clip-${d.code})`)
        .attr('clip-path',d => `#clip-${d.code}`)
        //.attr('xlink:href',d => `/logos/${d.code}.webp`)
        .attr('xlink:href',d => `./logos/1301.T.webp`)
        .attr('x',d => -100 * 0.7)
        .attr('y',d => -100 * 0.7)
        .attr('height',d => 100 * 2 * 0.7)
        .attr('width',d =>  100 * 2 * 0.7);
/*         .attr('x',d => - d.r * 0.7)
        .attr('y',d => - d.r * 0.7)
        .attr('height',d => d.r * 2 * 0.7)
        .attr('width',d => d.r * 2 * 0.7); */

    // 3. forceSimulation設定
    simulation
        .force("charge",
             d3.forceManyBody()
                .strength()
                //distanceMaxが書けない!!
        )
        .force('collide', 
            d3.forceCollide()
                .radius(
                    function(d) 
                    {return get_radius(d,Math.floor(current_index)) + 1}
                )
                .strength(0.7)
        )
        .force('x', d3.forceX().strength(0.05).x(width/2))
        .force('y', d3.forceY().strength(0.05).y(height/2))
        .force("center", d3.forceCenter(width/2, height/2));


    simulation
    .nodes(nodesData)
    .on("tick", ticked);

    yearLabel
        .attr("class", "yearLabel")
        .attr("text-anchor", "end")
        .attr("font-size", 100)
        .attr("x", width - 100)
        .attr("y", height - 50)
        .attr("height",20)
        .attr("width",20)
        .attr("fill","black")
        .text(index_to_str(current_index))
    //.style("right","20px")
    //.style("bottom","30px")

    // 4. forceSimulation 描画更新用関数
    function ticked() {
    circles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }
    // 5. ドラッグ時のイベント関数
    function dragstarted_node(event,d) {
        console.log(d);
        if(!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
    }

    function dragged_node(event,d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended_node(event,d) {

        if(!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
    }
    function dragstarted_axis(event,d) {
        console.log(d);
        drag_delta = 0;
    }

    function dragged_axis(event,d) {
        drag_delta += event.dx;
        index_delta = drag_delta / drag_threshold;
    
        if (index_delta !=0) {
            next_index = current_index + index_delta;
            if (next_index < min_index ) next_index = min_index;
            else if (next_index > max_index) next_index = max_index;
        
        current_index = next_index;
        //nodesData = get_data(Math.floor(current_index))
        yearLabel.text(index_to_str(Math.floor(current_index)));
        scroller
            .attr("cx",blank_size + (width-2*blank_size)*(current_index - min_index)/(max_index - min_index))
        svg.selectAll(".node_circle")
            //.data(nodesData,function(d) {return d.code})
            .call(set_radius,Math.floor(current_index)).sort(order);
        //simulation.alphaTarget(0).restart();
/*         simulation
            .nodes(nodesData)
            .on("tick", ticked);    */
        //simulation.alphaTarget(0);
        drag_delta = 0;
        }
    }
    
    function dragended_axis(event,d) {
        simulation
            .nodes(nodesData)
            .on("tick", ticked); 
        if(!event.active) simulation.alphaTarget(0.1).restart();
    }
}

function set_radius(p,index) {
    p.attr("r",function(d) {
        return get_radius(d,index)
    })
}

function get_radius(d,index) {
    //var variable_scale = d3.scaleLog().domain([min_data[index],max_data[index]]).range([10,30])
    var constant_scale = d3.scaleLog().domain([0.05,253]).range([radius_min,radius_max]);
    var linear_scale = d3.scaleLinear().domain([0.05,253]).range([radius_min,radius_max])
    console.log(min_data[index],max_data[index])
    if (d.value[index][1] == 0) {
        return 0;
    }
    else {
        //return constant_scale(d.value[index][1]);
        return linear_scale(d.value[index][1]);
    }
}

function order (a,b) {
    return b.value[1] - a.value[1];
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
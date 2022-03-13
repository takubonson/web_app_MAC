const file = './data/finished.json';
const offset = 60;
const blank_size = 30;
const min_year = 2001;
const max_year = 2021;
const width = document.getElementById('parentdiv').clientWidth;
const height = document.getElementById('parentdiv').clientHeight;
const padding = 2;
const radius_min = 15
const radius_max = 50;
var color = d3.scaleOrdinal(d3.schemeCategory10);
var simulation
var nodesData = [];
var bubble;
var root;
var node;
var circle;
const inputElemInit = document.getElementById('time_slider');

//業種絞り込みのため
var axis_categories = ["資本金", "残業時間", "有休消化率", "待遇面の満足度", "社員の士気", "風通しの良さ", "社員の相互尊重", "20代成長環境", "人材の長期育成", "法令遵守意識", "人事評価の適正感", "従業員数(連結)", "平均年齢", "平均年収", "設立年"];
var company_categories = {"機械系": ["輸送用機器", "電気機器", "機械", "精密機器"], 
                          "サービス業": ["サービス業"], 
                          "IT": ["IT"], 
                          "金融・保険": ["銀行業", "保険業", "証券、商品先物取引業", "その他金融業"], 
                          "化学・石油・石炭": ["化学", "石油・石炭製品"], 
                          "卸売・小売・食料": ["小売業", "卸売業", "食料品"], 
                          "医薬品": ["医薬品"], 
                          "運輸": ["陸運業", "海運業", "空運業"], 
                          "建設・不動産": ["建設業", "不動産業"],
                          "その他": ["その他製品", "ゴム製品", "金属", "ガラス・土石製品", "電気・ガス業", "水産・農林業"]};

var selected_categories = ["機械系", "サービス業", "IT", "金融・保険", "化学・石油・石炭", "卸売・小売・食料", "医薬品", "運輸", "建設・不動産", "その他"];
var selected_companies = [];
var force_scale = d3.scaleLinear().domain([0,300]).range([0.01,0.8])

var current_index = 0;
const total_sample_num = 252;
const max_index = total_sample_num - 1;
const min_index = 0;
var drag_delta;
var drag_threshold = (width - 2 * blank_size) / (max_index - min_index);
var max_data = Array(total_sample_num).fill(0.01);
var min_data = Array(total_sample_num).fill(1000);

function index_to_str(index) {
    month = index % 12 + 1;
    year = 2001 + Math.floor(index / 12);
    return year + "-" + month;
}

d3.selectAll(".maincategory").on("change", update);

const generateChart = data => {
    //固定スケールにするならここも消してok
    data.forEach(function (d) {
        for (i = 0; i <= max_index; i++) {
            var tmp = d.value[i][1];
            if (tmp > 0) {
                max_data[i] = Math.max(max_data[i], tmp);
                min_data[i] = Math.min(min_data[i], tmp);

            }
        }
    })
    //console.log(max_data);
    //console.log(min_data);
    var maxmax = max_data.reduce(function (a, b) {
        return Math.max(a, b);
    });
    var minmin = min_data.reduce(function (a, b) {
        return Math.min(a, b);
    });
    //scaleの元になるデータの取得 削除してok
    //console.log(maxmax);
    //console.log(minmin);

    var svg = d3.select('#time-mode')
        .style('width', width)
        .style('height', height);

    data.forEach(function (d){
        if(selected_categories.includes(d.category_new)){
            selected_companies.push(d);
        }
    })

    nodesData = selected_companies.map(
        function (d) {
            return {
                name: d.company_name,
                code: d.company_code,
                value: d.value,
                category_new: d.category_new,
                category_orig: d.category_orig,
                capital: d.capital,
                found_year: d.found_year,
                listed_year: d.listed_year,
                num_of_employees: d.num_of_employees,
                overtime: d.overtime,
                paid_holiday: d.paid_holiday,
                income: d.income,
                age: d.age,
            }
        }
    )

    console.log(nodesData);

    var tooltip = d3.tip()
            .attr("class", "tooltip")
            .offset([-8, 0])
            .html(function (event, d) {
                return (
                    "<div class=logo>" +
                    `<img src=./images/${d.code}.webp>` +
                    "</div>" +
                    "<div class=info>" + 
                    "<p>" +
                    `企業名 <span>${d.name}</span>` +
                    "</p>" +
                    "<p>" +
                    `時価総額 <span>$${d.value[Math.floor(current_index)][1]}B（${d.value[Math.floor(current_index)][2]}位）</span>` +
                    "</p>" +
                    "<p>" +
                    `(${index_to_str(Math.floor(current_index)).replace("-","年")}月時点)`+
                    "</p>" +
                    "</div>"
                )
            });
    svg.call(tooltip);

    var node = svg.selectAll(".node")
        .data(nodesData)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on("start", dragstarted_node)
            .on("drag", dragged_node)
            .on("end", dragended_node))
        .on("click", function(e, d){
            d3.select(".modal-title").text(`${d.name}（業種：${d.category_new}）`)
            d3.select(".modal-body").html(function(){
                return (
                    `
                    <div class='infowindow'>
                      <div class='logo'>
                        <img src=./images/${d.code}.webp>
                      </div>
                      <table border='0' align="center">
                      <tr>
                          <th>資本金</th>
                          <td>${d.capital/100}億円</td>
                      </tr>
                      <tr>
                          <th>設立年</th>
                          <td>${d.found_year}年</td>
                      </tr>
                      <tr>
                          <th>上場年</th>
                          <td>${d.listed_year}年</td>
                      </tr>
                      <tr>
                          <th>従業員数</th>
                          <td>${d.num_of_employees}人</td>
                      </tr>
                      <tr>
                          <th>平均残業時間</th>
                          <td>${d.overtime}h</td>
                      </tr>
                      <tr>
                          <th>有休消化率</th>
                          <td>${d.paid_holiday}%</td>
                      </tr>
                      <tr>
                          <th>平均年収</th>
                          <td>${d.income/10}万円</td>
                      </tr>
                      <tr>
                          <th>平均年齢</th>
                          <td>${d.age}歳</td>
                      </tr>
                      
                      <div class='glaph'>
                      <img src=./graph_image/${d.code}.png>
                      </div>
                    </div>
                    `
                    
                );
            })
        })
        .attr("class", "btn btn-block btn-primary")
        .attr("data-toggle", "modal")
        .attr("data-target", "#myModal")
        .on("mouseover", tooltip.show)
        .on("mouseout", tooltip.hide)
    //console.log(node)
    node
        .append('circle')
        .attr("class", "node_circle")
        .attr("id", d => { return d.code; })
        //.attr("r",d => get_radius(d,Math.floor(current_index)))
        .call(set_radius, Math.floor(current_index))
        //.attr("fill","")
        //.attr("stroke","#312f2d")
        .attr("fill", "white")
        .attr("stroke", "black")


    node.append('clipPath')
        .attr('id', function (d) {
            return `clip-${d.code}`;
        })
        .append('use')
        .attr('href', function (d) {
            return `#${d.code}`;
        })

    node
        .append('image')
        .attr('class','image_cut')
        .attr('clip-path', d => `url(#clip-${d.code})`)
        //.attr('clip-path',d => `#clip-${d.code}`)
        .attr('xlink:href', d => `./images/${d.code}.webp`)
        //.attr('xlink:href',d => `/logos/1301.T.webp`)
        .attr('x', d => - get_radius(d, Math.floor(current_index))* 0.7)
        .attr('y', d => -get_radius(d, Math.floor(current_index))* 0.7)
        .attr('height', d => get_radius(d, Math.floor(current_index)) * 2 * 0.7)
        .attr('width', d => get_radius(d, Math.floor(current_index)) * 2 * 0.7);

    // 3. forceSimulation設定
    simulation = d3.forceSimulation();
    simulation
        .force("charge",
            d3.forceManyBody()
                .strength()
            //distanceMaxが書けない!!
        )
        .force('collide',
            d3.forceCollide()
                .radius(
                    function (d) { return get_radius(d, Math.floor(current_index)) + padding }
                )
                .strength(0.7)
        )
        .force('x', d3.forceX().strength(function(d) {return force_scale(d.value[current_index][1])}).x(width / 2))
        .force('y', d3.forceY().strength(function(d) {return force_scale(d.value[current_index][1])}).y(height / 2))
        .force("center", d3.forceCenter(width / 2, height / 2));

    //console.log(nodesData)
    simulation
        .nodes(nodesData)
        .on("tick", ticked);

    var yearLabel = svg.append("text");
    console.log(current_index);

    yearLabel
        .attr("class", "yearLabel")
        .attr("text-anchor", "end")
        .attr("x", width*20/21)
        .attr("y", height*9/10)
        .attr("fill", "white")
        .text(index_to_str(Math.floor(current_index)))

    const inputElem = document.getElementById('time_slider');
    const rangeOnChange = (e) =>{
        current_index = e.target.value;
        console.log(current_index);
        yearLabel.text(index_to_str(Math.floor(current_index)));
        svg.selectAll(".node_circle")
            .data(nodesData, function (d) { return d.code })
            .call(set_radius, Math.floor(current_index))
        svg.selectAll(".image_cut")
            .data(nodesData)
            .attr('x', d => -get_radius(d,Math.floor(current_index))*0.7)
            .attr('y', d => -get_radius(d,Math.floor(current_index))*0.7)
            .attr('height', d => get_radius(d, Math.floor(current_index)) * 2 * 0.7)
            .attr('width', d => get_radius(d, Math.floor(current_index)) * 2 * 0.7);
        simulation
        .nodes(nodesData)
        .on("tick", ticked);
        simulation.alphaTarget(0.1).restart();
    }
    inputElem.addEventListener('input',rangeOnChange);    
    // 4. forceSimulation 描画更新用関数
    function ticked() {
        node
            .attr('transform', d => `translate(${d.x},${d.y})`)
        /*         circles
                    .attr('r',d => d.r) */
    }
    // 5. ドラッグ時のイベント関数
    function dragstarted_node(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged_node(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended_node(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    function dragstarted_axis(event, d) {
        drag_delta = 0;
    }

    function dragged_axis(event, d) {
        drag_delta += event.dx;
        index_delta = drag_delta / drag_threshold;

        if (index_delta != 0) {
            next_index = current_index + index_delta;
            if (next_index < min_index) next_index = min_index;
            else if (next_index > max_index) next_index = max_index;

            current_index = next_index;
            //nodesData = get_data(Math.floor(current_index))
            yearLabel.text(index_to_str(Math.floor(current_index)));
            scroller
                .attr("cx", blank_size + (width - 2 * blank_size) * (current_index - min_index) / (max_index - min_index))
            svg.selectAll(".node_circle")
                .data(nodesData, function (d) { return d.code })
                .call(set_radius, Math.floor(current_index))
            svg.selectAll(".image_cut")
                .data(nodesData)
                .attr('x', d => -get_radius(d,Math.floor(current_index))*0.7)
                .attr('y', d => -get_radius(d,Math.floor(current_index))*0.7)
                .attr('height', d => get_radius(d, Math.floor(current_index)) * 2 * 0.7)
                .attr('width', d => get_radius(d, Math.floor(current_index)) * 2 * 0.7);
            drag_delta = 0;
        }
    }

    function dragended_axis(event, d) {
        simulation
            .nodes(nodesData)
            .on("tick", ticked);
        if (!event.active) simulation.alphaTarget(0.1).restart();
    }
}

function set_radius(p, index) {
    p.attr("r", function (d) {
        return get_radius(d, index)
    })
}

function get_radius(d, index) {
    //var variable_scale = d3.scaleLog().domain([min_data[index],max_data[index]]).range([10,30])
    var constant_scale = d3.scaleLog().domain([0.05, 253]).range([radius_min, radius_max]);
    var linear_scale = d3.scaleLinear().domain([0.05, 253]).range([radius_min, radius_max]);
    //console.log(min_data[index],max_data[index])
    if (d.value[index][1] === '0') {
        return 0;
    }
    else {
        return linear_scale(d.value[index][1]);
        //return constant_scale(parseFloat(d.value[1]));
    }
}

function order(a, b) {
    return b.value[1] - a.value[1];
}

function update() {
    if (this.checked) {
        selected_categories.push(this.id)
    } else {
        let s = this.id
        selected_categories = selected_categories.filter(function (e) { return (e !== s) })
    }
    selected_companies = [];
    d3.selectAll("g").remove();
    d3.selectAll("text").remove();
    simulation = undefined;
    generateChart(data);
}

(async () => {
    data = await d3.json(file).then(data => data);
    generateChart(data);
})();
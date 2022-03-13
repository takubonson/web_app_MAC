const width = document.getElementById('parentdiv').clientWidth;
const height = document.getElementById('parentdiv').clientHeight;
var offset = 40;
var color = d3.scaleOrdinal(d3.schemeSet3);

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

var selectXaxis = d3.select(".filteringbox")
    .append("div")
    .append("select")
    .attr("class", "select-xaxis")
    .selectAll("option")
    .data(axis_categories)
    .enter()
    .append("option")
    .attr("value", (_, i) => i)
    .text((d) => d);

var selectYaxis = d3.select(".filteringbox")
    .append("div")
    .append("select")
    .attr("class", "select-yaxis")
    .selectAll()
    .data(axis_categories)
    .enter()
    .append("option")
    .attr("value", (_, i) => i)
    .text((d) => d);

var x_index = 0;
var y_index = 0;

var currentPosition_x = [];
var currentPosition_y = [];

var initFlg = 1;

var capScale = d3.scaleLinear().domain([0.1, 300]).range([5,50]);




var svg = d3.select("#chart-mode")
    .style("width", width)
    .style("height", height);

d3.csv("./data/chartmode_data.csv").then(function (companies) {
    var Scales = Array(axis_categories.length);

    for (let i = 0; i < axis_categories.length; ++i) {
        if (i >= 3 && i <= 10) {
            Scales[i] = d3.scaleLinear().domain([1.65, 5]);
        } else {
            switch (i) {
                case 0:
                    Scales[i] = d3.scaleLog().domain([100, 5000000]);
                    break;
                case 1:
                    Scales[i] = d3.scaleLinear().domain([0, 70]);
                    break;
                case 2:
                    Scales[i] = d3.scaleLinear().domain([10, 100]);
                    break;
                case 11:
                    Scales[i] = d3.scaleLog().domain([100, 500000]);
                    break;
                case 12:
                    Scales[i] = d3.scaleLinear().domain([20, 60]);
                    break;
                case 13:
                    Scales[i] = d3.scaleLinear().domain([4000, 20000]);
                    break;
                case 14:
                    Scales[i] = d3.scaleLinear().domain([1880, 2015]);
                    break;
            }
        }
    }


    //初期化
    showChart();


    d3.select(".select-xaxis")
        .on("change", function (event) {
            svg.selectAll("circle").remove();
            svg.selectAll(".yAxis").remove();
            svg.selectAll(".xAxis").remove();

            pre_x_index = x_index;
            
            x_index = parseInt(d3.select(this).property("value"));

            showChart();
        });

    d3.select(".select-yaxis")
        .on("change", function (event) {
            svg.selectAll("circle").remove();
            svg.selectAll(".yAxis").remove();
            svg.selectAll(".xAxis").remove();

            pre_y_index = y_index;

            y_index = parseInt(d3.select(this).property("value"));

            showChart();

        });


    function showChart() {
        var xScale = Scales[x_index].range([offset, width - offset]);
        var xAxis = d3.axisBottom(xScale);
        if(x_index >= 3 && x_index <= 10){
            xAxis.tickValues([]).tickSize(0);
        }
        
        if(x_index != y_index){
            svg.append("g")
                .attr("class", "xAxis")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("transform", "translate(0," + (height - offset) + ")")
                .call(xAxis);

            var yScale = Scales[y_index].range([height - offset, offset]);
            var yAxis = d3.axisLeft(yScale);
            if(y_index >= 3 && y_index <= 10){
                console.log("hoge")
                yAxis.tickValues([]).tickSize(0);
            }

            svg.append("g")
                .attr("class", "yAxis")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("transform", "translate(" + offset + ",0)")
                .call(yAxis);
        }else{
            svg.append("g")
                .attr("class", "xAxis")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("transform", "translate(0," + (height + 3*offset)/2 + ")")
                .call(xAxis);
        }




        var tooltip = d3.tip()
            .attr("class", "tooltip")
            .offset([-8, 0])
            .html(function (event, d) {
                return (
                    `企業名: <span>${d["提出者名"]}</span>` +
                    "<br>" +
                    `時価総額: <span>$${d["時価総額"]}B</span>`+
                    "<br>" + 
                    "<div class=logo>" +
                    `<img src=./images/${d["株式コード"]}.webp>` +
                    "</div>"
                )
            });
        svg.call(tooltip);

        var circle;
        if (initFlg == 1) {
            circle = svg.selectAll("circle")
                .data(companies)
                .enter()
                .append("circle")
                .attr("class", "circle")
                .attr("fill", function (d) {
                    return color(d["業種"]);
                })
                .attr("stroke", "grey")
                .attr("r", function (d, i) {
                    if(d[axis_categories[x_index]]=="None" || d[axis_categories[y_index]]== "Nonde"){
                        return 0;
                    }else{
                        return capScale(d["時価総額"]);
                    }
                })
                .attr("cx", function (d, i) {
                    currentPosition_x[i] = xScale(d[axis_categories[x_index]]);
                    return xScale(d[axis_categories[x_index]])
                })
                .attr("cy", function (d, i) {
                    if(y_index != x_index){
                        currentPosition_y[i] = yScale(d[axis_categories[y_index]]);
                        return yScale(d[axis_categories[y_index]]);
                    }else{
                        return height/2;
                    }
                })
                .on("mouseover", tooltip.show)
                .on("mouseout", tooltip.hide)
                .sort(order);

            initFlg = 0;
        } else {
            svg.selectAll("circle")
                .data(companies)
                .enter()
                .append("circle")
                .attr("class", "circle")
                .attr("fill", function (d) {
                    return color(d["提出者業種"]);
                })
                .attr("stroke", "grey")
                .attr("r", function (d) {
                    if(d[axis_categories[x_index]]=="None" || d[axis_categories[y_index]]=="None"){
                        return 0;
                    }else{
                        return capScale(d["時価総額"]);
                    }
                })
                .on("mouseover", tooltip.show)
                .on("mouseout", tooltip.hide)
                .attr("cx", function (d, i) {
                    return currentPosition_x[i];
                })
                .attr("cy", function (d, i) {
                    return currentPosition_y[i];
                })
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("cx", function (d, i) {
                    currentPosition_x[i] = xScale(d[axis_categories[x_index]]);
                    return xScale(d[axis_categories[x_index]])
                })
                .attr("cy", function (d, i) {
                    if(y_index != x_index){
                        currentPosition_y[i] = yScale(d[axis_categories[y_index]]);
                        return yScale(d[axis_categories[y_index]]);
                    }else{
                        return height/2;
                    }
                })
                .sort(order);
        }
        function order(a, b){
            return b["時価総額"] - a["時価総額"]
        }
    }

});
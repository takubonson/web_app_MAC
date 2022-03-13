const width = document.getElementById('parentdiv').clientWidth;
const height = document.getElementById('parentdiv').clientHeight;
var offset = 70;
var color = d3.scaleOrdinal(d3.schemeSet3);
var xScale;
var yScale;
var centerCapScale;
var tooltip;
var categoryTooltip;

// var axis_categories = ["資本金", "残業時間", "有休消化率", "待遇面の満足度", "社員の士気", "風通しの良さ", "社員の相互尊重", "20代成長環境", "人材の長期育成", "法令遵守意識", "人事評価の適正感", "従業員数", "平均年齢", "平均年収", "設立年"];
var axis_categories = ["資本金", "残業時間", "有休消化率", "従業員数", "平均年齢", "平均年収", "設立年"];
// var unit_list = ["[百万円]", "[h]", "[%]", "", "", "", "", "", "", "", "", "[人]", "[歳]", "[千円]", "[年]"];
var unit_list = ["[百万円]", "[h]", "[%]", "[人]", "[歳]", "[千円]", "[年]"];

var main_categories = ["機械系", "サービス業", "IT", "金融・保険", "化学・石油・石炭", "卸売・小売・食料", "医薬品", "運輸", "建設・不動産", "その他"];
var sub_categories = {
    "機械系": ["輸送用機器", "電気機器", "機械", "精密機器"],
    "サービス業": ["サービス業"],
    "IT": ["IT"],
    "金融・保険": ["銀行業", "保険業", "証券、商品先物取引業", "その他金融業"],
    "化学・石油・石炭": ["化学", "石油・石炭製品"],
    "卸売・小売・食料": ["小売業", "卸売業", "食料品"],
    "医薬品": ["医薬品"],
    "運輸": ["陸運業", "海運業", "空運業"],
    "建設・不動産": ["建設業", "不動産業"],
    "その他": ["その他製品", "ゴム製品", "金属", "ガラス・土石製品", "電気・ガス業", "水産・農林業"]
};


var selected_categories = ["機械系", "サービス業", "IT", "金融・保険", "化学・石油・石炭", "卸売・小売・食料", "医薬品", "運輸", "建設・不動産", "その他"];

var selectXaxis = d3.select(".selectXaxis")
    .append("select")
    .attr("class", "select-xaxis")
    .style("width", "100%")
    .selectAll("option")
    .data(axis_categories)
    .enter()
    .append("option")
    .attr("value", (_, i) => i)
    .text((d) => d);

var selectYaxis = d3.select(".selectYaxis")
    .append("select")
    .attr("class", "select-yaxis")
    .style("width", "100%")
    .selectAll()
    .data(axis_categories)
    .enter()
    .append("option")
    .attr("value", (_, i) => i)
    .attr("selected", function(_,i){
        if(i == 1){
            return true;
        }
    })
    .text((d) => d);

var x_index = 0;
var y_index = 1;

var currentPosition_x = [];
var currentPosition_y = [];

var initFlg = 1;

var capScale = d3.scaleLinear().domain([0.1, 300]).range([5, 50]);




var svg = d3.select("#chart-mode")
    .style("width", width)
    .style("height", height);

d3.csv("./data/chartmode_data.csv").then(function (companies) {
    var Scales = Array(axis_categories.length);

    for (let i = 0; i < axis_categories.length; ++i) {
        // if (i >= 3 && i <= 10) {
        //     Scales[i] = d3.scaleLinear().domain([1.65, 5]);
        // } else {
        //     switch (i) {
        //         case 0:
        //             Scales[i] = d3.scaleLog().domain([100, 5000000]);
        //             break;
        //         case 1:
        //             Scales[i] = d3.scaleLinear().domain([0, 70]);
        //             break;
        //         case 2:
        //             Scales[i] = d3.scaleLinear().domain([10, 100]);
        //             break;
        //         case 11:
        //             Scales[i] = d3.scaleLog().domain([100, 500000]);
        //             break;
        //         case 12:
        //             Scales[i] = d3.scaleLinear().domain([20, 60]);
        //             break;
        //         case 13:
        //             Scales[i] = d3.scaleLinear().domain([4000, 20000]);
        //             break;
        //         case 14:
        //             Scales[i] = d3.scaleLinear().domain([1880, 2015]);
        //             break;
        //     }
        // }
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
            case 3:
                Scales[i] = d3.scaleLog().domain([100, 500000]);
                break;
            case 4:
                Scales[i] = d3.scaleLinear().domain([20, 60]);
                break;
            case 5:
                Scales[i] = d3.scaleLinear().domain([4000, 20000]);
                break;
            case 6:
                Scales[i] = d3.scaleLinear().domain([1880, 2015]);
                break;
        }
    }

    //カテゴリーごとの平均 categoryAverage[業種][indexOf(axis_category)] = ある業種のaxis_categoryの平均
    var categoryAverage = caluculateAverage(companies);
    var categoryCapSum = caluculateCapSum(companies);

    var minMax = categoryCapSumMinMax(categoryCapSum);
    centerCapScale = d3.scaleLinear().domain(minMax).range([10, 50]);
    

    //初期化
    showChart();


    d3.select(".select-xaxis")
        .on("change", function (event) {
            svg.selectAll("circle").remove();
            svg.selectAll(".yAxis").remove();
            svg.selectAll(".xAxis").remove();
            svg.selectAll(".ylabel").remove();
            svg.selectAll(".xlabel").remove();

            pre_x_index = x_index;

            x_index = parseInt(d3.select(this).property("value"));

            showChart();

            let centerCheck = document.getElementById("category-center");
            if(centerCheck.checked){
                showCenter();
            }
        });

    d3.select(".select-yaxis")
        .on("change", function (event) {
            svg.selectAll("circle").remove();
            svg.selectAll(".yAxis").remove();
            svg.selectAll(".xAxis").remove();
            svg.selectAll(".ylabel").remove();
            svg.selectAll(".xlabel").remove();

            pre_y_index = y_index;

            y_index = parseInt(d3.select(this).property("value"));

            showChart();

            let centerCheck = document.getElementById("category-center");
            if(centerCheck.checked){
                showCenter();
            }

        });

    d3.selectAll(".maincategory").on("change", function(){
        svg.selectAll("circle").remove();
        svg.selectAll(".yAxis").remove();
        svg.selectAll(".xAxis").remove();
        svg.selectAll(".ylabel").remove();
        svg.selectAll(".xlabel").remove();
        if(this.checked){
            selected_categories.push(this.id);
        }else{
            let delete_category = this.id;
            selected_categories = selected_categories.filter(function(e){return (e!==delete_category);});
        }
        initFlg = 1;
        showChart();

        let centerCheck = document.getElementById("category-center");
        if(centerCheck.checked){
            showCenter();
        }
    });

    //全解除、全選択の動き
    d3.selectAll("#all-select")
    .on("click", function(){
        let elements = document.getElementsByClassName("maincategory");
        for(let i = 0; i < elements.length; ++i){
            elements[i].checked = true;
        }

        svg.selectAll("circle").remove();
        svg.selectAll(".yAxis").remove();
        svg.selectAll(".xAxis").remove();
        svg.selectAll(".ylabel").remove();
        svg.selectAll(".xlabel").remove();
        selected_categories = ["機械系", "サービス業", "IT", "金融・保険", "化学・石油・石炭", "卸売・小売・食料", "医薬品", "運輸", "建設・不動産", "その他"];
        initFlg = 1;
        showChart();

        let centerCheck = document.getElementById("category-center");
        if(centerCheck.checked){
            showCenter();
        }
    });

    d3.selectAll("#all-deselect")
    .on("click", function(){
        let elements = document.getElementsByClassName("maincategory");
        for(let i = 0; i < elements.length; ++i){
            elements[i].checked = false;
        }

        svg.selectAll("circle").remove();
        svg.selectAll(".yAxis").remove();
        svg.selectAll(".xAxis").remove();
        svg.selectAll(".ylabel").remove();
        svg.selectAll(".xlabel").remove();
        selected_categories = [];
        initFlg = 1;
        showChart();
        
        let centerCheck = document.getElementById("category-center");
        if(centerCheck.checked){
            showCenter();
        }
    });


    d3.selectAll("#category-center")
    .on("change", function(){
        if(this.checked){
            showCenter();
        }else{
            svg.selectAll(".center-circle").remove();
            svg.selectAll("circle")
                .style("opacity", 1)
                .on("mouseover", tooltip.show)
                .on("mouseout", tooltip.hide);
        }
    });

    function showChart() {
        var selected_companies = [];

        companies.forEach(function (d){
            if(selected_categories.includes(d["業種"])){
                selected_companies.push(d);
            }
        })


        xScale = Scales[x_index].range([offset, width - offset]);
        var xAxis = d3.axisBottom(xScale);
        // if (x_index >= 3 && x_index <= 10) {
        //     xAxis.tickValues([]).tickSize(0);
        // }

        if (x_index != y_index) {
            svg.append("g")
                .attr("class", "xAxis")
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("transform", "translate(0," + (height - offset) + ")")
                .call(xAxis.tickSize(-height));

            svg.append("text")
                .attr("class", "xlabel")
                .attr("text-anchor", "end")
                .attr("fill", "white")
                .attr("x", (width + offset) / 2)
                .attr("y", height - 10)
                .text(axis_categories[x_index] + unit_list[x_index]);



            yScale = Scales[y_index].range([height - offset, offset]);
            var yAxis = d3.axisLeft(yScale);
            // if (y_index >= 3 && y_index <= 10) {
            //     yAxis.tickValues([]).tickSize(0);
            // }

            svg.append("g")
                .attr("class", "yAxis")
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("transform", "translate(" + offset + ",0)")
                .call(yAxis.tickSize(-width));

            svg.append("text")
                .attr("class", "ylabel")
                .attr("text-anchor", "end")
                .attr("fill", "white")
                .attr("x", -(height - 2 * offset) / 2)
                .attr("y", 25)
                .attr("transform", "rotate(-90)")
                .text(axis_categories[y_index] + unit_list[y_index]);
        } else {
            svg.append("g")
                .attr("class", "xAxis")
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("transform", "translate(0," + (height + 3 * offset) / 2 + ")")
                .call(xAxis.tickSize(-height));

            svg.append("text")
                .attr("class", "xlabel")
                .attr("text-anchor", "end")
                .attr("fill", "white")
                .attr("x", (width + offset) / 2)
                .attr("y", (height + 5 * offset) / 2)
                .text(axis_categories[x_index] + unit_list[x_index]);
        }




        tooltip = d3.tip()
            .attr("class", "tooltip")
            .offset([-8, 0])
            .html(function (event, d) {
                return (
                    "<div class=logo>" +
                    `<img src=./images/${d["株式コード"]}.webp>` +
                    "</div>" +
                    "<div class=info>" + 
                    "<p>" +
                    `企業名 <span>${d["提出者名"]}（${d["業種"]}）</span>` +
                    "</p>" +
                    "<p>" +
                    ` ( ${d[axis_categories[x_index]]+ " " +unit_list[x_index]} , ${d[axis_categories[y_index]]+" "+unit_list[y_index]} ) ` + 
                    "</p>" + 
                    "<p>" +
                    `時価総額 <span>$${d["時価総額"]}B</span>` +
                    "</p>" +
                    "<p>" + 
                    `国内ランキング <span>${parseInt(d["順位"])+1}位</span>（2021年12月現在）` +
                    "</p>" +
                    "</div>"
                )
            });
        svg.call(tooltip);

        var circle;
        if (initFlg == 1) {
            circle = svg.selectAll(".companyCircle")
                .data(selected_companies)
                .enter()
                .append("circle")
                .attr("class", "companyCircle")
                .attr("fill", function (d) {
                    return color(d["業種"]);
                })
                .attr("stroke", "grey")
                .attr("cx", function (d, i) {
                    currentPosition_x[i] = xScale(d[axis_categories[x_index]]);
                    return xScale(d[axis_categories[x_index]])
                })
                .attr("cy", function (d, i) {
                    if (y_index != x_index) {
                        currentPosition_y[i] = yScale(d[axis_categories[y_index]]);
                        return yScale(d[axis_categories[y_index]]);
                    } else {
                        return height / 2;
                    }
                })
                .on("mouseover", tooltip.show)
                .on("mouseout", tooltip.hide)
                .on("click", function(e, d){
                    d3.select(".modal-title").text(`${d["提出者名"]}（業種：${d["業種"]}）`)
                    d3.select(".modal-body").html(function(){
                        return (
                            `
                            <div class='infowindow'>
                              <div class='logo'>
                                <img src=./images/${d["株式コード"]}.webp>
                              </div>
                              <table border='0' align="center">
                              <tr>
                                  <th>資本金</th>
                                  <td>${(d["資本金"]!="None") ? d["資本金"]/100 : "-"}億円</td>
                              </tr>
                              <tr>
                                  <th>設立年</th>
                                  <td>${(d["設立年"]!="None") ? d["設立年"] : "-"}年</td>
                              </tr>
                              <tr>
                                  <th>上場年</th>
                                  <td>${(d["上場年"]!="None") ? d["上場年"] : "-"}年</td>
                              </tr>
                              <tr>
                                  <th>従業員数</th>
                                  <td>${(d["従業員数"]!="None") ? d["従業員数"] : "-"}人</td>
                              </tr>
                              <tr>
                                  <th>平均残業時間</th>
                                  <td>${(d["残業時間"]!="None") ? d["残業時間"] : "-"}h</td>
                              </tr>
                              <tr>
                                  <th>有休消化率</th>
                                  <td>${(d["有休消化率"]!="None") ? d["有休消化率"] : "-"}%</td>
                              </tr>
                              <tr>
                                  <th>平均年収</th>
                                  <td>${(d["平均年収"]!="None") ? d["平均年収"]/10 : "-"}万円</td>
                              </tr>
                              <tr>
                                  <th>平均年齢</th>
                                  <td>${(d["平均年齢"]!="None") ? d["平均年齢"] : "-"}歳</td>
                              </tr>
                              
                              <div class='glaph'>
                              <img src=./graph_image/${d["株式コード"]}.png>
                              </div>
                            </div>
                            `
                            
                        );
                    })
                })
                .attr("class", "btn btn-block btn-primary")
                .attr("data-toggle", "modal")
                .attr("data-target", "#myModal")
                .sort(order)
                .attr("r", 0)
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("r", function (d, i) {
                    if (d[axis_categories[x_index]] == "None" || d[axis_categories[y_index]] == "None") {
                        return 0;
                    } else {
                        return capScale(d["時価総額"]);
                    }
                });
                
            initFlg = 0;
        } else {
            circle = svg.selectAll(".companyCircle")
                .data(selected_companies)
                .enter()
                .append("circle")
                .attr("class", "companyCircle")
                .attr("fill", function (d) {
                    return color(d["業種"]);
                })
                .attr("stroke", "grey")
                .attr("r", function (d) {
                    if (d[axis_categories[x_index]] == "None" || d[axis_categories[y_index]] == "None") {
                        return 0;
                    } else {
                        return capScale(d["時価総額"]);
                    }
                })
                .on("mouseover", tooltip.show)
                .on("mouseout", tooltip.hide)
                .on("click", function(e, d){
                    d3.select(".modal-title").text(`${d["提出者名"]}（業種：${d["業種"]}）`)
                    d3.select(".modal-body").html(function(){
                        return (
                            `
                            <div class='infowindow'>
                              <div class='logo'>
                                <img src=./images/${d["株式コード"]}.webp>
                              </div>
                              <table border='0' align="center">
                              <tr>
                                  <th>資本金</th>
                                  <td>${(d["資本金"]!="None") ? d["資本金"]/100 : "-"}億円</td>
                              </tr>
                              <tr>
                                  <th>設立年</th>
                                  <td>${(d["設立年"]!="None") ? d["設立年"] : "-"}年</td>
                              </tr>
                              <tr>
                                  <th>上場年</th>
                                  <td>${(d["上場年"]!="None") ? d["上場年"] : "-"}年</td>
                              </tr>
                              <tr>
                                  <th>従業員数</th>
                                  <td>${(d["従業員数"]!="None") ? d["従業員数"] : "-"}人</td>
                              </tr>
                              <tr>
                                  <th>平均残業時間</th>
                                  <td>${(d["残業時間"]!="None") ? d["残業時間"] : "-"}h</td>
                              </tr>
                              <tr>
                                  <th>有休消化率</th>
                                  <td>${(d["有休消化率"]!="None") ? d["有休消化率"] : "-"}%</td>
                              </tr>
                              <tr>
                                  <th>平均年収</th>
                                  <td>${(d["平均年収"]!="None") ? d["平均年収"]/10 : "-"}万円</td>
                              </tr>
                              <tr>
                                  <th>平均年齢</th>
                                  <td>${(d["平均年齢"]!="None") ? d["平均年齢"] : "-"}歳</td>
                              </tr>
                              
                              <div class='glaph'>
                              <img src=./graph_image/${d["株式コード"]}.png>
                              </div>
                            </div>
                            `
                            
                        );
                    })
                })
                .attr("class", "btn btn-block btn-primary")
                .attr("data-toggle", "modal")
                .attr("data-target", "#myModal")
                .sort(order)
                .attr("cx", function (d, i) {
                    return currentPosition_x[i];
                })
                .attr("cy", function (d, i) {
                    return currentPosition_y[i];
                })
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("cx", function (d, i) {
                    currentPosition_x[i] = xScale(d[axis_categories[x_index]]);
                    return xScale(d[axis_categories[x_index]])
                })
                .attr("cy", function (d, i) {
                    if (y_index != x_index) {
                        currentPosition_y[i] = yScale(d[axis_categories[y_index]]);
                        return yScale(d[axis_categories[y_index]]);
                    } else {
                        return height / 2;
                    }
                });
        }
        function order(a, b) {
            return b["時価総額"] - a["時価総額"]
        }
    }

    function caluculateAverage(companies){
        var categoryAverage = {};
        var categoryCount = {};
        main_categories.forEach(category => {
            let tmp = new Array(axis_categories.length);
            for(let i = 0; i < axis_categories.length; ++i){
                tmp[i] = 0;
            }
            categoryAverage[category] = tmp;
            let tmp2 = new Array(axis_categories.length);
            for(let i = 0; i < axis_categories.length; ++i){
                tmp2[i] = 0;
            }
            categoryCount[category] = tmp2;
        });

        companies.forEach(function(company){
            axis_categories.forEach(function(category){
                if(company[category] != "None"){
                    categoryAverage[company["業種"]][axis_categories.indexOf(category)] += parseFloat(company[category]);
                    categoryCount[company["業種"]][axis_categories.indexOf(category)] += 1;
                }
            });
        });

        main_categories.forEach(category => {
            for(let i = 0; i < axis_categories.length; ++i){
                categoryAverage[category][i] /= categoryCount[category][i];
            }
        })

        return categoryAverage;
    }

    function caluculateCapSum(companies){
        var categoryCapSum = {};
        var categoryCount = {};
        main_categories.forEach(category => {
            categoryCapSum[category] = 0;
            categoryCount[category] = 0;
        });
        

        companies.forEach(function(company){
            categoryCapSum[company["業種"]] +=parseFloat(company["時価総額"]);
            categoryCount[company["業種"]] += 1;
        })

        main_categories.forEach(category => {
            categoryCapSum[category] /= categoryCount[category];
        })

        return categoryCapSum;
    }

    function categoryCapSumMinMax(categoryCapSum){
        minMax = [999999999,  0];

        main_categories.forEach(category => {
            if(categoryCapSum[category] < minMax[0]){
                minMax[0] = categoryCapSum[category];
            }
            if(categoryCapSum[category] > minMax[1]){
                minMax[1] = categoryCapSum[category];
            }
        })
        return minMax;
    }


    function showCenter(){
        svg.selectAll("circle")
            .style("opacity", 0.1)
            .on("mouseover", function(){console.log();})
            .on("mouseout", function(){ console.log();});
        
        categoryTooltip = d3.tip()
            .attr("class", "tooltip")
            .offset([-8, 0])
            .html(function (event, d) {
                return (
                    `${d}`
                )
            });
        svg.call(categoryTooltip);

        if(x_index != y_index){
            let centerCircle = svg.selectAll(".center-circle")
                .data(selected_categories)
                .enter()
                .append("circle")
                .attr("class", "center-circle")
                .attr("r", function(d){
                    return centerCapScale(categoryCapSum[d]);
                })
                .attr("cx", function(d){
                    return xScale(categoryAverage[d][x_index]);
                })
                .attr("cy", function(d){
                    return yScale(categoryAverage[d][y_index]);
                })
                .attr("fill", function(d){
                    return color(d);
                })
                .attr("stroke", "black")
                .on("mouseover", categoryTooltip.show)
                .on("mouseout", categoryTooltip.hide);
        }else{
            let centerCircle = svg.selectAll(".center-circle")
                .data(selected_categories)
                .enter()
                .append("circle")
                .attr("class", "center-circle")
                .attr("r", function(d){
                    return centerCapScale(categoryCapSum[d]);
                })
                .attr("cx", function(d){
                    return xScale(categoryAverage[d][x_index]);
                })
                .attr("cy", function(d){
                    return height / 2;
                })
                .attr("fill", function(d){
                    return color(d);
                })
                .attr("stroke", "black")
                .on("mouseover", categoryTooltip.show)
                .on("mouseout", categoryTooltip.hide);
        }
    }
});
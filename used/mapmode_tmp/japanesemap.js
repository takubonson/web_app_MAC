const file = 'basic_info_pref.csv';
const width = window.innerWidth;
const height = window.innerHeight;
const centerdata = 'centerdata.csv';
var color = d3.scaleOrdinal(d3.schemeSet3); 
const tooltip_area = d3.select('.tooltip_area')
const tooltip_company = d3.select('.tooltip_company')
const svg = d3.select("#japanese_map")
            .attr("width",width)
            .attr("height",height)

var prefectures = ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県']
var companyHash = {};
prefectures.forEach(element => companyHash[element] = 0)

var color_numcom = d3.scaleLinear()
        .domain([0,140])
        .range([255,0]);
var codeHash = {};
var latitudeHash = {};
var longitudeHash = {};


d3.csv(centerdata).then(function(data) {
    data.forEach(function(d) {
        codeHash[d.都道府県名] = d.コード;
        latitudeHash[d.都道府県名] = d.緯度;
        longitudeHash[d.都道府県名] = d.経度;
    })
})

d3.csv(file).then(function(data) {
    data.forEach(function(d) {
        if (d.都道府県名 in companyHash) {
            companyHash[d.都道府県名] += 1
        }
        //console.log(companyHash[d.都道府県名])
    })
    const max_company = d3.max(Object.values(companyHash))
    const min_company = d3.min(Object.values(companyHash))
    console.log(max_company);
    console.log(min_company);
    var color_numcom = d3.scaleLinear().domain(min_company,max_company).range(255,0);
    showMap(data);
    //showPrefmap();
})

function showMap(basicdata) {

    d3.json("./japan.topojson").then(function(topodata) {
    
    var japan = topojson.feature(topodata, topodata.objects.japan);

    var projection = d3.geoMercator()
                        .center([137,34])
                        .translate([width/2,height/2])
                        .scale(1500)
                        .fitSize([width,height+200],japan);
                        //.fitExtent([0,0],[width,height]);
    var path = d3.geoPath().projection(projection);    
        // .on("mouseout",function(event,d) {
        //     tooltip.style('visibility','hidden')
        // })

    svg.selectAll()
        .data(japan.features)
        .enter()
        .append("path")
        .style("zindex",0)
        .attr("class","japanese")
        .attr("d",path)
        .attr("fill",function(d) {
            col = Math.floor(color_numcom(companyHash[d.properties.nam_ja]))
            return `rgb(255,${col},${col})`
        })
        .attr("fill","white")
        .attr("stroke", "black")
        .attr("stroke-width",0.5)
        .on("click",function(event,d) {
            console.log("clicked");
           return showPrefmap(d.properties.nam_ja);})
        .on("mouseover",function(event,d) {
            tooltip_area.select('span').text(d.properties.nam_ja);
            tooltip_area.style('visibility','visible');
            tooltip_area.style('bottom',`${2*height/3}px`);
            tooltip_area.style('right', `${width/5}px`);
            //console.log(d.properties.nam_ja);
        })

    //nodeを後から書く
    const node = svg.selectAll()
    .data(basicdata)
    .enter()
    .append("circle")
    .attr("class",function(d){return d.都道府県名+"c"});
    node.attr("cx",function(d) {
            return projection([d.経度,d.緯度])[0];
        })
        .attr("cy",function(d) {
            return projection([d.経度,d.緯度])[1];
        })
        .attr("r",2)
        .attr("stroke",function(d) {return color(d.提出者業種);})
        .attr("fill", function(d) {return color(d.提出者業種);})
        .on("mouseover",function(event,d) {
            //console.log(d.提出者名);
            tooltip_company.select('span').text(d.提出者名);
            tooltip_company.style('visibility','visible');
            tooltip_company.style('bottom',`${height/3}px`);
            tooltip_company.style('right', `${width/5}px`);
            tooltip_area.select('span').text(d.都道府県名);
            tooltip_area.style('visibility','visible');
            tooltip_area.style('bottom',`${2*height/3}px`);
            tooltip_area.style('right', `${width/5}px`);
        })
    })
}
function showPrefmap(pref_name) {
    var clicked_time = 0;
    //console.log("map");
    //console.log(pref_name);
    svg.selectAll("path")
        .style("visibility","hidden");
    svg.selectAll("circle")
        .style("visibility","hidden");
    //console.log(codeHash[pref_name]);

    d3.json("./data/p"+codeHash[pref_name]+"_001.topojson").then(function(topodata) {
        var prefmap = topojson.feature(topodata, topodata.objects.pref);
    
        var projection = d3.geoMercator()
                            .center([longitudeHash[pref_name],latitudeHash[pref_name]])//中心となる緯度経度を指定
                            .translate([width/2,height/2])
                            .scale(20000)
                            //.fitSize([width,height+200],tokyo);//余計なところまで写ってしまって見えづらい
                            //.fitExtent([0,0],[width,height])
        var path = d3.geoPath().projection(projection); 
        svg.selectAll()
        .data(prefmap.features)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("fill","white")
        .attr("fill-opacity",0)
        .attr("stroke", "black")
        .attr("stroke-width",0.5)
        .on("mouseover",function(event,d) {
            tooltip_area.select('span').text(d.properties.N03_004);
            tooltip_area.style('visibility','visible');
            tooltip_area.style('bottom',`${2*height/3}px`);
            tooltip_area.style('right', `${width/5}px`);
            //console.log(d.properties.N03_004);
        })

        d3.csv(file).then(function(basicdata) {
            svg.selectAll()
            .data(basicdata)
            .enter()
            .filter(function(d) {return d.都道府県名 == pref_name})
            .append("circle")  
            .attr("r",1)
            .attr("cx",function(d) {
                return projection([d.経度,d.緯度])[0];
            })
            .attr("cy",function(d) {
                return projection([d.経度,d.緯度])[1];
            })
            .attr("stroke",function(d) {return color(d.提出者業種);})
            .attr("fill", function(d) {return color(d.提出者業種);})
            .on("mouseover",function(event,d) {
                tooltip_company.select('span').text(d.提出者名);
                tooltip_company.style('visibility','visible');
                tooltip_company.style('bottom',`${height/3}px`);
                tooltip_company.style('right', `${width/5}px`);
                tooltip_area.select('span').text(d.都道府県名);
                tooltip_area.style('visibility','visible');
                tooltip_area.style('bottom',`${2*height/3}px`);
                tooltip_area.style('right', `${width/5}px`);
            })
            .style("visibility","visible");
        })
    })

    d3.select("body")
        .on("click",function(event,d) {
            if (clicked_time ==0) {
                clicked_time = 1;
            }
            else {
                //console.log("body clicked");
                d3.csv(file).then(function(data) {
                    svg.selectAll("path")
                    .style("visibility","hidden");
                    svg.selectAll("circle")
                    .style("visibility","hidden");                   
                    showMap(data);
                })
            }

        })
}
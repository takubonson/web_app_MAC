const width = 400
const height = 500;
const svg = d3.select("svg");
const mapLayer = svg.append("g");
const voronoiLayer = svg.append("g");
const projection = d3.geoMercator();
 
const path = d3.geoPath();　
 
const q = d3.queue();
 
q
 .defer(d3.json, "takasaki.topojson")
 .defer(d3.json, "gasStation.geojson")
 .await((error, maps2topo, point2geo) => {
    const maps2geo = topojson.feature(maps2topo, maps2topo.objects.takasaki);
 
    //読み込んだ地図データが描画領域に収まるように自動的にプロジェクションを調整する。
    projection.fitExtent([[0,0],[width, height]], maps2geo);
    path.projection(projection);
 
    drawMaps(maps2geo);
    drawVoronoi(point2geo);
});
 
 
function drawMaps(geojson){
    //地図表示
    const map =  mapLayer.attr("id", "map")
        .selectAll("path")
        .data(geojson.features)
        .enter()
        .append("svg:path")
        .attr("d", path)
        .attr("fill", "#99ff99")
        .attr("fill-opacity", 1)
        .attr("stroke", "black");
    
}
 
function drawVoronoi(geojson){
    const pointdata = geojson.features;
    const positions = [];
    
    pointdata.forEach(d => {
        positions.push(projection(d.geometry.coordinates)); //位置情報をピクセル座標に変換する
    });
    
    //母点表示
    voronoiLayer.selectAll(".point")
        .data(positions)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("transform", d =>  `translate(${d[0]}, ${d[1]})` )
        .attr("r", 2);
    
    
    //ボロノイ変換関数
    const voronoi = d3.voronoi()
        .extent([[-1, -1],[width+1, height+1]]);
    
    //ボロノイ境界ポリゴンデータを生成する
    const polygons = voronoi(positions).polygons();
    
    //境界表示
    voronoiLayer.selectAll(".cell")
        .data(polygons)
        .enter()
        .append("path")
        .attr("class", "cell")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("d", d => `M${d.join("L")}Z` );
        
    
}
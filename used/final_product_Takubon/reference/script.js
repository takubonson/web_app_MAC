d3.json("example.json").then(function(data){
    d3.select("body").append("div")

    

    var height = 500;
    var width = 500;

    var svg = d3.select("body")
                .append("svg")
                .attr("height", height)
                .attr("width", width);
                // like a canvas
    var test_button = svg.append("circle")
                .attr("cx", 300)
                .attr("cy", 300)
                .attr("r", 100)
                .attr("fill", "green")
                .on("click", function(e, d){
                    d3.select(".modal-title").text("Sony")
                    d3.select(".modal-body").html(function(){
                        return "<p>従業員数: xxx</p><p>資本金: xxx</p>"
                    })
                })
                .attr("class", "btn btn-block btn-primary")
                .attr("data-toggle", "modal")
                .attr("data-target", "#myModal")
})


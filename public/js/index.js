function createChart()
{
    var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
    var parseTime = d3.timeParse("%d-%b-%y");
    
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    
    var valueline = d3.line()
    .x(d => { return x(d.date); })
    .y(d => { return y(d.infections); });
    
    var svg = d3.select("#charts").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    
    d3.csv("/data/infections.csv").then(data => {
    
    data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.infections = +d.infections;
    });
    
    x.domain(d3.extent(data, d => { return d.date; }));
    y.domain(d3.extent(data, d => {return d.infections }));
    
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    svg.append("g")
      .call(d3.axisLeft(y));
    
    });
}

function deleteChart()
{
    $("#charts").html("");
}

 $.ajax({
    url: '/dataCountry/',
    type: 'POST',
    data: {},
    success: data => {
        let countries = data.split(", ");
        let string = "";
        for(let i = 0; i < countries.length; ++i)
        {
            let country = countries[i];
            string += "<option " + (country == "France" ? 'selected' : '') + " value='" + country + "'>" + country + "</option>";
        }
        $("#countries").html(string);
    }
 });

 $("#countries").on("change", () => {
    let country = $("#countries").val();
    newChart(country);
 })

 function newChart(country)
 {
    $.ajax({
        url: '/dataInfect/',
        type: 'POST',
        data: {'country': country},
        success: data => {
            deleteChart();
            createChart();
            $('#chart-country').html(country)
        }
     });
 }

 newChart('France');
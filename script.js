const svgEl = document.getElementById('chart')
const width = svgEl.getAttribute('width')
const height = svgEl.getAttribute('height')
const padding = 32
const hpadding = 98
const vpadding = 50
const Radius = 1.25;
var svg = d3.select('#chart')
var infetti_color = '#123F99'//'#1440C4'
var infetti_color_testo = "#11E1FF" //575F34
var morti_color = "#990808"
var morti_color_testo = "#dfe302"
var ticks = 10;
var modalita=  0;
var div = d3.select('#paesi')


function shadeColor(color, percent) {

	var R = parseInt(color.substring(1,3),16);
	var G = parseInt(color.substring(3,5),16);
	var B = parseInt(color.substring(5,7),16);

	R = parseInt(R * (100 + percent) / 100);
	G = parseInt(G * (100 + percent) / 100);
	B = parseInt(B * (100 + percent) / 100);

	R = (R<255)?R:255;  
	G = (G<255)?G:255;  
	B = (B<255)?B:255;  

	var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
	var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
	var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

	return "#"+RR+GG+BB;
}


// in dataset.js you see that the data is in comma separated values format. 
// this is a way to decode it by also expliciting the types, so that the d3 dataset is correctly made

var parseTime = d3.timeParse("%Y-%m-%d");
const lista_paesi = d3.csvParse(totale, d => {
	return {
		country : d.country,
		cases : +d.cases,
		deaths : +d.deaths
	}
})

function lista_div(){
	div.append("h4").html("The 10 countries with the most cases:")
div.selectAll("p.numero")
.data(lista_paesi)
.enter()
.append("p")
.attr("class", "numero")
.html((d, i)=> "N." + (i+1) + " " + d.country + " - " +"Cases: "+  d.cases+ "<br>")
div.append("div")
.attr("class", "spazio").html("<br>")
}


function pulisci(){
	div.selectAll("p.numero").remove()
	div.selectAll("h4").remove()
	div.selectAll("div.spazio").remove()
}

function lista_div_giorno(statistica, dati){
	if(statistica== "casi"){
		div.append("h4").html("Cases:")
		div.selectAll("p.numero")
.data(dati)
.enter()
.append("p")
.attr("class", "numero")
.html((d, i)=> "N." + (i+1) + " " + d.country + " - " +"Cases: "+  d.cases+ "<br>")
div.append("div")
.attr("class", "spazio").html("<br>")
}
else{
	div.append("h4").html("Deaths:"+ "<br>")
	div.selectAll("p.numero")
	.data(dati)
	.enter()
	.append("p")
	.attr("class", "numero")
	.html((d, i)=> "N." + (i+1) + " " + d.country + " - " +"Deaths: "+  d.deaths+ "<br>")
	div.append("div")
	.attr("class", "spazio").html("<br>")
	
}
}

function lista_div_mese(statistica, dati){
	
	if(statistica== "casi"){
		div.append("h4").html("Cases:"+ "<br>")
		div.selectAll("p.numero")
.data(dati)
.enter()
.append("p")
.attr("class", "numero")
.html((d, i)=> "N." + (i+1) + " " + d.country + " - " +"Cases: "+  d.cases+ "<br>")
div.append("div")
.attr("class", "spazio").html("<br>")
}
else{
	div.append("h4").html("Deaths:"+ "<br>")
	div.selectAll("p.numero")
	.data(dati)
	.enter()
	.append("p")
	.attr("class", "numero")
	.html((d, i)=> "N." + (i+1) + " " + d.country + " - " +"Deaths: "+  d.deaths+ "<br>")
	div.append("div")
	.attr("class", "spazio").html("<br>")
}

}
const generale_dataset = d3.csvParse(generale, d => {
	return {
		month : d.month,
		cases : +d.cases,
		deaths : +d.deaths
	}
})


const paesi_dataset = d3.csvParse(paesi, d => {
	return {
		month : d.month,
		country: d.country,
		cases : +d.cases,
		deaths : +d.deaths
	}
})

const paesi_dataset_deaths = d3.csvParse(paesi_deaths, d => {
	return {
		month : d.month,
		country: d.country,
		cases : +d.cases,
		deaths : +d.deaths
	}
})

const generale_dataset_giorno = d3.csvParse(generale_giorno, d => {
	return {
		date : d.date,
		cases : +d.cases,
		deaths : +d.deaths
	}
})

const paesi_dataset_giorno= d3.csvParse(paesi_giorno, d => {
	return {
		date : d.date,
		country: d.country,
		cases : +d.cases,
		deaths : +d.deaths
	}
})

const paesi_dataset_deaths_giorno = d3.csvParse(paesi_deaths_giorno, d => {
	return {
		date : d.date,
		country: d.country,
		cases : +d.cases,
		deaths : +d.deaths
	}
})


const tooltip = d3.select("body")
	.append("div")
	.attr("class","d3-tooltip")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.style("padding", "15px")
	.style("background", "rgba(0,0,0,0.8)")
	.style("border-radius", "5px")
	.style("color", "#fff")
	.text("");




function giorni(){

	var xScale = d3.scaleTime()
	.domain([parseTime("2020-01-01"), parseTime("2021-01-01")])
	.range([hpadding,width-hpadding]);

	svg.append("g").attr('transform', `translate(${0}, ${height- vpadding})`).call(d3.axisBottom(xScale));
	const yScale=d3.scaleLinear()
	.domain([0,d3.max(generale_dataset_giorno, d=>{return d.cases})])
	.range([height-vpadding,vpadding])

const yScale2=d3.scaleLinear()
	.domain([0,d3.max(generale_dataset_giorno, d=>{return d.deaths})])
	.range([height-vpadding,vpadding])

const yAxis=d3.axisLeft(yScale)
.tickFormat(d => `${d3.format(".1s")(d).replace(/0/, "0M").replace(/10MM/, "10M")}`)
.ticks(ticks)

const yAxis2=d3.axisRight(yScale2)
.tickFormat(d => `${d3.format(".2s")(d).replace(/0.0/, "0k")}`)
.ticks(ticks)

const yTicks = svg
	.append('g')
	.attr('transform', `translate(${hpadding}, 0)`)
	.call(yAxis);

const yTicks2 = svg
	.append('g')
	.attr('transform', `translate(${width- hpadding}, 0)`)
	.call(yAxis2)

svg.append("g")
	.attr("transform", "translate(" + (hpadding- 50) + "," + (yScale(d3.max(generale_dataset_giorno, d=>{return d.cases}))- 10) + ")")
	.append("path")
	 .attr("d", "M 50,0 55,12 45,12 z")

svg.append("g")
	.attr("transform", "translate(" + (width- hpadding - 50) + "," +  (yScale2(d3.max(generale_dataset_giorno, d=>{return d.deaths}))- 10)+ ")")
	.append("path")
	.attr("d", "M 50,0 55,12 45,12 z")

svg.append("path")
		.datum(generale_dataset_giorno)
		.attr("fill", "none")
		.attr("stroke", infetti_color)
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
		  .x(function(d) { return xScale(parseTime(d.date)) })
		  .y(function(d) { return yScale(d.cases) })
		  )
		  
		svg.append("g")
		.selectAll("dot")
		.data(generale_dataset_giorno)
		.enter()
		.append("circle")
		  .attr("cx", function(d) { return xScale(parseTime(d.date)) } )
		  .attr("cy", function(d) { return yScale(d.cases)} )
		  .attr("r", Radius)
		  .attr("fill", infetti_color)
		  .on("mouseover", function(d, i) {
			tooltip.html(`Day: ${d["target"].__data__["date"]}<br>
			<span style="color:${infetti_color_testo}"> Cases: ${(d["target"].__data__["cases"]/1000000).toFixed(1)}M</span>
			
			<br>`+lista_casi(d["target"].__data__["date"])).style("visibility", "visible");
			
				
		   pulisci()
		   let giorno = d["target"].__data__["date"]

		   lista_div_giorno("casi", paesi_dataset_giorno.filter( d=> d.date == giorno).sort((a, b) => d3.descending(a.cases, b.cases)) )



		  })
		  .on("mousemove", function(){
			tooltip
			  .style("top", (event.pageY-10)+"px")
			  .style("left",(event.pageX+10)+"px");
			  
	  		
		
		  })
		  .on("mouseout", function() {
			tooltip.html(``).style("visibility", "hidden");
			
			pulisci()
			lista_div()
		  });
//-------------
svg.append("path")
		.datum(generale_dataset_giorno)
		.attr("fill", "none")
		.attr("stroke", morti_color)
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
		  .x(function(d) { return xScale(parseTime(d.date)) })
		  .y(function(d) { return yScale2(d.deaths) })
		  )
		  
		svg.append("g")
		.selectAll("dot")
		.data(generale_dataset_giorno)
		.enter()
		.append("circle")
		  .attr("cx", function(d) { return xScale(parseTime(d.date)) } )
		  .attr("cy", function(d) { return yScale2(d.deaths)} )
		  .attr("r", Radius)
		  .attr("fill", morti_color)
		  .on("mouseover", function(d, i) {
			tooltip.html(`Day: ${d["target"].__data__["date"]}<br>
			<span style="color:${morti_color_testo}"> Deaths: ${(d["target"].__data__["deaths"]/1000).toFixed(1)}k</span>
			<br>`+lista_morti(d["target"].__data__["date"])).style("visibility", "visible");
				pulisci()
				let giorno = d["target"].__data__["date"];
				lista_div_giorno("morti",paesi_dataset_deaths_giorno.filter( d=> d.date == giorno).sort((a, b) => d3.descending(a.deaths, b.deaths))) 

		  })
		  .on("mousemove", function(){
			tooltip
			  .style("top", (event.pageY-10)+"px")
			  .style("left",(event.pageX+10)+"px");
			  
	  	
		  })
		  .on("mouseout", function() {
			tooltip.html(``).style("visibility", "hidden");
			pulisci()
			lista_div()
		  });
  
		


function lista_casi(giorno){

	
	let paesi = paesi_dataset_giorno.filter( function check(d){  
		return d.date == giorno});
	stringa = ""
	
	for (let index = 0; index < 3; index++) {
		stringa+= (index+1) + ". " + paesi[index].country +  ": " +  `<span style= "color: ${infetti_color_testo};">`+  (paesi[index].cases/1000).toFixed(1)+"k"
		+ "</span> <br>";
		
	}
	return stringa;
}

function lista_morti(giorno){

	let paesi = paesi_dataset_deaths_giorno.filter( d=> d.date == giorno);
	stringa = ""
	
	for (let index = 0; index < 3; index++) {
		stringa+= (index+1) + ". " + paesi[index].country + ": " + `<span style= "color: ${morti_color_testo};">` + paesi[index].deaths
		+ "</span> <br>";
		
	}
	return stringa;
}

svg.append("g")
	.attr("transform", "translate(" + (width-50) + "," + ((hpadding/5)+10) + ")")
	.append("text")
	.attr("font-size", "12px").text("Deaths")

svg.append("g")
	.attr("transform", "translate(" + (width-50)  + "," + ((hpadding/5)-6) + ")")
	.append("text")
	.attr("font-size", "12px").text("Cases")

	svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width -65) + "," + ((hpadding/5)-15) + ")")
	.attr("width", "12")
	.attr("height", "12")
	.attr("fill", `${infetti_color}`)

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width -65) + "," + ((hpadding/5)) + ")")

	.attr("width", "12")
	.attr("height", "12")
	.attr("fill", `${morti_color}`)


svg.append("g")
	.attr("transform", "translate(" + `${(width-hpadding-"popolazione tot".length*12)}` + "," + (15)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Population 2021-01-01: "+ "446.8M" )


svg.append("g")
	.attr("transform", "translate(" + `${(hpadding)}` + "," + (15)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Population 2020-01-01: "+ "447M" )

svg.append("g")

	.attr("transform", "translate(" + `${hpadding-50}` + "," + (height/2)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Cases")
	.attr("transform", "rotate(-90)")

svg.append("g")
	.attr("transform", "translate(" + `${width-50}` + "," + (height/2)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Deaths")
	.attr("transform", "rotate(-90)")

	svg.append("g")
	.attr("transform", "translate(" + `${width/2}` + "," + (height-10)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Time")

	
}
function mesi(){

const xScale=d3.scalePoint()
	.domain(['2020', 'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December' ,'2021'])
	.range([hpadding,width-hpadding])



const yScale=d3.scaleLinear()
	.domain([0,d3.max(generale_dataset, d=>{return d.cases})])
	.range([height-vpadding,vpadding])

const yScale2=d3.scaleLinear()
	.domain([0,d3.max(generale_dataset, d=>{return d.deaths})])
	.range([height-vpadding,vpadding])

const yAxis=d3.axisLeft(yScale)
.tickFormat(d => `${d3.format(".2s")(d).replace(/500k/, "0.5M").replace(/0.0/, "0M")}`)
.ticks(ticks)

const yAxis2=d3.axisRight(yScale2)
.tickFormat(d => `${d3.format(".2s")(d).replace(/0.0/, "0k").replace(/5.0k/, "5k")}`)
.ticks(ticks)
	
svg
.append("g")
.attr('transform', `translate(${0}, ${height- vpadding})`)     // This controls the vertical position of the Axis
.call(d3.axisBottom(xScale));

	


const yTicks = svg
	.append('g')
	.attr('transform', `translate(${hpadding}, 0)`)
	.call(yAxis);

const yTicks2 = svg
	.append('g')
	.attr('transform', `translate(${width- hpadding}, 0)`)
	.call(yAxis2)

svg.append("g")
	.attr("transform", "translate(" + (hpadding- 50) + "," + (yScale(d3.max(generale_dataset, d=>{return d.cases}))- 10) + ")")
	.append("path")
	 .attr("d", "M 50,0 55,12 45,12 z")

svg.append("g")
	.attr("transform", "translate(" + (width- hpadding - 50) + "," +  (yScale2(d3.max(generale_dataset, d=>{return d.deaths}))- 10)+ ")")
	.append("path")
	 .attr("d", "M 50,0 55,12 45,12 z")



const cases = svg.selectAll('rect.cases')
.data(generale_dataset).enter()
.append("rect")
.attr('class', 'cases')
.attr("fill", infetti_color)
.attr("width", 20)
.attr("height", (d,i) => height -vpadding - yScale(d.cases)) //d=> yScale(d.cases))
.attr("x", d=> xScale(d.month)-20)
.attr("y", d => yScale(d.cases))
.on("mouseover", function(d, i) {
	tooltip.html(`Month: ${d["target"].__data__["month"]} 2020<br>
	<span style="color:${infetti_color_testo}"> Cases: ${(d["target"].__data__["cases"]/1000000).toFixed(1)}M</span><br>`+

	lista_casi(d["target"].__data__["month"])
	
	).style("visibility", "visible");
	
		d3.select(this)
            .attr("fill", shadeColor(infetti_color, -15));
			pulisci()
			let m = d["target"].__data__["month"]
			lista_div_mese("casi",paesi_dataset_deaths.filter( d=> d.month == m).sort((a, b) => d3.descending(a.cases, b.cases)) )

  })
  .on("mousemove", function(){
	tooltip
	  .style("top", (event.pageY-10)+"px")
	  .style("left",(event.pageX+10)+"px");

	 
  })
  .on("mouseout", function() {
	tooltip.html(``).style("visibility", "hidden");
	
	d3.select(this).attr("fill", infetti_color);
	pulisci()

	lista_div()

  });

const deaths = svg.selectAll('rect.deaths')
.data(generale_dataset).enter()
.append("rect")
.attr('class', 'deaths')
.attr("fill", morti_color)
.attr("width", 20)
.attr("height", (d,i) => height -vpadding - yScale2(d.deaths)) 
.attr("x", d=> xScale(d.month))
.attr("y", d => yScale2(d.deaths))
.on("mouseover", function(d, i) {
	tooltip.html(`Month: ${d["target"].__data__["month"]} 2020<br> 
	<span style="color:${morti_color_testo};">Deaths : ${(d["target"].__data__["deaths"]/1000).toFixed(1)}k</span><br>
	
	`+ lista_morti(d["target"].__data__["month"])).style("visibility", "visible")

	   d3.select(this)
            .attr("fill", shadeColor(morti_color, -20));
	pulisci()
	let m = d["target"].__data__["month"]
	lista_div_mese("morti",paesi_dataset_deaths.filter( d=> d.month ==m ).sort((a, b) => d3.descending(a.deaths, b.deaths)))
	   
  })
 
  .on("mousemove", function(){
	tooltip
	  .style("top", (event.pageY-10)+"px")
	  .style("left",(event.pageX+10)+"px");
	
  })
  .on("mouseout", function() {
	tooltip.html(``).style("visibility", "hidden");
	
	d3.select(this).attr("fill", morti_color);
	pulisci()

	lista_div()
  });


svg.append("g")
	.attr("transform", "translate(" + `${(hpadding)}` + "," + (15)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Population 2020-01-01: "+ "447M" )

svg.append("g")
	.attr("transform", "translate(" + `${(width-hpadding-"popolazione tot".length*12)}` + "," + (15)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Population 2021-01-01: "+ "446.8M" )



svg.append("g")

	.attr("transform", "translate(" + `${hpadding-50}` + "," + (height/2)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Cases")
	.attr("transform", "rotate(-90)")

svg.append("g")
	.attr("transform", "translate(" + `${width-50}` + "," + (height/2)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Deaths")
	.attr("transform", "rotate(-90)")

	svg.append("g")
	.attr("transform", "translate(" + `${width/2}` + "," + (height-10)+ ")")
	.append("text")
	.attr("font-size", "12px").text("Time")


function lista_casi(mese){
	let paesi = paesi_dataset.filter( d=> d.month == mese);
	stringa = ""
	
	for (let index = 0; index < 3; index++) {
		stringa+= (index+1) + ". " + paesi[index].country +  ": " +  `<span style= "color: ${infetti_color_testo};">`+ (paesi[index].cases/1000).toFixed(1)+"k"
		+ "</span> <br>";
		
	}
	return stringa;
}

function lista_morti(mese){
	let paesi = paesi_dataset_deaths.filter( d=> d.month == mese);
	stringa = ""
	
	for (let index = 0; index < 3; index++) {
		stringa+= (index+1) + ". " + paesi[index].country + ": " + `<span style= "color: ${morti_color_testo};">` +(paesi[index].deaths/1000).toFixed(1)+"k"
		+ "</span> <br>";
		
	}
	return stringa;
}
svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width -65) + "," + ((hpadding/5)-15) + ")")
	.attr("width", "12")
	.attr("height", "12")
	.attr("fill", `${infetti_color}`)

svg.append("g")
	.append("rect")
	.attr("transform", "translate(" + (width -65) + "," + ((hpadding/5)) + ")")

	.attr("width", "12")
	.attr("height", "12")
	.attr("fill", `${morti_color}`)

svg.append("g")
	.attr("transform", "translate(" + (width-50) + "," + ((hpadding/5)+10) + ")")
	.append("text")
	.attr("font-size", "12px").text("Deaths")

svg.append("g")
	.attr("transform", "translate(" + (width-50)  + "," + ((hpadding/5)-6) + ")")
	.append("text")
	.attr("font-size", "12px").text("Cases")}


	
if(modalita==0){
	mesi()
}
else{

	giorni()
}

function change_mode(){
	console.log(modalita)
	if(modalita==0){
		d3.select("#bottone").html("Cumulative")
		modalita = 1
		svg.selectAll("g").remove()
		svg.selectAll("rect").remove()
		pulisci()
		lista_div()
		giorni()
		svg.select("#tip").style("visibility", "hidden");

		

	}
	else{
		
		modalita= 0
		svg.selectAll("g").remove()
		svg.selectAll("circle").remove()
		svg.selectAll("path").remove()
		pulisci()
		d3.select("#bottone").html("Monthly")
		lista_div()
		mesi()
		
	}

}

lista_div()
svg.append("text").attr("transform", "translate(" + ((width/2)) + "," + (vpadding-20) + ")")
.append("a")
.attr("id", "bottone")
.attr("onclick", "change_mode()")
.attr("cursor", "pointer")
.attr("font-size", "15px")
.html("Monthly")


svg.append("text").attr("transform", "translate(" + ((width/2)+60) + "," + (vpadding-20) + ")")
.attr("id", "tip").append("a")
.attr("onclick", "change_mode()")
.attr("cursor", "pointer")
.attr("font-size", "12px")
.html("(Click to change mode)")


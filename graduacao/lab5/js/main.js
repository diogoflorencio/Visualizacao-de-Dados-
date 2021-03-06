function main(){
var
		    width = 1000,
		    height = 500;
		var svg = d3.select("#chart")
				.append("svg")
				.attr('version', '1.1')
				.attr('viewBox', '0 0 '+width+' '+height)
				.attr('width', '100%');
		var color = d3.scaleOrdinal(d3.schemeCategory20);
		var simulation = d3.forceSimulation()
		    .force("link", d3.forceLink().id(function(d) { return d.id; }))
		    .force("charge", d3.forceManyBody())
		    .force("center", d3.forceCenter(width / 2, height / 2));
		//d3.json("http://analytics.lsd.ufcg.edu.br/pre/ciencia_da_computacao_d_cg/disciplinas", function(error, apiresponse) {
		//d3.json("http://analytics.lsd.ufcg.edu.br/pre/design_d_cg/disciplinas", function(error, apiresponse) {
		d3.json("data/engenharia_eletrica_cg.json", function(error, apiresponse) {
		  if (error) throw error;
			var links = [];
			apiresponse.forEach(function(d){
				d.pre_requisitos.forEach(function(p){
					links.push({source: String(d.codigo_disciplina), target: String(p)});
				});
			})
			var nodes = apiresponse.map(function(d){
				return {id: String(d.codigo_disciplina),
								codigo_departamento : d.codigo_departamento,
								nome : d.disciplina};
			});
			console.dir(links);
			console.dir(nodes);
		  var link = svg.append("g")
		      .attr("class", "link")
		    .selectAll("line")
		    	.data(links)
		    .enter().append("line");
		  var node = svg.append("g")
		      .attr("class", "nodes")
		    .selectAll("circle")
		    	.data(nodes)
		    .enter().append("circle")
		      .attr("r", 5)
		      .attr("fill", function(d) { return color(d.codigo_departamento); })
		      .call(d3.drag()
		          .on("start", dragstarted)
		          .on("drag", dragged)
		          .on("end", dragended));
		  node.append("title")
		      .text(function(d) { return d.nome; });
		  simulation
		      .nodes(nodes)
		      .on("tick", ticked);
		  simulation.force("link")
		      .links(links);
		  function ticked() {
		    link
		        .attr("x1", function(d) { return d.source.x; })
		        .attr("y1", function(d) { return d.source.y; })
		        .attr("x2", function(d) { return d.target.x; })
		        .attr("y2", function(d) { return d.target.y; });
		    node
		        .attr("cx", function(d) { return d.x; })
		        .attr("cy", function(d) { return d.y; });
		  }
		});
		function dragstarted(d) {
		  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		  d.fx = d.x;
		  d.fy = d.y;
		}
		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}
		function dragended(d) {
		  if (!d3.event.active) simulation.alphaTarget(0);
		  d.fx = null;
		  d.fy = null;
		}

}

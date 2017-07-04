const coresAtividades=['darkblue','lightgreen','lightblue','darkgreen','darkorange','lightpurple',
						'darkred','lightorange','darkpurple','lightred','darkgold','lightgold'];
const corSobreposicao="sobreposicao";

function exibirTimeline(d){
const element = document.getElementById('timelineGraf');
var inicioAtv;
var fimAtv;
var filhos = [];
getLeafs(d,filhos);
var timelineGraf = d3.select(element);
var atividades = getActivitiesName(d);
var prazos = getActivitiesPrazos(d,filhos);
var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			console.log(d);
		return "<strong> Teste:</strong> <span style='color:red'> Testando </span>";
	});

timelineGraf.style("height", (filhos.length*35 + 70) + "px");
var data = [];

var previsoes=[];
for(var i = 0; i < atividades.length; i++){
	previsoes.push({label: atividades[i],
					type: TimelineChart.TYPE.INTERVAL,
					from: converteData(prazos[i].inicio),
					to: makeDataWithTime(prazos[i].fim),
					customClass: coresAtividades[(i)%coresAtividades.length]});
}
data.push({label: "Planejamento",
			data: previsoes});
data.push({label: "",
			data: []});

var fimAtvAnterior;
var inicioAtvAtual;
var limiteAtvAtual;
var fimAtvAtual;
var inicioProxAtv;

for(var i = 0; i < filhos.length; i++){
	var entregas=[];
	for(var j = 1; j < d.depth; j++){
		
		if(fimAtvAnterior){
			inicioAtvAtual = fimAtvAnterior;
			fimAtvAnterior = undefined;
		}
		else{
			inicioAtvAtual = converteData(filhos[i]["Data Inicio "+j]);
		}
		
		limiteAtvAtual = filhos[i]["Data Fim "+(j)];
		fimAtvAtual = limiteAtvAtual;
		inicioProxAtv = converteData(filhos[i]["Data Inicio "+(j+1)]);
		
		if(j < d.depth-1 && inicioProxAtv <= converteData(fimAtvAtual)){
			fimAtvAnterior = makeDataWithTime(limiteAtvAtual);
			limiteAtvAtual = filhos[i]["Data Inicio "+(j+1)];
			
			entregas.push({label: atividades[j-1],
						type: TimelineChart.TYPE.INTERVAL,
						from: inicioAtvAtual,
						to: converteData(limiteAtvAtual),
						customClass: coresAtividades[(j-1)%coresAtividades.length]});
						
			entregas.push({label: 'Paralelo',
						type: TimelineChart.TYPE.INTERVAL,
						from: converteData(limiteAtvAtual),
						to: makeDataWithTime(fimAtvAtual),
						customClass: corSobreposicao});
		}
		else{
			entregas.push({label: atividades[j-1],
						type: TimelineChart.TYPE.INTERVAL,
						from: inicioAtvAtual,
						to: makeDataWithTime(fimAtvAtual),
						customClass: coresAtividades[(j-1)%coresAtividades.length]});
		}
	}
	data.push({label: filhos[i]["Level18"],
				data: entregas});
}

        const timeline = new TimelineChart(element, data, {
            enableLiveTimer: true,
            tip: function(d) {
                return d.at || `${d.from}<br>${d.to}`;
            }
        }).onVizChange(e => console.log(e));
        
        var svg = timelineGraf.select("svg");
        svg.call(tip);
        svg.selectAll("."+corSobreposicao)
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide);
}

function getActivitiesName(d){
	var array = [];
	const depth = d.depth-2;
	for(var i = 0; i <= depth; i++){
		array[depth - i] = d.key;
		d = d.parent;
	}
	return array;
}

function getActivitiesPrazos(d,filhos){
	var prazos=[];
	for(var i = 0; i < filhos.length; i++){
		if(filhos[i]["Data Fim "+d.depth]){
			for(var j=1; j < d.depth; j++){
				prazos.push({inicio: filhos[i]["Data Inicio "+j],
							fim: filhos[i]["Data Fim "+j]});
			}
			break;
		}
	}
	return prazos;
}

function makeDataWithTime(data){
	return new Date(Number(data.slice(6,10)), Number(data.slice(3,5)), Number(data.slice(0,2)),23,59,59,0);
}

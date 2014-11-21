function index(req, res) {
	var parseString = require('xml2json'); //xml to JSON parser
	var fs = require('fs'); //file handling module
	var base64data = "";
	var originaldata = "";
	
	req.on('data', function (data) {
		
		base64data = new Buffer(data, 'binary').toString('base64');
		originaldata += new Buffer(base64data, 'base64');
		
		if(originaldata.indexOf("</nodes>")!= -1){ //to check for full and valid XML
			originaldata = parseString.toJson(originaldata);
			var data = JSON.parse(originaldata);
			var actual_JSON = data['nodes'];
		    var chartJson = [];
		    var i = 0;
		    for(var parentNode in actual_JSON){
		        chartJson[i] = {
		                "id":'m-'+actual_JSON[parentNode]["cmdbId"],
		                "name" : actual_JSON[parentNode]['name'],
		                "loaded":true,
		                "linkId" : actual_JSON[parentNode]['id']};
		        i++;
		        for(var p1 in actual_JSON[parentNode]){
		            if(p1 == 'children'){
		                for(var p2 in actual_JSON[parentNode][p1]){
		                    for(var p3 in actual_JSON[parentNode][p1][p2]){
		                        var dimensionArray = new Array();
		                        dimensionArray=actual_JSON[parentNode][p1][p2][p3]['dimension'];
		                        chartJson[i] = {
		                                "id":'m-'+actual_JSON[parentNode][p1][p2][p3]['cmdbId'],
		                                "name" : actual_JSON[parentNode][p1][p2][p3]['name'],
		                                "loaded":true,
		                                "linkId" : actual_JSON[parentNode][p1][p2][p3]['id'],
		                                "dimension":dimensionArray
		                        };
		                        i++;
		                        for(var p4 in actual_JSON[parentNode][p1][p2][p3]){
		                            if(p4=='children'){
		                                for(var p5 in actual_JSON[parentNode][p1][p2][p3][p4]){
		                                    for(var p6 in actual_JSON[parentNode][p1][p2][p3][p4][p5]){
												var dimensionArray = new Array();
													dimensionArray=actual_JSON[parentNode][p1][p2][p3][p4][p5][p6]['dimension'];
													chartJson[i] = {
															"id":'m-'+actual_JSON[parentNode][p1][p2][p3][p4][p5][p6]['cmdbId'],
															"name" : actual_JSON[parentNode][p1][p2][p3][p4][p5][p6]['name'],
															"loaded":true,
															"linkId" : actual_JSON[parentNode][p1][p2][p3][p4][p5][p6]['id'],
															"dimension":dimensionArray
													};
													i++;
		                                        for (var p7 in actual_JSON[parentNode][p1][p2][p3][p4][p5][p6]){
		                                            if(p7=='children'){
		                                                for(var p8 in actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7]){
		                                                    if(Array.isArray(actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8])){
		                                                        for(var p9 in actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8]){
		                                                            var dimensionArray = new Array();
		                                                            dimensionArray=actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8][p9]['dimension'];
		                                                            chartJson[i] = {
		                                                                    "id":'m-'+actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8][p9]['cmdbId'],
		                                                                    "name" : actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8][p9]['name'],
		                                                                    "loaded":true,
		                                                                    "linkId" : actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8][p9]['id'],
		                                                                    "dimension":dimensionArray
		                                                            };
		                                                            i++;
		                                                        }
		                                                    }else{
		                                                        var dimensionArray = new Array();
		                                                        dimensionArray=actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8]['dimension'];
		                                                        chartJson[i] = {
		                                                                "id":'m-'+actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8]['cmdbId'],
		                                                                "name" : actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8]['name'],
		                                                                "loaded":true,
		                                                                "linkId": actual_JSON[parentNode][p1][p2][p3][p4][p5][p6][p7][p8]['id'],
		                                                                "dimension":dimensionArray
		                                                        };
		                                                        i++;
		                                                    }
		                                                }
		                                            }
		                                        }
		                                    }
		                                }
		                            }   
		                        }
		                    }
		                }
		            }
		        }
		    }
			fs.writeFile("./data-nodes.json", JSON.stringify(chartJson, null, 4), function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("The file was saved!");
					res.writeHead(200);
    				res.end();
				}
			});
		}
	});
}

function getNodes(req, res){
	
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
    res.header('Access-Control-Allow-Credentials', 'true');
    
	var fs = require('fs'); //file handling module
	var responseJSON ={};
	fs.readFile('./data-nodes.json', 'utf8', function (err, data) {
		if (err) {
			res.setHeader('Content-Type', 'application/json');
			res.send( "Not found", 404 );
			res.end();
		}else{
			if(data){
				responseJSON = JSON.parse(data);
				res.setHeader('Content-Type', 'application/json');
				res.send(responseJSON);
				res.end();
			}else{
				res.setHeader('Content-Type', 'application/json');
				res.json({'err':'fail'});
				res.end();
  			}
		}
	});
}

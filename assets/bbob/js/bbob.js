/* Url to the plots */
plotPath = "https://raw.githubusercontent.com/numbbo/bbob-plots/main/bbob/"

/* Define some global variables */
var labelsTyp = ["Search space cuts: lin-lin", "Search space cuts: lin-log", "Search space cuts: log-log", "Function value heatmap", "Normalized rank heatmap", "Surface plot"];
var valuesTyp = ["cuts-lin-lin", "cuts-lin-log", "cuts-log-log", "heatmap", "heatmap-rank", "surface"];
var allNodes = ["dimAll", "funAll", "insAll", "typAll"];
var selectedNode = "typAll";
var valuesDim = ["2", "3", "5", "10", "20", "40"];
var valuesFun = [];
for (let i = 1; i <= 24; i++) {valuesFun.push(i);}
var valuesIns = [];
for (let i = 1; i <= 15; i++) {valuesIns.push(i);}
var valuesCol = [];
for (let i = 1; i <= 10; i++) {valuesCol.push(i);}
var params = ["col", "dim", "fun", "ins", "typ"];

/* Fill the table with values from the URL parameters. If any are missing, use the defaults (all plot types are shown,
   there are five plots per row, the first option is chosen for all other select elements) */
window.onload=function() {
    /* Fill the dropdowns with values */
    fill_options("col", valuesCol, valuesCol, "3");
    fill_options("dim", valuesDim, valuesDim, "2");
    fill_options("fun", valuesFun, valuesFun, "1");
    fill_options("ins", valuesIns, valuesIns, "1");
    fill_options("typ", valuesTyp, labelsTyp, "cuts-lin-lin");

    for (var i = 0; i < params.length; i++) {
        var value = getParam(params[i]);
        if (value == "all") {
            selectedNode = params[i] + "All";
        }
    }
    selectNode(document.getElementById(selectedNode));

    /* Hide all groups */
	for (let i = 1; i <= 5; i++) {
		textName = "text-g" + i;
		document.getElementById(textName).setAttribute("style", "display:none;");
	}
}

/* Create a string with all options according to the given subject, values, labels and default value */
function fill_options(name, values, labels, default_value) {
    var contents = "";
    var value = getParam(name);
    if ((!value) || (value === "all")) {
        value = default_value;
    }
    for (let i = 0; i < values.length; i++) {
        contents += "<option value=\"" + values[i] + "\">" + labels[i] + "</option>";
    }
    document.getElementById(name).innerHTML = contents;
    document.getElementById(name).value = value;
}

/* Display number with leading zero */
function pad(num, type) {
	let size = 2;
	if (type == 1) {
		size = 3;
	};
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

/* Adds the plot to the div */
function addPlot(plotName) {
	let plotWidth = 100 / col.value;
	var elemDiv = document.createElement('div');
	var elemA = document.createElement('a');
	var elemImg = document.createElement("img");
	elemDiv.setAttribute("style", "display:inline-block; width:" + plotWidth + "%;");
	elemA.setAttribute("href", plotPath + plotName);
	elemImg.setAttribute("src", plotPath + plotName);
	elemImg.setAttribute("alt", "");
	elemImg.setAttribute("style", "width:100%;");
	elemA.appendChild(elemImg);
	elemDiv.appendChild(elemA);
	document.getElementById("images").appendChild(elemDiv);
}

/* Show the plots wrt the chosen dimension, function, instance and plot type.
Exactly one of these categories contains all possible values, the rest only the
chosen one. */
function changePlot() {
	let plotName;
	let chosenDim = [dim.value];
	let chosenFun = [fun.value];
	let chosenIns = [ins.value];
	let chosenTyp = [typ.value];
	let textName;
	if (selectedNode === "dimAll") {
		chosenDim = [...valuesDim];
	} else if (selectedNode === "funAll") {
		chosenFun = [...valuesFun];
	} else if (selectedNode === "insAll") {
		chosenIns = [...valuesIns];
	} else if (selectedNode === "typAll") {
		chosenTyp = [...valuesTyp];
	}
	document.getElementById("images").innerHTML = "";
    // document.getElementById("result").value = "";
	for (let iDim = 0; iDim < chosenDim.length; iDim++) {
		for (let iFun = 0; iFun < chosenFun.length; iFun++) {
			for (let iIns = 0; iIns < chosenIns.length; iIns++) {
				for (let iTyp = 0; iTyp < chosenTyp.length; iTyp++) {
					plotName = chosenTyp[iTyp] + "-500/bbob_f" + pad(chosenFun[iFun], 1) + "_i" + pad(chosenIns[iIns], 0) + "_d" + pad(chosenDim[iDim], 0) + "_" + pad(chosenTyp[iTyp], 0) + ".png";
					addPlot(plotName);
					// document.getElementById("result").value += plotName + "\n";
				}
			}
		}
	}
	/* Make sure only the correct plot descriptions are shown */
	let allTextNames = ["text-cuts", "text-heatmap", "text-heatmap-rank", "text-surface"];
	let chosenTextName = chosenTyp[0].includes("cuts") ? "text-cuts" : "text-" + chosenTyp[0];

	allTextNames.forEach(textName => {
		document.getElementById(textName).style.display = (selectedNode === "typAll" || textName === chosenTextName) ? "block" : "none";
	});

	/* Make sure only the correct function description is shown */
	for (let iFun = 0; iFun < valuesFun.length; iFun++) {
		textName = "text-f" + valuesFun[iFun];
		if ((selectedNode === "funAll") || (valuesFun[iFun] == chosenFun[0])) {
			document.getElementById(textName).setAttribute("style", "display:block;");
		}
		else {
			document.getElementById(textName).setAttribute("style", "display:none;");
		}
	}
	
	/* Reflect the current state in the URL parameters */
	setAllParams();
}

/* Move the dropdown selection to the previous item in the list */
function getPrev(ele) {
	let select = document.getElementById(ele.id.substring(0, 3));
	let len = select.length;
	let curr_index = select.selectedIndex;
	if (curr_index > 0) {
		select.selectedIndex--;
	} else {
		select.selectedIndex = len-1;
	}
	changePlot();
}

/* Move the dropdown selection to the next item in the list */
function getNext(ele) {
	let select = document.getElementById(ele.id.substring(0, 3));
	let len = select.length;
	let curr_index = select.selectedIndex;
	if (curr_index < len - 1) {
		select.selectedIndex++;
	} else {
		select.selectedIndex = 0;
	}
	changePlot();
}

/* Disable (or enable) the element */
function disableElements(ele, mode) {
	document.getElementById(ele + "Prev").disabled = mode;
	document.getElementById(ele).disabled = mode;
	document.getElementById(ele + "Next").disabled = mode;
	if (mode == false) {
		document.getElementById(ele + "Prev").style.cursor = "pointer";
		document.getElementById(ele).style.cursor = "pointer"
		document.getElementById(ele + "Next").style.cursor = "pointer"
	} else {
		document.getElementById(ele + "Prev").style.cursor = "default";
		document.getElementById(ele).style.cursor = "default"
		document.getElementById(ele + "Next").style.cursor = "default"
	}
}

/* Select the table cell */
function selectNode(node) {
  	selectedNode = node.id;
	for (let i = 0; i < allNodes.length; i++) {
		if (selectedNode === allNodes[i]) {
			document.getElementById(allNodes[i]).className = "on";
		  disableElements(allNodes[i].substring(0, 3), true);
		} else {
			document.getElementById(allNodes[i]).className = "off";
		  disableElements(allNodes[i].substring(0, 3), false);
		}
	}
	changePlot();
}

/* Get the value of the URL parameter */
function getParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

/* Sets the value of all URL parameters according to the current view */
function setAllParams() {
    const urlParams = new URLSearchParams(window.location.search);
    for (var i = 0; i < params.length; i++) {
		var value = document.getElementById(params[i]).value;
		if (selectedNode === (params[i] + "All")) {
            value = "all";
        }
        urlParams.set(params[i], value);
    }
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
}
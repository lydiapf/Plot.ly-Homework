function dropDown(){
    var dropDownID = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var sampleData = data.names; 
        sampleData.forEach((sample) => {
            dropDownID.append("option")
            .text(sample)
            .property("value", sample);
        });
        var firstSample = sampleData[0];
        metaData(firstSample);
        createChart(firstSample);
    });
}

dropDown()

function metaData(sampleData){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var filterdata = metadata.filter(sample => sample.id == sampleData);
        var results = filterdata[0];
        var display = d3.select("#sample-metadata");
        display.html("");
    
        Object.entries(results).forEach(([key, value])=> {
            display.append("h5").text(`${key.toUpperCase()}, ${value} `);
        });

        });
}

function optionChanged(sample){
    metaData(sample);
    createChart(sample);
}

function createChart(sampleData){
    d3.json("samples.json").then((data) => {
        var datasamples= data.samples;
        var filterdata = datasamples.filter(sample => sample.id == sampleData);
        var results = filterdata[0];
        var otuID = results.otu_ids;
        var otuLab = results.otu_labels;
        var sampleval = results.sample_values;
        var bardata = [{
            x: sampleval.slice(0,10).reverse(),
            y: otuID.slice(0,10).map(otuID => `OTU${otuID}`).reverse(),
            text: otuLab.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"

            
        }];
        Plotly.newPlot("bar", bardata);

        var bubbleData = [{
            x: sampleval.slice(0,10).reverse(),
            y: otuID.slice(0,10).map(otuID => `OTU${otuID}`).reverse(),
            mode: "markers",
            marker: {
                size: sampleval,
                color: otuID,
            },
            text: otuLab.slice(0,10).reverse()
        }];

        var b_data = [bubbleData];

        var layout_bub = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        Plotly.newPlot("bubble", b_data, layout_bub); 

    });
}
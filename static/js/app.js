// First create local server to access with http (python -m http.server) in terminal

// Use D3 to read in samples.json to get sample data.
function buildPlots(BioSample) {
    d3.json("samples.json").then((data) => {
        //console.log(data)

        // Get the  sample data info for the plots
        var samples = data.samples;
        //console.log(sampleData)

        // Filter  sample data info by id
        var result = samples.filter(sampleobject => sampleobject.id == BioSample)[0];
             
        var OTUids = result.otu_ids;
        var OTUlabels = result.otu_labels;
        var sampleValues = result.sample_values;
        //console.log(sampleValues)

        // Get top 10 OTUs
        var Top10_OTUids = OTUids.slice(0,10).reverse();
        var OTU_id = Top10_OTUids.map(d => `OTU ${d}`);
        var Top10_OTUlabels = OTUlabels.slice(0,10);
        var Top10_sampleValues = sampleValues.slice(0,10).reverse();

        // Define the bar plot
        var trace_bar = {
            x: Top10_sampleValues,
            y: OTU_id,
            text: Top10_OTUlabels,
            marker: {
            color: 'blue'},
            type: "bar",
            orientation: "h"
        };
        // Create the Bar plot traceData variable
        var data_bar = [trace_bar];

        // Create layout variable for bar plot layout
        var layout_bar = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear"
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 50
            }
        };

        // Create the bar plot
        Plotly.newPlot("bar", data_bar, layout_bar);

        // Define the bubble chart
        var trace_bubble = {
            x: OTUids,
            y: sampleValues, //Top10_sampleValues,
            text:  OTUlabels, //Top10_OTUlabels
            mode: "markers",
            marker: {
                size: sampleValues, //Top10_sampleValues,
                color: OTUids
                },
        };
            
        // Create the Bubble plot traceData variable 
        var data_bubble = [trace_bubble];

        // Create layout variable for bubble plot layout
        var layout_bubble = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // Create the bubble plot
        Plotly.newPlot("bubble", data_bubble, layout_bubble);
    });
        
}                             

// Use D3 to read in samples.json to get the metadata info.
function buildMetadataInfo(BioSample) {    
    d3.json("samples.json").then((data) => {
        //console.log(data)
        
        // Get the metadata info for the demographic panel
        var metadata = data.metadata;
        //console.log(metadata)

        // Filter metadata info by id
        var result = metadata.filter(sampleobject => sampleobject.id == BioSample)[0];
                
        // Select demographic panel to show Demographic Info
        var demographicInfo = d3.select("#sample-metadata");
        
        // Empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // Get demographic data for the id and append to the info to the panel
        Object.entries(result).forEach(([key, value]) => {   
            demographicInfo
            .append("h5")
            .text(`${key}: ${value}`);    
        });
    });
}

// Create the function for the initial data rendering
function init() {
    // Select dropdown menu 
    var dropdown = d3.select("#selDataset");
    
    // Read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)
        var sampleIDs = data.names;
        // Get the id data for the dropdwown menu
        sampleIDs.forEach((BioSample) => {
            dropdown
            .append("option")
            .text(BioSample)
            .property("value", BioSample);
        });

        //
        const first_id = sampleIDs[0];
        buildPlots(first_id);
        buildMetadataInfo(first_id);  
    });
}  
            
// create the function for the change event
function optionChanged(newsample) {
    buildPlots(newsample);
    buildMetadataInfo(newsample);
}


    
init();
   
 
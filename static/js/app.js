function buildMetadata(sample) {

    // select the panel with id of `#sample-metadata`
    var metadata_url = `/metadata/${sample}`; 
  
    d3.json(metadata_url).then(function (data){
      var metadata = [data];
      console.log(data)
    
    var arr = d3.entries(data)

    // clear any existing metadata
    d3.select('#sample-metadata').html(''); 

    d3.select('#sample-metadata')
      .selectAll('h6')
      .data(arr)
      .enter()
      .append('h6')
      .text(d => `${d.key}: ${d.value}`);
    })    
};
 

function buildCharts(sample) {

    // Fetch the sample data for the plots
    var sample_url = `/samples/${sample}`; 
    
    d3.json(sample_url).then(function (d){
      var sampledata = [d];
      console.log(d)
      var data = [{
        values: d.sample_values.slice(0,10),
        labels: d.otu_ids,
        type: 'pie'
      }];
      var layout = {
        height: 400,
        width: 300
      };
      Plotly.newPlot('pie', data);

      var trace1 = {
        x: d.otu_ids,
        y: d.sample_values,
        mode: 'markers',
        marker: {
          size: d.sample_values,
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'OTU ID vs Values',
        showlegend: false,
        height: 600,
        width: 1500
      };
      
      Plotly.newPlot('bubble', data, layout);
    })
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

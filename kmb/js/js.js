window.addEventListener("load", function(){
  window.cookieconsent.initialise({
    "container" : "wut",
    "palette": {
      "popup": {
        "background": "#000"
      },
      "button": {
        "background": "#f1d600"
      }
    }
  })});
var renderFunctions = {
  "bigg" : _.template($("#cpd-view-template-bigg").html()),
  "ms" : _.template($("#cpd-view-template-modelseed").html()),
  "metacyc" : _.template($("#cpd-view-template-metacyc").html())
};

var cpdViewTemplate = _.template($("#cpd-view-template").html());
var rxnViewTemplate = _.template($("#rxn-view-template").html());

var show = function(id) {
//    console.log('data/cpd/' + id + '.json');
  $.getJSON('data/cpd/' + id + '.json', function(data) {
//      console.log(data);
    var html = cpdViewTemplate({cpdData: data});
    $('#cpd-view-container').html(html);
  });
};

var showRxn = function(id) {
//    console.log('data/cpd/' + id + '.json');
  $.getJSON('data/rxn/' + id + '.json', function(data) {
    console.log('loaded rxn data: ', data);
    var html = rxnViewTemplate({rxnData: data});
    $('#cpd-view-container').html(html);
  });
};

function htmlBuildCpdRow(data) {
  var html = "<tr>";
  //console.log(data);

  var button = '<button type="button" onclick="show(\'' + data.id + '\');"' +
               'class="btn btn-info btn-xs" data-toggle="modal" data-target="#cpd-model">Show</button>';
  var refLinks = "";
  _.each(data.references, function(ref) {
    refLinks += getCpdLink(ref.entry, ref.source) + ', ';
  });

  html += "<td>" + data.id + "</td>" +
          "<td>" + (data.name ? data.name : "") + "</td>" +
          "<td>" + (data.alias ? data.alias : "") + "</td>" +
          "<td>" + (data.formula ? data.formula : "") + "</td>" +
          "<td>" + data.rxns + "</td>" +
          "<td>" + refLinks + "</td>" +
          "<td>" + button + "</td>";

  html += "</tr>";
  return html;
}

function htmlBuildRxnRow(data, index) {
  var html = "<tr>";

  var button = '<button type="button" onclick="showRxn(\'' + data.id + '\');"' +
               'class="btn btn-info btn-xs" data-toggle="modal" data-target="#cpd-model">Show</button>';
  var refLinks = "";
  _.each(data.references, function(ref) {
    index.addReaction(data.id, ref.entry, ref.source);
    refLinks += getRxnLink(ref.entry, ref.source) + ', ';
  });
  var eqHtml = renderEquationHtml(data, index);
  html += "<td>" + data.id + "</td>" +
          "<td>" + (data.name ? data.name : "") + "</td>" +
          "<td>" + (data.alias ? data.alias : "") + "</td>" +
          "<td>" + eqHtml + "</td>" +
          "<td>" + getOtherLink(data.ecn, 'Enzyme') + "</td>" +
          "<td>" + refLinks + "</td>" +
          "<td>" + button + "</td>";
  html += "</tr>";
  return html;
}

function loadCpdTableData(path, ctable, index) {
  return $.getJSON(path, function(data) {
    var aRows = [];
    _.each(data.records, function(cpdData) {
      index.setMetaboliteAlias(cpdData.id, cpdData.alias);
      if (cpdData.structure) {
        index.setMetaboliteStructure(cpdData.id, "data/structure/" + cpdData.id + ".svg");
      }
      _.each(cpdData.references, function(ref) {
        index.addMetabolite(cpdData.id, ref.entry, ref.source);
      });

      aRows.push(htmlBuildCpdRow(cpdData));
    });
    ctable.update(aRows);
  });
}

function loadRxnTableData(path, ctable, index) {
  return $.getJSON(path, function(data) {
    console.log('loading reactions...');
    var aRows = [];
    _.each(data.records, function(rxnData) {
      //console.log(rxnData);
      _.each(rxnData.references, function(ref) {
        index.addReaction(rxnData.id, ref.entry, ref.source);
      });

      aRows.push(htmlBuildRxnRow(rxnData, index));
    });

    ctable.update(aRows);
  });
}

var index;

$(function () {
  if (typeof $.cookie('biodb-license-agree') === 'undefined'){
    console.log("MUST AGREE LICENCE");
  } else {
    console.log("GOOD !");
  }
  init();
  index = new BiodbIndex();
  var cpdData = {
    "id" : "icpd2369",
    "formula" : "C3H3O3",
    "name" : "pyruvate",
    "synonyms" : [ "2-oxopropanoate", "2-oxopropionate", "acetylformate", "alpha-ketopropionate" ],
    "alias" : "pyr",
    "references" : [ {
      "source" : "MetaCyc",
      "entry" : "META:PYRUVATE"
    }, {
      "source" : "BiGGMetabolite",
      "entry" : "pyr"
    }, {
      "source" : "LigandCompound",
      "entry" : "C00022"
    }]
  };

  var cpdTable = initializeClusterizeTables('ctable-cpd');
  var rxnTable = initializeClusterizeTables('ctable-rxn');
  loadCpdTableData('data/cpds.json', cpdTable, index).done(function() {
    loadRxnTableData('data/rxns.json', rxnTable, index);
  });

  //loadCpdTableData('data_huge/cpds.json', cpdTable, index);

  //var tableCpd = $("#cpd-table");
  //tableCpd.dataTable(table_cpd_sets_config);
  /*
  $.getJSON('cpds.json', function(data) {
    console.log('loading metabolites...');
    var tableData = [];
    _.each(data.records, function(cpdData) {
      index.setMetaboliteAlias(cpdData.id, cpdData.alias);
      if (cpdData.structure) {
        index.setMetaboliteStructure(cpdData.id, "data/structure/" + cpdData.id + ".svg");
      }
      _.each(cpdData.references, function(ref) {
        //console.log(cpdData.id, "database", ref.source, "entry", ref.entry);
        index.addMetabolite(cpdData.id, ref.entry, ref.source);
      });

      var rowData = makeMetaboliteTableRowData(cpdData);
      tableData.push(rowData);
    });
    tableCpd.DataTable().rows.add(tableData).draw();
  });
  */
  /*
  var tableRxn = $("#rxn-table");
  tableRxn.dataTable(table_rxn_sets_config);
  $.getJSON('reactionTable.json', function(data) {
    console.log('loading reactions...');
    var tableData = [];
    _.each(data.records, function(rxnData) {
      //console.log(rxnData);
      _.each(rxnData.references, function(ref) {
        index.addReaction(rxnData.id, ref.entry, ref.source);
      });
      var rowData = makeReactionTableRowData(rxnData);
      tableData.push(rowData);
    });
    tableRxn.DataTable().rows.add(tableData).draw();
  });
  */
});
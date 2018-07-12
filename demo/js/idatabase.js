
var identifiersMap = {
  "LigandCompound" : "http://identifiers.org/kegg.compound/",
  "LigandGlycan" : "http://identifiers.org/kegg.glycan/",
  "LigandDrug" : "http://identifiers.org/kegg.drug/",
  "MetaCyc" : "http://identifiers.org/biocyc/",
  "ModelSeed" : "http://identifiers.org/seed.compound/",
  "BiGGMetabolite" : "http://identifiers.org/bigg.metabolite/",
  "LipidMAPS" : "http://identifiers.org/lipidmaps/",
  "HMDB" : "http://identifiers.org/hmdb/"
};
var rxnDatabaseMap = {
  "LigandReaction" : "http://identifiers.org/kegg.reaction/",
  "MetaCyc" : "http://identifiers.org/biocyc/",
  "ModelSeed" : "http://identifiers.org/seed.reaction",
  "BiGGReaction" : "http://identifiers.org/bigg.reaction/"
};

var otherDatabaseMap = {
  "KeggOrthology" : "http://identifiers.org/kegg.orthology/",
  "Enzyme" : "http://identifiers.org/ec-code/"
};

function BiodbIndex() {
  this.metabolitesHasStructure = {};
  this.metabolitesAlias = {};
  this.metabolites = {};
  this.reactions = {};
}

BiodbIndex.prototype.setMetaboliteAlias = function(id, alias) {
  this.metabolitesAlias[id] = alias;
};

BiodbIndex.prototype.setMetaboliteStructure = function(id, s) {
  this.metabolitesHasStructure[id] = s;
};

BiodbIndex.prototype.addMetabolite = function(alias, entry, database) {
  this.metabolites[database] = this.metabolites[database] || {};
  this.metabolites[database][entry] = alias;
};

BiodbIndex.prototype.addReaction = function(alias, entry, database) {
  this.reactions[database] = this.reactions[database] || {};
  this.reactions[database][entry] = alias;
};

BiodbIndex.prototype.getMetaboliteAlias = function(entry, database) {
  if (this.metabolites[database] && this.metabolites[database][entry]) {
    return this.metabolites[database][entry];
  }
  return entry;
};

BiodbIndex.prototype.getReactionAlias = function(entry, database) {
  if (this.reactions[database] && this.reactions[database][entry]) {
    return this.reactions[database][entry];
  }
  return entry;
};

var getOtherLink = function(entry, database) {
  if (otherDatabaseMap[database]) {
    return '<a href="' + otherDatabaseMap[database] + entry + '" target="_blank">' + entry + '</a>';
  }
  return entry;
};

var getCpdLink = function(entry, database) {
  if (identifiersMap[database]) {
    return '<a href="' + identifiersMap[database] + entry + '" target="_blank">' + entry + '</a>';
  }
  return entry;
};

var getRxnLink = function(entry, database) {
  if (rxnDatabaseMap[database]) {
    return '<a href="' + rxnDatabaseMap[database] + entry + '" target="_blank">' + entry + '</a>';
  }
  return entry;
};

var renderEquationHtml = function(rxnData, index) {
  //console.log(rxnData.stoichiometry);
  var l = [];
  var r = [];
  _.each(rxnData.stoichiometry.l, function(v, cpd) {
    var htmlStoich = "";
    if (v) {
      htmlStoich = "<span class='label label-primary'>" + v + "</span> ";
    }
    if (index.metabolitesAlias[cpd]) {
      var htmlButton =
        '<button type="button" onclick="show(\''+ cpd + '\');" class="btn btn-success btn-xs" data-toggle="modal" data-target="#cpd-model">' + index.metabolitesAlias[cpd] + '</button>'
      l.push(htmlStoich + htmlButton);
    } else {
      l.push(htmlStoich + cpd);
    }

  });
  _.each(rxnData.stoichiometry.r, function(v, cpd) {
    var htmlStoich = "";
    if (v) {
      htmlStoich = "<span class='label label-primary'>" + v + "</span> ";
    }
    if (index.metabolitesAlias[cpd]) {
      var htmlButton =
        '<button type="button" onclick="show(\''+ cpd + '\');" class="btn btn-success btn-xs" data-toggle="modal" data-target="#cpd-model">' + index.metabolitesAlias[cpd] + '</button>'
      r.push(htmlStoich + htmlButton);
    } else {
      r.push(htmlStoich + cpd);
    }
    //console.log(v, cpd);
  });
  //console.log(rxnData.stoichiometry.l);
  //console.log(rxnData.stoichiometry.r);
  var eqSep = ' <i class="fa fa-arrows-h" aria-hidden="true"></i> ';
  var eqBlockSep = ' <i class="fa fa-plus-square" aria-hidden="true"></i> ';
  return l.join(eqBlockSep) + eqSep + r.join(eqBlockSep);
};

var renderEquationSHtml = function(rxnData, index) {

  var sumHtml = '<div class="eqs-sum"><div class="eqs-empty"></div><i class="fa fa-plus-square" aria-hidden="true"></i></div>';
  var sepHtml = '<div class="eqs-sum"><div class="eqs-empty"></div> <i class="fa fa-arrows-h" aria-hidden="true"></i> </div>';
  return renderEquationSBlockHtml(rxnData.stoichiometry.l, sumHtml, index) +
         //renderEquationSBlockHtml(rxnData.stoichiometry.l, sumHtml, index) +
         //renderEquationSBlockHtml(rxnData.stoichiometry.l, sumHtml, index) +
         sepHtml +
         renderEquationSBlockHtml(rxnData.stoichiometry.r, sumHtml, index);
};

var renderEquationSBlockHtml = function(block, joiner, index) {
  var l = [];
  _.each(block, function(v, cpd) {
    var htmlBlock = '<div class="floating-box">';
    var dipiction = cpd;
    var htmlStoich = "";
    if (v) {
      htmlStoich = "<span class='label label-primary'>" + v + "</span> ";
    }
    if (index.metabolitesAlias[cpd]) {
      dipiction = index.metabolitesAlias[cpd];
      var htmlButton2 =
        '<button type="button" onclick="show(\''+ cpd + '\');" class="btn btn-success btn-xs" data-toggle="modal" data-target="#cpd-model">' + index.metabolitesAlias[cpd] + '</button>'
      if (index.metabolitesHasStructure[cpd]) {
        dipiction = '<img src="' + index.metabolitesHasStructure[cpd] + '" width="100%" height="100%">';
      }
      //<img src="C00002.svg" width="100%" height="100%">
      htmlBlock +=
        '<div class="eqs-dipiction">' + dipiction +'</div>' +
        '<div class="eqs-label">' +
        htmlStoich + htmlButton2 + '</div>' +
        '    </div>';
      l.push(htmlBlock);
    } else {
      htmlBlock +=
        '<div class="eqs-dipiction">' + dipiction +'</div>' +
        '<div class="eqs-label">' +
        htmlStoich + cpd + '</div>' +
        '    </div>';
      l.push(htmlBlock);
    }
  });
  return l.join(joiner);
};

var loadCpdIndex = function(indexFile, index) {
  $.getJSON(indexFile, function(data) {
    _.each(data.records, function(cpdData) {
      index.setMetaboliteAlias(cpdData.id, cpdData.alias);
      if (cpdData.structure) {
        index.setMetaboliteStructure(cpdData.id, "data/structure/" + cpdData.id + ".svg");
      }
      _.each(cpdData.references, function(ref) {
        index.addMetabolite(cpdData.id, ref.entry, ref.source);
      });
    });
  });
};

var makeMetaboliteTableRowData = function(cpdData) {
  var refLinks = "";
  _.each(cpdData.references, function(ref) {
    refLinks += getCpdLink(ref.entry, ref.source) + ', ';
  });
  return rowData = {
    "id" : cpdData.id,
    "name" : cpdData.name,
    "alias" : cpdData.alias,
    "formula" : cpdData.formula,
    "refs" : refLinks,
    "reactions" : cpdData.rxns,
    "details" : '<button type="button" ' +
    'onclick="show(\'' + cpdData.id + '\');"' +
    'class=\'btn btn-info btn-xs\'' +
    'data-toggle="modal" data-target="#cpd-model">Show</button>'
  };
};

var makeReactionTableRowData = function(rxnData) {
  var reflinks = "";
  _.each(rxnData.references, function(ref) {
    index.addReaction(rxnData.id, ref.entry, ref.source);
    reflinks += getRxnLink(ref.entry, ref.source) + ', ';
  });
  return rowData = {
    "id" : rxnData.id,
    "name" : rxnData.name,
    "alias" : rxnData.alias,
    "equation" : renderEquationHtml(rxnData, index),
    "ecn" : getOtherLink(rxnData.ecn, 'Enzyme'),
    "refs" : reflinks,
    "reactions" : 0,
    "details" : '<button type="button" ' +
    'onclick="showRxn(\'' + rxnData.id + '\');"' +
    'class=\'btn btn-info btn-xs\'' +
    'data-toggle="modal" data-target="#cpd-model">Show</button>'
  };
};

var initializeDatabase = function(cpdIndexFile, rxnIndexFile, fnLoadRxnRecord, fnLoadRxnDone) {
  var index = new BiodbIndex();
  var rxnRecordCount = 0;
  var cpdRecordCount = 0;
  $.getJSON(cpdIndexFile, function(data) {
    _.each(data.records, function(cpdData) {
      index.setMetaboliteAlias(cpdData.id, cpdData.alias);
      if (cpdData.structure) {
        index.setMetaboliteStructure(cpdData.id, "data/structure/" + cpdData.id + ".svg");
      }
      _.each(cpdData.references, function(ref) {
        index.addMetabolite(cpdData.id, ref.entry, ref.source);
      });
      cpdRecordCount++;
    });
    console.log('total metabolites', cpdRecordCount);
  }).done(function() {
    $.getJSON(rxnIndexFile, function(data) {
      _.each(data.records, function(rxnData) {
        _.each(rxnData.references, function(ref) {
          index.addReaction(rxnData.id, ref.entry, ref.source);
        });
        rxnRecordCount++;
        if (fnLoadRxnRecord) {
          fnLoadRxnRecord(rxnData);
        }
      });
      console.log('total reactions', rxnRecordCount);
      if (fnLoadRxnDone) {
        fnLoadRxnDone();
      }
    }).done(function() {
    });
  });
  return index;
};

var rxnPluginFunctions = {};
var renderFunctions = {};

var tsize = 600;
var table_cpd_sets_config = {
  scrollY: tsize,
  scroller: true,
  "dom": '<"top"f>rt<"bottom"i><"clear">',
  "aaData" : [],
  "aoColumns" : [
    {
      sTitle: 'Compound',
      mDataProp: 'id',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Name',
      mDataProp: 'name',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Alias',
      mDataProp: 'alias',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Formula',
      mDataProp: 'formula',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Reactions',
      mDataProp: 'reactions',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'References',
      mDataProp: 'refs',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: '',
      mDataProp: 'details',
      bSearchable: false,
      bVisible: true
    }
  ]
};

var table_rxn_sets_config = {
  scrollY: tsize,
  scroller: true,
  "dom": '<"top"f>rt<"bottom"i><"clear">',
  "aaData" : [],
  "aoColumns" : [
    {
      sTitle: 'Reaction',
      mDataProp: 'id',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Alias',
      mDataProp: 'alias',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Enzyme',
      mDataProp: 'ecn',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Name',
      mDataProp: 'name',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'Equation',
      mDataProp: 'equation',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: 'References',
      mDataProp: 'refs',
      bSearchable: true,
      bVisible: true
    },
    {
      sTitle: '',
      mDataProp: 'details',
      bSearchable: false,
      bVisible: true
    }
  ]
};

var initializeMetaboliteTable = function(container) {
  container.dataTable(table_cpd_sets_config);
};

var initializeReactionTable = function(container) {
  container.dataTable(table_rxn_sets_config);
};
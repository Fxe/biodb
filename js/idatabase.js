var identifiersMap = {
  "LigandCompound" : "http://identifiers.org/kegg.compound/",
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
  console.log(rxnData.stoichiometry);
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
  return l.join(' + ') + " <=> " + r.join(' + ');
};

var renderEquationSHtml = function(rxnData, index) {

  var sumHtml = '<div class="eqs-sum"><div class="eqs-empty"></div><i class="fa fa-plus-square" aria-hidden="true"></i></div>';
  var sepHtml = '<div class="eqs-sum"><div class="eqs-empty"></div> <i class="fa fa-arrows-h" aria-hidden="true"></i> </div>';
  return renderEquationSBlockHtml(rxnData.stoichiometry.l, sumHtml, index) +
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
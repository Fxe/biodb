/**
 * Created by Filipe Liu  on 12/22/2017.
 */

console.log("[LOADED] kegg plugin");

if (!rxnPluginFunctions) {
  var rxnPluginFunctions = {};
}

otherDatabaseMap["KeggOrthology"] = "http://identifiers.org/kegg.orthology/";
otherDatabaseMap["KeggPathway"] = "http://identifiers.org/kegg.pathway/";

rxnPluginFunctions['kegg'] = _.template($("#rxn-view-template-kegg").html());
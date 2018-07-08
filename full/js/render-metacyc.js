/**
 * Created by Filipe Liu  on 12/22/2017.
 */

console.log("[LOADED] metacyc plugin");

if (!rxnPluginFunctions) {
  var rxnPluginFunctions = {};
}

//otherDatabaseMap["KeggOrthology"] = "http://identifiers.org/kegg.orthology/";
//otherDatabaseMap["KeggPathway"] = "http://identifiers.org/kegg.pathway/";

rxnPluginFunctions['metacyc'] = _.template($("#rxn-view-template-metacyc").html());
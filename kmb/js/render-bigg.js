/**
 * Created by Filipe Liu on 12/22/2017.
 */
console.log("[LOADED] bigg plugin");

if (!rxnPluginFunctions) {
  var rxnPluginFunctions = {};
}

rxnPluginFunctions['bigg'] = _.template($("#rxn-view-template-bigg").html());
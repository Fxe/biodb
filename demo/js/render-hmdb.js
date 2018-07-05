/**
 * Created by Filipe Liu  on 12/21/2017.
 */
console.log("[LOADED] render-hmdb");

var htmlTemplate =
  '<h4>Human Metabolome:</h4>' +
  '<dl class="dl-horizontal">' +
  '  <% if (cpdData.cellularLocation) { %>' +
  '    <dt>Cellular</dt>' +
  '    <dd><%-cpdData.cellularLocation %></dd>' +
  '  <%} %>' +
  '  <% if (cpdData.biofluids) { %>' +
  '    <dt>Biofluids</dt>' +
  '    <dd><%-cpdData.biofluids %></dd>' +
  '  <%} %>' +
  '</dl>' +
  '<dl class="dl-horizontal">' +
  '  <% if (cpdData.applications) { %>' +
  '    <dt>Applications</dt>' +
  '    <dd><%-cpdData.applications %></dd>' +
  '  <%} %>' +
  '  <% if (cpdData.origins) { %>' +
  '    <dt>Origins</dt>' +
  '    <dd><%-cpdData.origins %></dd>' +
  '  <%} %>' +
  '  <% if (cpdData.biofuncions) { %>' +
  '    <dt>Biofunctions</dt>' +
  '    <dd><%-cpdData.biofuncions %></dd>' +
  '  <%} %>' +
  '</dl>';

var init = function() {
  //var template = _.template($("#cpd-view-template-hmdb").html());
  var template = _.template(htmlTemplate);
  //console.log(template);
  if (template) {
    renderFunctions["hmdb"] = template;
  }
};

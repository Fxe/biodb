function initializeClusterizeTables(tableId) {
  var aRows = ['<tr><td style="text-align: center">empty</td></tr>'];
  return new Clusterize({
    rows: aRows,
    scrollId: tableId + '-scroll',
    contentId: tableId + '-content'
  });
}

function buildClusterizeTableData(first, last, skip, data, modifiers) {
  var modifierFunction = {
    "created_at" : function(d) {
      return new Date(d['created_at']).toLocaleString() + "<br>" + new Date(d['updated_at']).toLocaleString();
    },
    "updated_at" : function(d) {
      return new Date(d['updated_at']).toLocaleString();
    }
  };
  if (modifiers) {
    _.extend(modifierFunction, modifiers);
  }
  var tableData = [];
  var keys = {};
  _.each(data, function(e) {
    _.extend(keys, e);
  });

  var order = [].concat(first);
  _.each(_.keys(keys), function (k) {
    if (first.indexOf(k) < 0 &&
      last.indexOf(k) < 0 &&
      skip.indexOf(k) < 0) {
      order.push(k);
    }
  });

  order = order.concat(last);

  console.log(order);

  _.each(data, function(e) {
    var rowData = "<tr>";
    rowData += '<td>' +
      '<div class="btn-group" role="group" aria-label="Control">\n' +
      '  <button type="button" class="btn btn-secondary" onclick="loadModelData(' + e['bios_id'] + ')">Open</button>\n' +
      '  <button type="button" class="btn btn-secondary">Edit</button>\n' +
      '  <button type="button" class="btn btn-secondary">?</button>\n' +
      '</div>' +
      '</td>';
    _.each(order, function(k) {
      if (e[k]) {
        if (modifierFunction[k]) {
          rowData += "<td>" + modifierFunction[k](e) + "</td>";
        } else {
          rowData += "<td>" + e[k] + "</td>";
        }
      } else {
        rowData += "<td>-</td>";
      }
    });
    rowData += "</tr>";
    tableData.push(rowData);
  });

  return tableData;
}
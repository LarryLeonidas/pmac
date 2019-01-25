$(document).ready(function ($) {
    console.log('doc1','==>','start');
    fileHandlers();
});
function parseFile(atype,file){
    console.log('parseFile1','==>','start');
    console.log('parseFile2','==>',file);
    var reader = new FileReader();
    reader.onload = (function(reader){
        return function(){
            console.log('parseFile3','==>',reader.result);
            var content = reader.result;
            var data = content.split('\n');
            var clean = [];
            console.log('parseFile4','==>',data);
            for( var i = 0; i < data.length; i++){
                if(data){
                    var rows = data[i].split('\\t');
                    console.log('parseFile5','==>',rows);
                    for( var i2 = 0; i2 < rows.length; i2++){
                        if(rows){
                            var cols = rows[i2].split(/\s+/g);
                            console.log('parseFile6','==>',cols);
                            if(cols.length > 1) clean.push(cols);
                        }
                    }
                }
            }
            console.log('parseFile7','==>','done');
            buildTable(atype,clean);
            return clean;
        } 
    })(reader);
    reader.readAsText(file);
}
function buildTable(atype,data){
    console.log('buildTable1','==>','start');
    console.log('buildTable2','==>',data);
    var container = $('.'+atype+'Container');
    var table = container.find('#'+atype+'Table');
    table.find('tbody').empty();
    if(data.length > 1){
        for( var i = 0; i < data.length; i++){
            var row = data[i];
            var trow = $('<tr></tr>');
            if(atype=='weather'){
                row.splice(0,1);
                if(i==0) container.find('.title').append(' - <b>' + row[1] + ' ' + row[2] + '</b>');
                console.log('buildTable3a','==>',row);
                
                for(var i2 = 0; i2 < row.length; i2++){
                    if(i==1) table.find('thead > tr').append('<th class="col-md-1 ">'+row[i2]+'</th>');
                    else if(i > 1) trow.append('<td class="col-md-1 ">'+row[i2]+'</td>');
                }    
            }
            else if(atype == 'soccer'){
                console.log('buildTable3b','==>',row);
                for(var i2 = 0; i2 < row.length; i2++){
                    if(i==0) {
                        if(i2==0) table.find('thead > tr').append('<th class="col-md-1 ">Number</th>');
                        else if(i2 != 6) table.find('thead > tr').append('<th class="col-md-1 ">'+row[i2]+'</th>');
                        else if(i2 == 6) table.find('thead > tr').append('<th class="col-md-1 ">'+row[i2]+'</th><th class="col-md-1 ">-</th>');
                    }
                    else if(i2 > 0) trow.append('<td class="col-md-1 ">'+row[i2]+'</td>');
                }
            }
            table.append(trow);
        }
    }
    minSpread(atype,container,table);
}
function fileHandlers(){
    $('input').on('change', function(e){
        console.log('fileHandlers1-change','==>','start; '+ e.type);
        var file = e.target.files[0]; 
        if($(this).attr('id') == 'wfile') parseFile('weather',file);
        else if($(this).attr('id') == 'sfile') parseFile('soccer',file);
        console.log('fileHandlers2-change','==>','done');
    });
}
function minSpread(atype,container,atable){
    console.log('minSpread3 >minSpread1','==>','start');
    var headers = atable.find('thead > tr > th');
    console.log('minSpread3 >minSpread2','==>', headers.length);
    var maxIndex;
    var minIndex
    headers.each(function(index){
        var t = $(this);
        if(atype == 'weather'){
            if(t.text() == 'MxT') maxIndex = t.index();
            else if(t.text() == 'MnT') minIndex = t.index();    
        }
        else if(atype == 'soccer'){
            if(t.text() == 'F') maxIndex = t.index();
            else if(t.text() == 'A') minIndex = t.index();    
        }

    })
    console.log('minSpread3 >minSpread3','==>',maxIndex + ' - ' + minIndex);
    var spread = 100000;
    var spreadIndex = 0;
    var spreadDay;
    atable.find('tbody > tr').each(function(index){
        var thisRow = $(this);
        var thisMax = 10000;
        var thisMin = 0;
        thisRow.find('td').eq(maxIndex).each(function(){ 
            if($(this).text()) thisMax = parseInt($(this).text()); 
        });
        thisRow.find('td').eq(minIndex).each(function(){ 
            if($(this).text()) thisMin = parseInt($(this).text()); 
        });
        var thisSpread = Math.abs(thisMax-thisMin);
        console.log('minSpread3 >minSpread4','==>',index);
        console.log('minSpread3 >minSpread5','==>',thisMax +' - ' + thisMin);
        if(thisSpread < spread){ 
            spread = thisSpread;
            thisRow.css({color: 'red'});
            spreadIndex = index;
            spreadDay = thisRow.find('td').eq('0').text();
        }
        atable.find('tbody > tr').not(':eq('+spreadIndex+')').each(function(){
            $(this).css({color: 'black'});
        });
    });
    console.log('minSpread3 >minSpread6','==>',spreadIndex);
    container.find('.title').append('<span style="color: red; margin-left: 5px;"> Number '+spreadDay+ ' has minimum spread</span>');
}

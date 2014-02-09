function simulatePPClient() {
    
    var hickoryFarmsFile = new DiffFile("www.hickoryfarms.com", "Privacy Policy.txt", "41d6f3ea68cf871152b433b13069125284e48b36");

    PPClient.get_new_and_old_file(hickoryFarmsFile, function(file) {
       
        var diff = HtmlDiff.formatTextDiff(file.old, file.current);
        $('div#diff').append(diff);
    });
}

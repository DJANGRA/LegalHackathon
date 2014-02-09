function simulatePPClient() {
    
    var hickoryFarmsFile = new DiffFile("hickoryfarms.com", "Privacy Policy.txt", "https://www.hickoryfarms.com/_hf-privacy-policy");
    console.log(hickoryFarmsFile.filename);
    hickoryFarmsFile.sha = "41d6f3ea68cf871152b433b13069125284e48b36";
    PPClient.get_new_and_old_file(hickoryFarmsFile, function(file) {
       
        var diff = HtmlDiff.formatTextDiff(file.old, file.current);
        $('div#diff').append(diff);
    });
}

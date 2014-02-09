function simulatePPClient() {
    
    var hickoryFarmsFile = new DiffFile("hickoryfarms.com", "Privacy Policy.txt", "https://www.hickoryfarms.com/_hf-privacy-policy");
    console.log(hickoryFarmsFile.filename);
    hickoryFarmsFile.sha = "9ec109f74bb3ed1f08c0289ffa79d6bcebdfa076";
    PPClient.get_new_and_old_file(hickoryFarmsFile, function(file) {
       
        var diff = HtmlDiff.formatTextDiff(file.old, file.current);
        $('div#diff').append(diff);
    });
}

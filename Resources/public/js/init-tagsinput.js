$(function() {
    $('#articleTags').tagsInput({width:'auto', height: 'auto'});
    $('#suggestedTags').tagsInput({width:'auto', height: 'auto'});
    
    $("#suggestedTags_tagsinput .tag span").live("click", 
    function(){
        var tag = $(this).text();
        $('#articleTags').addTag($.trim(tag));
        $('#suggestedTags').removeTag($.trim(tag));
    });
});
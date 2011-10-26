// TODO: update to VIE 2.0
// var VIE = new VIE();

jQuery(document).ready(function($) {

    VIE.EntityManager.initializeCollection();

    VIE.EntityManager.entities.bind('add', function(model) {
        model.url = vie_phpcr_path + model.id;
        model.toJSON = model.toJSONLD;
    });

    // Load all RDFa entities into VIE
    VIE.RDFaEntities.getInstances();

    // Make all RDFa entities editable

    jQuery('[typeof][about]').each(function() {
        jQuery(this).vieSemanticHallo({
            plugins: {
                'dcterms:title': {
                    'halloformat': {},
                    'hallooverlay': {},
                    'hallotoolbarlinebreak': {}
                },
                'default': {
                    'halloimage': { 'searchUrl': 'liip/vie/assets/search/' },
                    'hallolinkimg': {},
                    'halloheadings': {},
                    'halloformat': {},
                    'hallolists': {},
                    'hallojustify': {},
                    'hallotoolbarlinebreak': { 'breakAfter': ['hallolinkimg'] },
                    'hallooverlay': {}
                }
            },
            floating: false,
            offset: {
                'x': 0,
                'y': "top"
            },
            showAlways: true
        });
    });

    $(this).bind('hallodeactivated', vieSaveContent);

    $(window).resize(function(){
        if(!$('.inEditMode')[0] == undefined ){
            $('.halloToolbar').css('left', $('.inEditMode')[0].offsetLeft);
        }
    });

    $('[contenteditable]').hover(function(){
        if(!$(this).hasClass('inEditMode')){
            var editButton = $('<div>edit</div>').addClass('editButton');
            $(this).append(editButton);
        }
    }, function(){
        $('.editButton').remove();
    });

});

function vieSaveContent() {
    // Go through all Backbone model instances loaded for the page
    VIE.EntityManager.entities.each(function(objectInstance) {

        if (!VIE.HalloEditable.refreshFromEditables(objectInstance)) {
            // No changes to this object, skip
            return true;
        }
        $(document).trigger("vieSaveStart");

        // Set the modified properties to the model instance
        objectInstance.save(null, {
            success: function(savedModel, response) {
                $(document).trigger("vieSaveSuccess");
                console.log(savedModel.id + " was saved");
            },
            error: function(response) {
                console.log("Save failed");
                console.log(response);
            }
        });
    });
}

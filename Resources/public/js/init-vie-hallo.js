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
                'halloformat': {}
            },
            floating: false,
            offset: {
                'x':0,
                'y':45
            }
        });
    });

    $('#savebutton').bind('click', function() {

        // Go through all Backbone model instances loaded for the page
        VIE.EntityManager.entities.each(function(objectInstance) {

            if (!VIE.HalloEditable.refreshFromEditables(objectInstance)) {
                // No changes to this object, skip
                return true;
            }

            // Set the modified properties to the model instance
            objectInstance.save(null, {
                success: function(savedModel, response) {
                    alert(savedModel.id + " was saved, see JS console for details");
                    $('#savebutton').hide();
                },
                error: function(response) {
                    console.log("Save failed");
                    console.log(response);
                }
            });
        });
    });

    $(this).bind('halloactivated', function() {
        $('#savebutton').show();
    });
    $(this).bind('hallodeactivated', function() {
        //$('#savebutton').hide();
    });

});
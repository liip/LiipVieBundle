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
        jQuery(this).vieSemanticHallo();
    });

    $('#savebutton').bind('click', function() {
        // Go through all Backbone model instances loaded for the page
        VIE.EntityManager.entities.each(function(objectInstance) {
            if (!objectInstance.editables) {
                // No changes to this object, skip
                console.log('no editable');
                return true;
            }
console.log(objectInstance);
            if (!jQuery(objectInstance).isModified()) {
                console.log('no changes');
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
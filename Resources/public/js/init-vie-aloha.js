GENTICS_Aloha_base = 'http://aloha-editor.org/aloha-0.9.3/aloha/';
jQuery(document).ready(function() {

    VIE.EntityManager.initializeCollection();

    VIE.EntityManager.entities.bind('add', function(model) {
        model.url = vie_phpcr_path + model.id;
        model.toJSON = model.toJSONLD;
    });

    // Load all RDFa entities into VIE
    VIE.RDFaEntities.getInstances();

    // Make all RDFa entities editable
    jQuery('[typeof][about]').each(function() {
        jQuery(this).vieSemanticAloha();
    });

    jQuery('#savebutton').bind('click', function() {
        // Go through all Backbone model instances loaded for the page
        VIE.EntityManager.entities.each(function(objectInstance) {
            if (!VIE.AlohaEditable.refreshFromEditables(objectInstance)) {
                // No changes to this object, skip
                return true;
            }

            // Set the modified properties to the model instance
            objectInstance.save(null, {
                success: function(savedModel, response) {
                    alert(savedModel.id + " was saved, see JS console for details");
                    jQuery.each(modifiedProperties, function(propertyName, propertyValue) {
                        savedModel.editables[propertyName].setUnmodified();
                    });
                    jQuery('#savebutton').hide();
                },
                error: function(response) {
                    console.log("Save failed");
                }
            });
        });
    });

    GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,'editableActivated', function(){
        jQuery('#savebutton').show();
    });

});
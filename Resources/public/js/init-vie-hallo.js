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
        var containerInstance = VIE.RDFaEntities.getInstance(jQuery(this));
        if (!containerInstance) {
            return;
        }
        if (typeof containerInstance.editables === 'undefined') {
            containerInstance.editables = {};
        }

        VIE.RDFa.findPredicateElements(containerInstance.id, this, false).each(function() {
            var containerProperty = jQuery(this);

            var propertyName = containerProperty.attr('property');
            if (propertyName === undefined) {
                return true;
            }

            if (containerInstance.get(propertyName) instanceof Array) {
                // For now we don't deal with multivalued properties in Aloha
                return true;
            }

            containerInstance.editables[propertyName] = jQuery(this).hallo({ plugins: { 'halloformat': {} }, activated: function() { jQuery('#savebutton').show(); } });
            console.log(containerInstance.editables[propertyName]);
            containerInstance.editables[propertyName].vieContainerInstance = containerInstance;
        });
    });

    jQuery('#savebutton').bind('click', function() {
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
                    jQuery('#savebutton').hide();
                },
                error: function(response) {
                    console.log("Save failed");
                }
            });
        });
    });
});
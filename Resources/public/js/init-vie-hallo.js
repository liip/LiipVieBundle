jQuery(document).ready(function($) {

    var vie = new VIE();
    vie.EntityManager.entities.bind('add', function(model) {
        if (typeof model.id == 'string') {
            model.url = vie_phpcr_path + model.id.substring(1, model.id.length - 1);
            model.toJSON = model.toJSONLD;
        }
    });
    
    vie.use(new vie.RdfaService);

    vie.namespaces.add('sioc', 'http://rdfs.org/sioc/ns#');

    jQuery('[typeof][about]').each(function() {
        jQuery(this).vieSemanticHallo({
            vie: vie,
            plugins: {
                'dcterms:title': {
                    'hallooverlay': {},
                    'hallotoolbarlinebreak': {}
                },
                'default': {
                    'halloimage': { 'searchUrl': 'liip/vie/assets/search/', 'vie': vie },
                    'hallolink': {},
                    'halloheadings': {},
                    'halloformat': {'formattings': {'strikeThrough': false, 'underline': false}},
                    'hallolists': {'lists': {'ordered': false}},
                    'hallojustify': {},
                    'halloreundo': {},
                    'hallotoolbarlinebreak': { 'breakAfter': ['hallolink'] },
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
    $(this).bind('startPreventSave', function() {
        preventSave = true;
    });
    $(this).bind('stopPreventSave', function() {
        preventSave = false;
    });

    $(window).resize(function(){
        if(!$('.inEditMode')[0] == undefined ){
            $('.halloToolbar').css('left', $('.inEditMode')[0].offsetLeft);
        }
    });

    $('[contenteditable]').not('.inEditMode').hover(function(){
        $(document).trigger('startPreventSave');
        if(!$(this).hasClass('inEditMode')){
            var editButton = $('<div>edit</div>').addClass('editButton');
            $(this).append(editButton);
        }
    }, function(){
        $(document).trigger('stopPreventSave');
        $('.editButton').remove();
    });


    var preventSave = false;
    function vieSaveContent() {
        if (preventSave) {
            setTimeout(vieSaveContent, 5000);
            return;
        }

        // Go through all Backbone model instances loaded for the page
        vie.EntityManager.entities.each(function(objectInstance) {

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
});

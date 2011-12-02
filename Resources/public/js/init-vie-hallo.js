if (!VieBundle) {
    var VieBundle = {};
}

VieBundle.Hallo = function ($) {
    var vie;
    var preventSave = false;

    this.init = function () {
        VieBundle.Hallo.initVIE();

        VieBundle.Hallo.loadTags();

        VieBundle.Hallo.initMidgradEditable();
    };

    this.initVIE = function () {
        var vie = new VIE();
        vie.EntityManager.entities.bind('add', function(model) {
            if (typeof model.id == 'string') {
                model.url = vie_phpcr_path + model.id.substring(1, model.id.length - 1);
                model.toJSON = model.toJSONLD;
            }
        });

        vie.use(new vie.RdfaService);

        vie.namespaces.add('sioc', 'http://rdfs.org/sioc/ns#');

        vie.use(new vie.StanbolService({
            url: "http://cmf.lo/stanbol",
            proxyDisabled: true
        }));

        this.vie = vie;
    };

    this.initMidgradEditable = function () {
        var vie = this.vie;
        $('body').midgardEditable({
            vie: vie,
            editorOptions: {
                'dcterms:title': {
                    plugins: {
                        'hallooverlay': {},
                        'hallotoolbarlinebreak': {}
                    }
                },
                'default': {
                    plugins: {
                        'halloimage': { 'searchUrl': 'liip/vie/assets/search/', 'vie': vie },
                        'hallolink': {},
                        'halloheadings': {},
                        'halloformat': {'formattings': {'strikeThrough': false, 'underline': false}},
                        'hallolists': {'lists': {'ordered': false}},
                        'hallojustify': {},
                        'halloreundo': {},
                        'hallotoolbarlinebreak': { 'breakAfter': ['hallolink'] },
                        'hallooverlay': {}
                    },
                    floating: false,
                    showAlways: true
                }
            },
            deactivated: vieSaveContent
        });
    };

    this.vieSaveContent = function (event, args) {
        var preventSave = this.preventSave;
        if (preventSave) {
            setTimeout(this.vieSaveContent, 5000);
            return;
        }

        // Set the modified properties to the model instance
        args.instance.save(null, {
            success: function(savedModel, response) {
                $(document).trigger("vieSaveSuccess");
                console.log(savedModel.id + " was saved");
            },
            error: function(response) {
                console.log("Save failed");
                console.log(response);
            }
        });
    };

    this.setPreventSave = function (value) {
        this.preventSave = value;
    };

    this.initArticleTags = function (ref) {
        var vie = this.vie;

        $('#articleTags').tagsInput({
            width:'auto',
            height: 'auto',
            onAddTag: function (tag) {
                console.log(about);
                console.log(tag);

                var subject = vie.service('rdfa').getElementSubject(ref);
                var entity = vie.entities.get(subject);

                // convert to reference url
                if (!entity.isReference(tag)) {
                    tag = 'urn:tag:' + tag;
                }

                entity.attributes['<http://purl.org/dc/elements/1.1/subject>'].vie = vie;
                entity.attributes['<http://purl.org/dc/elements/1.1/subject>'].addOrUpdate({'@subject': tag});
            }
        });
    };

    this.initSuggestedTags = function () {
        $('#suggestedTags').tagsInput({
            width:'auto',
            height: 'auto',
            interactive: false
        });
    };

    this.loadTags = function () {
        var vie = this.vie;

        this.initSuggestedTags();

        $('[typeof][about]').each(function() {
            var that = this;

            VieBundle.Hallo.initArticleTags(that);

            // load article tags
            vie.load({element: that}).from('rdfa').execute().done(function(entities) {
                var tags = entities[0].attributes['<http://purl.org/dc/elements/1.1/subject>'].models;
                jQuery(tags).each(function (key, value) {
                    $('#articleTags').addTag(value.id);
                });
            });

            // load suggested tags
            var text = $(that).text();
            vie.analyze({element: $(that)}).using(['stanbol']).execute().success(function(enhancements) {
                return $(enhancements).each(function(i, e) {
                    if (e.attributes['<rdfschema:label>']) {
                        $('#suggestedTags').addTag(e.id);
                    }
                });
            }).fail(function(xhr) {
                console.log(xhr);
            });
        });

    };

    return this;
}(jQuery);

jQuery(document).ready(function ($) {

    VieBundle.Hallo.init();

    $(this).bind('startPreventSave', function() {
        VieBundle.Hallo.setPreventSave(true);
    });

    $(this).bind('stopPreventSave', function() {
        VieBundle.Hallo.setPreventSave(false);
    });

    $(window).resize(function(){
        if(!$('.inEditMode')[0] == undefined ){
            $('.halloToolbar').css('left', $('.inEditMode')[0].offsetLeft);
        }
    });

    $("#suggestedTags_tagsinput .tag span").live("click", function(){
        var tag = $(this).text();
        $('#articleTags').addTag($.trim(tag));
        $('#suggestedTags').removeTag($.trim(tag));
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

});

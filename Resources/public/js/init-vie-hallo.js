
if (!VieBundle) {
    var VieBundle = {};
}

VieBundle.Model = function(bundle, element) {

    this.bundle = bundle;
    this.element = element;
    this.vie = this.bundle.vie;

    // load entities with rdfa
    this.vie.load({element: element}).from('rdfa').execute();

    var subject = this.vie.service('rdfa').getElementSubject(element);
    this.entity = this.vie.entities.get(subject);

    // insert settings pane
    var id = subject.replace(/[^A-Za-z]/g, '-');
    this.element.prepend('<div class="hiddenfieldsContainer"><div class="hiddenfieldsToggle"></div><div class="hiddenfields"><div class="hiddenfieldsCloseButton"></div><h2>Article settings</h2><div id="articleTagsWrapper"><form><div class="articleTags"><h3>Article tags</h3><input type="text" id="' + id + '-articleTags" class="tags" value="" /></div><div class="articleSuggestedTags"><h3>Suggested tags</h3><input type="text" id="' + id + '-suggestedTags" class="tags" value="" /></div></form></div></div><div class="hiddenfieldsCloseCorner"></div></div>');
    this.articleTags = this.element.find('.articleTags input');
    this.suggestedTags = this.element.find('.articleSuggestedTags input');

    // bind toggle events for settings pane
    this.element.find('.hiddenfieldsToggle').click(function(event) {
        var context = $(this).closest('.hiddenfieldsContainer');
        $('.hiddenfields', context).show();
        $('.hiddenfieldsToggle', context).hide();
        $('.hiddenfieldsCloseCorner', context).show();
        $('.hiddenfieldsCloseButton', context).show();
    });

    var that = this;
    this.element.find('.hiddenfieldsCloseCorner, .hiddenfieldsCloseButton').click(function(event) {
        var context = $(this).closest('.hiddenfieldsContainer');
        $('.hiddenfields', context).hide();
        $('.hiddenfieldsToggle', context).show();
        $('.hiddenfieldsCloseCorner', context).hide();
        $('.hiddenfieldsCloseButton', context).hide();
        
        // save on close
        that.save();
    });

    // init tags
    this.initTags();
    this.loadTags();
    
    // init editor
    this.initEditable();
};

VieBundle.Model.prototype.tagLabel = function (value) {
    
    if (value.substring(0, 9) == '<urn:tag:') {
        value = value.substring(9, value.length - 1);
    }
    
    if (value.substring(0, 8) == '<http://') {
        value = value.substring(value.lastIndexOf('/') + 1, value.length - 1);
        value = value.replace(/_/g, ' ');
    }
    
    return value;
};

VieBundle.Model.prototype.initTags = function () {

    var that = this;

    this.articleTags.tagsInput({
        width:'auto',
        height: 'auto',
        onAddTag: function (tag) {

            var entity = that.entity;

            // convert to reference url
            if (!entity.isReference(tag)) {
                tag = 'urn:tag:' + tag;
            }

            // add tag to entity
            entity.attributes['<http://purl.org/dc/elements/1.1/subject>'].vie = that.vie;
            entity.attributes['<http://purl.org/dc/elements/1.1/subject>'].addOrUpdate({'@subject': tag});
        },
        onRemoveTag: function (tag) {

            // remove tag from entity
            that.entity.attributes['<http://purl.org/dc/elements/1.1/subject>'].remove(tag);
        },
        label: this.tagLabel
    });

    this.suggestedTags.tagsInput({
        width:'auto',
        height: 'auto',
        interactive: false,
        label: this.tagLabel
    });

    // add suggested tag on click to tags
    this.element.find('.articleSuggestedTags .tag span').live('click', function(){
        var tag = $(this).text();
        that.articleTags.addTag($(this).data('value'));
        that.suggestedTags.removeTag($.trim(tag));
    });
};

VieBundle.Model.prototype.loadTags = function () {

    var that = this;

    // load article tags
    var tags = this.entity.attributes['<http://purl.org/dc/elements/1.1/subject>'].models;
    jQuery(tags).each(function () {
        that.articleTags.addTag(this.id);
    });

    // load suggested tags
    var text = $(that.element).text();
    that.vie.analyze({element: $(that.element)}).using(['stanbol']).execute().success(function(enhancements) {
        return $(enhancements).each(function(i, e) {
            if (e.attributes['<rdfschema:label>']) {
                that.suggestedTags.addTag(e.id);
            }
        });
    }).fail(function(xhr) {
        console.log(xhr);
    });
};

VieBundle.Model.prototype.initEditable = function () {

    this.element.midgardEditable({
        vie: this.vie,
        model: this.entity,
        addButton: true,
        editorOptions: {
            'dcterms:title': {
                plugins: {
                    'hallooverlay': {},
                    'hallotoolbarlinebreak': {}
                }
            },
            'default': {
                plugins: {
                    'halloimage': { 'searchUrl': 'liip/vie/assets/search/', 'vie': this.vie },
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
        deactivated: $.proxy(this.save, this)
    });
};

VieBundle.Model.prototype.save = function () {

    // don't save if blocked by dragged images
    if (this.bundle.preventSave) {
        setTimeout(this.save, 5000);
        return;
    }

    // save the Backbone model
    this.entity.save(null, {
        success: function(model, response) {
            $(document).trigger("vieSaveSuccess");
            console.log(model.id + " was saved");
        },
        error: function(response) {
            console.log("Save failed");
            console.log(response);
        }
    });
};


VieBundle.Hallo = function () {

    this.preventSave = false;
    
    this.initVIE();

    var that = this;
    $('[typeof][about]').each(function() {
       
        var element = $(this);
        
        var model = new VieBundle.Model(that, element);
    });
};

VieBundle.Hallo.prototype.initVIE = function () {
    
    this.vie = new VIE();
    this.vie.EntityManager.entities.bind('add', function(model) {
        if (typeof model.id == 'string') {
            model.url = vie_phpcr_path + model.id.substring(1, model.id.length - 1);
            model.toJSON = model.toJSONLD;
        }
    });

    this.vie.use(new this.vie.RdfaService());

    this.vie.namespaces.add('sioc', 'http://rdfs.org/sioc/ns#');
    this.vie.namespaces.add('dc', 'http://purl.org/dc/elements/1.1/');

    this.vie.use(new this.vie.StanbolService({
        url: "http://cmf.lo/stanbol",
        proxyDisabled: true
    }));
};

VieBundle.Hallo.prototype.setPreventSave = function (value) {
    this.preventSave = value;
};


jQuery(document).ready(function ($) {

    var bundle = new VieBundle.Hallo();

    $(this).bind('startPreventSave', function() {
        bundle.setPreventSave(true);
    });

    $(this).bind('stopPreventSave', function() {
        bundle.setPreventSave(false);
    });

    $(window).resize(function() {
        if(!$('.inEditMode')[0] == undefined ){
            $('.halloToolbar').css('left', $('.inEditMode')[0].offsetLeft);
        }
    });

    // show edit button on hover
    $('[contenteditable]').not('.inEditMode').hover(function(){
        $(document).trigger('startPreventSave');
        if(!$(this).hasClass('inEditMode')){
            var editButton = $('<div>edit</div>').addClass('editButton');
            $(this).before(editButton);
        }
    }, function(){
        $(document).trigger('stopPreventSave');
        $('.editButton').remove();
    });
});

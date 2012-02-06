
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

    // init editor
    this.initEditable();
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
                    'halloimage': {
                        search: function (query, limit, offset, successCallback) {
                            limit = limit || 8;
                            offset = offset || 0;
                            jQuery.ajax({
                                type: "GET",
                                url: vie_plugins_image_search,
                                data: "query="+query+"&offset="+offset+"&limit="+limit,
                                success: successCallback
                            });
                        },
                        suggestions: function(tags, limit, offset, successCallback) {
                            limit = limit || 8;
                            offset = offset || 0;
                            return jQuery.ajax({
                                type: "GET",
                                url: "/app_dev.php/liip/vie/assets/list/",
                                data: "tags=" + tags + "&offset=" + offset + "&limit=" + limit,
                                success: successCallback
                            });
                        },
                        'vie': this.vie
                    },
                    'hallolink': { 'relatedUrl': vie_plugins_link_related_path },
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
        deactivated: $.proxy(this.save, this),
        enableEditor: function (options) {
            if (options.property == 'dc:subject') {
                return options.element.midgardTags(options);
            } else {
                return options.widget._enableHallo(options);
            }
        }
    });
};

VieBundle.Model.prototype.save = function () {

    // move hover back behind
    //$('.liipVieBundleContentEditableHover').css('z-index', '0');

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
        url: "http://dev.iks-project.eu:8080/",
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

    // edit hover
    var hover = $('<div class="liipVieBundleContentEditableHover" />');
    hover.hide();
    $('body').append(hover);

    // show edit button on hover
    $('[contenteditable]').not('.inEditMode').hover(function () {

        $(document).trigger('startPreventSave');

        var $this = $(this);

        if(!$this.hasClass('inEditMode')){
            var editButton = $('<div>edit</div>').addClass('editButton');
            $this.before(editButton);
        }

        var offset = $this.offset();
        hover.css({top: offset.top - 10, left: offset.left - 10});
        hover.width($this.width());
        hover.height($this.height());
        hover.show();

    }, function () {

        $(document).trigger('stopPreventSave');

        $('.editButton').remove();

        hover.hide();
    });
});


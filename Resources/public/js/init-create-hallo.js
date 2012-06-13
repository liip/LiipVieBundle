jQuery(document).ready(function() {
    jQuery('body').midgardCreate({
        url: function() {
            if (this.id) {
                return vie_phpcr_path + this.id.substring(1, this.id.length - 1);
            }
            return vie_phpcr_path;
        },
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
                    'halloformat': {'formattings': {'strikeThrough': false, 'underline': false}},
                    'halloblock': {},
                    'hallolists': {'lists': {'ordered': false}},
                    'hallojustify': {},
                    'hallotoolbarlinebreak': { 'breakAfter': ['hallolink'] },
                    'hallooverlay': {}
                },
                floating: false,
                fixed: false,
                parentElement: "body",
                showAlways: true
            }
        },
        stanbolUrl: 'http://dev.iks-project.eu:8080',
        tags: true
    });
});

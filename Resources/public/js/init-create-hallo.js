jQuery(document).ready(function() {
    jQuery('body').midgardCreate({
        url: function() {
            if (this.id) {
                return vie_phpcr_path + this.id.substring(1, this.id.length - 1);
            }
            return vie_phpcr_path;
        },
        stanbolUrl: vie_stanbol_url,
        tags: true
    });

    jQuery('body').midgardCreate('configureEditor', 'title', 'halloWidget', {
        plugins: {
            'hallooverlay': {},
            'hallotoolbarlinebreak': {},
            'halloindicator': {}
        },
        floating: false,
        fixed: true,
        parentElement: "body",
        showAlways: true
    });
    jQuery('body').midgardCreate('configureEditor', 'default', 'halloWidget', {
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
                // TODO: this only brings an empty suggestions tab instead of calling the function
                // suggestions: function(tags, limit, offset, successCallback) {
                //     limit = limit || 8;
                //     offset = offset || 0;
                //     return jQuery.ajax({
                //         type: "GET",
                //         url: "/app_dev.php/liip/vie/assets/list/",
                //         data: "tags=" + tags + "&offset=" + offset + "&limit=" + limit,
                //         success: successCallback
                //     });
                // },
                uploadUrl: hallo_image_upload,
                'vie': this.vie
            },
            'hallolink': { 'relatedUrl': vie_plugins_link_related_path },
            'halloformat': {'formattings': {'strikeThrough': false, 'underline': false}},
            'halloblock': {},
            'hallolists': {'lists': {'ordered': false}},
            'hallojustify': {},
            'hallotoolbarlinebreak': { 'breakAfter': ['hallolink'] },
            'hallooverlay': {},
            'halloindicator': {}
        },
        floating: false,
        fixed: true,
        parentElement: "body",
        showAlways: true
    });

    jQuery('body').midgardCreate('setEditorForProperty', 'dcterms:title', 'title');
    jQuery('body').midgardCreate('setEditorForProperty', 'default', 'default');
});

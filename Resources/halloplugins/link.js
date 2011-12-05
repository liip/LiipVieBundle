(function (jQuery) {
    return jQuery.widget("Liip.hallolink", {
        options: {
            editable: null,
            toolbar: null,
            uuid: "link",
            link: true,
            image: true,
            defaultUrl: 'http://',
            dialog: 'link',
            dialogOpts: {
                autoOpen: false,
                width: 500,
                height: 195,
                title: "Enter Link",
                modal: true,
                resizable: false,
                draggable: false,
                dialogClass: 'hallolink-dialog'
            }
        },

        _create: function () {
            var buttonize, buttonset, dialog, dialogId, dialogSubmitCb, urlInput, widget;
            var _this = this;
            widget = this;
            dialogId = "" + this.options.dialog + "-dialog";
            dialog = jQuery("<div id=\"" + dialogId + "\"><div class=\"nav\"><ul class=\"tabs\"><li id=\"" + this.options.uuid + "-tab-insert\">Insert URL</li><li id=\"" + this.options.uuid + "-tab-suggested\">Suggested URLs</li></ul></div><div id=\"" + this.options.uuid + "-tab-insert-content\" class=\"" + dialogId + "-tab\"><form action=\"#\" method=\"post\" class=\"linkForm\"><input class=\"url\" type=\"text\" name=\"url\" value=\"" + this.options.defaultUrl + "\" /><input type=\"submit\" id=\"addlinkButton\" value=\"Insert\" /></form></div><div id=\"" + this.options.uuid + "-tab-suggested-content\" class=\"" + dialogId + "-tab\"><div class=\"scrollable\"><ul></ul></div></div></div>");
            urlInput = jQuery('input[name=url]', dialog).focus(function (e) {
                return this.select();
            });

            // show or hide tab panels
            jQuery('#link-dialog .nav li').live('click', function () {
                jQuery('.' + dialogId + '-tab').each(function () {
                    return jQuery(this).hide();
                });
                id = jQuery(this).attr('id');
                jQuery('#' + id + '-content').show();
                //return jQuery("#" + widget.options.uuid + "-tab-activeIndicator").css("margin-left", jQuery(this).position().left + (jQuery(this).width() / 2));
            });
            
            // Action when user clicks on a suggested link
            jQuery('#'+ this.options.uuid + '-tab-suggested-content li a').live('click', function (event) {
                event.preventDefault();
                jQuery('input[name=url]', dialog).val(this.href);
                dialog.find('form').trigger('submit');
                jQuery('#link-dialog .nav li').first().trigger('click');
            });
            
            // if user clicks on the suggestet links tab
            jQuery('#' + this.options.uuid + '-tab-suggested').live('click', function () {
                var articleTags = [];
                var tmpArticleTags;
                var tagType;
                tmpArticleTags = jQuery('.inEditMode').parent().find('.articleTags input').val();
                /*tmpArticleTags = tmpArticleTags.replace(/</g, '');
                tmpArticleTags = tmpArticleTags.replace(/>/g, '');*/
                // uri = uri.replace(/^</, '').replace(/>$/, '');
                tmpArticleTags = tmpArticleTags.split(',');
                
                for(var i in tmpArticleTags) {
                    tagType = typeof tmpArticleTags[i];
                    if('string' === tagType) {
                        if(tmpArticleTags[i].indexOf('http') !== -1) articleTags.push(tmpArticleTags[i]);
                    }
                }
                
                var vie = new VIE();
                /*vie.use(new vie.StanbolService({
                    url: "http://localhost:9090",
                    proxyDisabled: true
                }));*/
                vie.use(new vie.DBPediaService({
                    url : "http://dev.iks-project.eu/stanbolfull",
                    proxyDisabled: true
                }));
                //vie.use(new vie.DBPediaService({proxyUrl: 'http://cmf.lo/stanbol'}));
                //vie.use(new vie.StanbolService, 'dbpedia');
                jQuery('#' + _this.options.uuid + "-tab-suggested-content ul").empty();
                jQuery(articleTags).each(function () {  
                    vie.load({
                            entity: this + ""
                        }).
                        using('dbpedia').
                        execute().
                        done(function(entity) {
                            jQuery(entity).each(function () {
                                if (this.attributes['<http://xmlns.com/foaf/0.1/primaryTopic>'] || this.attributes['http://xmlns.com/foaf/0.1/homepage']) {
                                    var url = this.id.substring(1, this.id.length - 1);
                                    jQuery('#' + _this.options.uuid + "-tab-suggested-content ul").append('<li><a href="' + url + '">' + url + '</a></li>');
                                }
                            });
                        });
                });
            });

            dialogSubmitCb = function () {
                var link;
                link = urlInput.val();
                widget.options.editable.restoreSelection(widget.lastSelection);
                if (((new RegExp(/^\s*$/)).test(link)) || link === widget.options.defaultUrl) {
                    if (widget.lastSelection.collapsed) {
                        widget.lastSelection.setStartBefore(widget.lastSelection.startContainer);
                        widget.lastSelection.setEndAfter(widget.lastSelection.startContainer);
                        window.getSelection().addRange(widget.lastSelection);
                    }
                    document.execCommand("unlink", null, "");
                } else {
                    if (widget.lastSelection.startContainer.parentNode.href === void 0) {
                        document.execCommand("createLink", null, link);
                    } else {
                        widget.lastSelection.startContainer.parentNode.href = link;
                    }
                }
                widget.options.editable.element.trigger('change');
                widget.options.editable.removeAllSelections();
                dialog.dialog('close');
                return false;
            };
            dialog.find("form").submit(dialogSubmitCb);
            buttonset = jQuery("<span class=\"" + widget.widgetName + "\"></span>");
            buttonize = function (type) {
                var button, id;
                id = "" + _this.options.uuid + "-" + type;
                buttonset.append(jQuery("<input id=\"" + id + "\" type=\"checkbox\" /><label for=\"" + id + "\" class=\"anchor_button\" >" + type + "</label>").button());
                button = jQuery("#" + id, buttonset);
                button.bind("change", function (event) {
                    widget.lastSelection = widget.options.editable.getSelection();
                    urlInput = jQuery('input[name=url]', dialog);
                    if (widget.lastSelection.startContainer.parentNode.href === void 0) {
                        urlInput.val(widget.options.defaultUrl);
                    } else {
                        urlInput.val(jQuery(widget.lastSelection.startContainer.parentNode).attr('href'));
                        jQuery(urlInput[0].form).find('input[type=submit]').val('update');
                    }
                    return dialog.dialog('open');
                });
                return _this.element.bind("keyup paste change mouseup", function (event) {
                    var nodeName, start;
                    start = jQuery(widget.options.editable.getSelection().startContainer);
                    nodeName = start.prop('nodeName') ? start.prop('nodeName') : start.parent().prop('nodeName');
                    if (nodeName && nodeName.toUpperCase() === "A") {
                        button.attr("checked", true);
                        button.next().addClass("ui-state-clicked");
                        return button.button("refresh");
                    } else {
                        button.attr("checked", false);
                        button.next().removeClass("ui-state-clicked");
                        return button.button("refresh");
                    }
                });
            };
            if (this.options.link) buttonize("A");
            if (this.options.link) {
                buttonset.buttonset();
                this.options.toolbar.append(buttonset);
                return dialog.dialog(this.options.dialogOpts);
            }
        },
        _init: function () {
            var firstTab = jQuery('#link-dialog .nav li').first().attr("id");
            jQuery('#' + firstTab + '-content').show();
        }
    });
})(jQuery);
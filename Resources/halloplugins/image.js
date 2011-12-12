(function () {
    (function (jQuery) {
        return jQuery.widget("Liip.halloimage", {
            options: {
                editable: null,
                toolbar: null,
                uuid: "",
                searchUrl: "",
                dialogOpts: {
                    autoOpen: false,
                    width: 270,
                    height: 'auto',
                    title: "Insert Images",
                    modal: false,
                    resizable: false,
                    draggable: true,
                    dialogClass: 'halloimage-dialog',
                    close: function (ev, ui) {
                        return jQuery('.image_button').removeClass('ui-state-clicked');
                    }
                },
                dialog: null
            },
            _create: function () {
                var button, buttonset, dialogId, id, insertImage, widget;
                
                widget = this;
                dialogId = "" + this.options.uuid + "-image-dialog";
                this.options.dialog = jQuery("<div id=\"" + dialogId + "\">                        <div class=\"nav\">                                <ul class=\"tabs\">                                        <li id=\"" + this.options.uuid + "-tab-suggestions\"><img src=\"/bundles/liipvie/img/tabicon_suggestions.png\" /> Suggestions</li>                                        <li id=\"" + this.options.uuid + "-tab-search\"><img src=\"/bundles/liipvie/img/tabicon_search.png\" /> Search</li>                                        <li id=\"" + this.options.uuid + "-tab-upload\"><img src=\"/bundles/liipvie/img/tabicon_upload.png\" /> Upload</li>                                </ul>                                <img src=\"/bundles/liipvie/img/arrow.png\" id=\"" + this.options.uuid + "-tab-activeIndicator\" class=\"tab-activeIndicator\" />                        </div>                        <div class=\"dialogcontent\">                                <div id=\"" + this.options.uuid + "-tab-suggestions-content\" class=\"" + widget.widgetName + "-tab tab-suggestions\">                                        <div class=\"imageThumbnailContainer fixed\"><div id=\"activitySpinner\">Loading Images...</div><ul><li><img src=\"http://imagesus.homeaway.com/mda01/badf2e69babf2f6a0e4b680fc373c041c705b891\" class=\"imageThumbnail imageThumbnailActive\" /> </li></ul><br style=\"clear:both\"/>                                                                                                                                    </div>                                        <div class=\"activeImageContainer\">                                                <div class=\"rotationWrapper\">                                                        <div class=\"hintArrow\"></div>                                                        <img src=\"\" id=\"" + this.options.uuid + "-sugg-activeImage\" class=\"activeImage\" />                                                </div>                                                <img src=\"\" id=\"" + this.options.uuid + "-sugg-activeImageBg\" class=\"activeImage activeImageBg\" />                                        </div>                                        <div class=\"metadata\">                                                <label for=\"caption-sugg\">Caption</label><input type=\"text\" id=\"caption-sugg\" />                                                <!--<button id=\"" + this.options.uuid + "-" + widget.widgetName + "-addimage\">Add Image</button>-->                                        </div>                                </div>                                <div id=\"" + this.options.uuid + "-tab-search-content\" class=\"" + widget.widgetName + "-tab tab-search\">                                        <form action=\"" + widget.options.searchUrl + "/?page=1&length=8\" type=\"get\" id=\"" + this.options.uuid + "-" + widget.widgetName + "-searchForm\">                                                <input type=\"text\" class=\"searchInput\" /><input type=\"submit\" id=\"" + this.options.uuid + "-" + widget.widgetName + "-searchButton\" class=\"button searchButton\" value=\"OK\"/>                                        </form>                                        <div class=\"searchResults imageThumbnailContainer\"></div>                                        <div id=\"" + this.options.uuid + "-search-activeImageContainer\" class=\"search-activeImageContainer activeImageContainer\">                                                <div class=\"rotationWrapper\">                                                        <div class=\"hintArrow\"></div>                                                        <img src=\"\" id=\"" + this.options.uuid + "-search-activeImageBg\" class=\"activeImage\" />                                                </div>                                                <img src=\"\" id=\"" + this.options.uuid + "-search-activeImage\" class=\"activeImage activeImageBg\" />                                        </div>                                        <div class=\"metadata\" id=\"metadata-search\" style=\"display: none;\">                                                <label for=\"caption-search\">Caption</label><input type=\"text\" id=\"caption-search\" />                                                <!--<button id=\"" + this.options.uuid + "-" + widget.widgetName + "-addimage\">Add Image</button>-->                                        </div>                                </div>                                <div id=\"" + this.options.uuid + "-tab-upload-content\" class=\"" + widget.widgetName + "-tab tab-upload\">UPLOAD</div>                        </div></div>");
                jQuery(".tab-search form", this.options.dialog).submit(function (event) {
                    var search, showResults, that;
                    event.preventDefault();
                    that = this;
                    showResults = function (response) {
                        var container, firstimage, items;
                        items = [];
                        items.push("<div class=\"pager-prev\" style=\"display:none\"></div>");
                        $.each(response.assets, function (key, val) {
                            return items.push("<img src=\"" + val.url + "\" class=\"imageThumbnail " + widget.widgetName + "-search-imageThumbnail\" /> ");
                        });
                        items.push("<div class=\"pager-next\" style=\"display:none\"></div>");
                        container = jQuery("#" + dialogId + " .tab-search .searchResults");
                        container.html(items.join(''));
                        if (response.page > 1) {
                            jQuery('.pager-prev', container).show();
                        }
                        if (response.page < Math.ceil(response.total / response.length)) {
                            jQuery('.pager-next', container).show();
                        }
                        jQuery('.pager-prev', container).click(function (event) {
                            return search(response.page - 1);
                        });
                        jQuery('.pager-next', container).click(function (event) {
                            return search(response.page + 1);
                        });
                        jQuery("#" + widget.options.uuid + "-search-activeImageContainer").show();
                        firstimage = jQuery("." + widget.widgetName + "-search-imageThumbnail").first().addClass("imageThumbnailActive");
                        jQuery("#" + widget.options.uuid + "-search-activeImage, #" + widget.options.uuid + "-search-activeImageBg").attr("src", firstimage.attr("src"));
                        return jQuery("#metadata-search").show();
                    };
                    search = function (page) {
                        page = page || 1;
                        return jQuery.ajax({
                            type: "GET",
                            url: widget.options.searchUrl,
                            data: "page=" + page + "&length=8",
                            success: showResults
                        });
                    };
                    return search();
                });
                
                insertImage = function () {
                    var img, triggerModified;
                    try {
                        if (!widget.options.editable.getSelection()) {
                            throw new Error("SelectionNotSet");
                        }
                    } catch (error) {
                        widget.options.editable.restoreSelection(widget.lastSelection);
                    }
                    document.execCommand("insertImage", null, $(this).attr('src'));
                    img = document.getSelection().anchorNode.firstChild;
                    jQuery(img).attr("alt", jQuery(".caption").value);
                    triggerModified = function () {
                        return widget.element.trigger("hallomodified");
                    };
                    window.setTimeout(triggerModified, 100);
                    return widget._closeDialog();
                };
                
                this.options.dialog.find(".halloimage-activeImage, #" + widget.options.uuid + "-" + widget.widgetName + "-addimage").click(insertImage);
                buttonset = jQuery("<span class=\"" + widget.widgetName + "\"></span>");
                id = "" + this.options.uuid + "-image";
                buttonset.append(jQuery("<input id=\"" + id + "\" type=\"checkbox\" /><label for=\"" + id + "\" class=\"image_button\" >Image</label>").button());
                button = jQuery("#" + id, buttonset);
                button.bind("change", function (event) {
                    if (widget.options.dialog.dialog("isOpen")) {
                        return widget._closeDialog();
                    } else {
                        return widget._openDialog();
                    }
                });
                this.options.editable.element.bind("hallodeactivated", function (event) {
                    return widget._closeDialog();
                });
                jQuery(this.options.editable.element).delegate("img", "click", function (event) {
                    return widget._openDialog();
                });
                jQuery(this.options.dialog).find(".nav li").click(function () {
                    jQuery("." + widget.widgetName + "-tab").each(function () {
                        return jQuery(this).hide();
                    });
                    id = jQuery(this).attr("id");
                    jQuery("#" + id + "-content").show();
                    return jQuery("#" + widget.options.uuid + "-tab-activeIndicator").css("margin-left", jQuery(this).position().left + (jQuery(this).width() / 2));
                });
                jQuery("." + widget.widgetName + "-tab .imageThumbnail").live("click", function (event) {
                    var scope;
                    scope = jQuery(this).closest("." + widget.widgetName + "-tab");
                    jQuery(".imageThumbnail", scope).removeClass("imageThumbnailActive");
                    jQuery(this).addClass("imageThumbnailActive");
                    jQuery(".activeImage", scope).attr("src", jQuery(this).attr("src"));
                    return jQuery(".activeImageBg", scope).attr("src", jQuery(this).attr("src"));
                });
                buttonset.buttonset();
                this.options.toolbar.append(buttonset);
                this.options.dialog.dialog(this.options.dialogOpts);
                return this._addDragnDrop();
            },
            _init: function () {},
            _openDialog: function () {
                var xposition, yposition, responseType, cleanUp, thumbnails, thumbId, run, invalidThumbs;
                
                cleanUp = function () {
                    thumbnails = jQuery('.imageThumbnail');
                    invalidThumbs = [];
                    jQuery(thumbnails).each(function () {
                        invalidThumbs.push(this.id);
                        jQuery('#' + this.id).load(function() {
                            invalidThumbs.remove(this.id);
                        });
                    });
                    
                    window.setTimeout(function() {  
                        jQuery.each(invalidThumbs, function (i,v) {
                            jQuery('#' + v).parent('li').remove();
                        }); 
                    }, 2000);
                }

                jQuery('.image_button').addClass('ui-state-clicked');
                jQuery("#" + this.options.uuid + "-sugg-activeImage").attr("src", jQuery("#" + this.options.uuid + "-tab-suggestions-content .imageThumbnailActive").first().attr("src"));
                jQuery("#" + this.options.uuid + "-sugg-activeImageBg").attr("src", jQuery("#" + this.options.uuid + "-tab-suggestions-content .imageThumbnailActive").first().attr("src"));
                
                this.lastSelection = this.options.editable.getSelection();
                
                xposition = jQuery(this.options.editable.element).offset().left + jQuery(this.options.editable.element).outerWidth() - 3;
                yposition = jQuery(this.options.toolbar).offset().top - jQuery(document).scrollTop() - 29;
                this.options.dialog.dialog("option", "position", [xposition, yposition]);
                
                var articleTags = [];
                var tmpArticleTags, tagType;
                jQuery('#activitySpinner').show();
                tmpArticleTags = jQuery('.inEditMode').parent().find('.articleTags input').val();
                tmpArticleTags = tmpArticleTags.split(',');

                for(var i in tmpArticleTags) {
                    tagType = typeof tmpArticleTags[i];
                    if('string' === tagType) {
                        if(tmpArticleTags[i].indexOf('http') !== -1) articleTags.push(tmpArticleTags[i]);
                    }
                }

                var vie = new VIE();

                vie.use(new vie.DBPediaService({
                    url : "http://dev.iks-project.eu/stanbolfull",
                    proxyDisabled: true
                }));

                jQuery('.imageThumbnailContainer ul').empty();
                thumbId = 1;
                run = 1;
                if ( articleTags.length === 0) jQuery('#activitySpinner').html('No images found.');

                jQuery(articleTags).each(function () {
                    vie.load({
                            entity: this + ""
                        }).
                        using('dbpedia').
                        execute().
                        done(function(entity) {
                            jQuery(entity).each(function () {
                                if (this.attributes['<http://dbpedia.org/ontology/thumbnail>']) {
                                    responseType = typeof(this.attributes['<http://dbpedia.org/ontology/thumbnail>']);
                                    if(responseType === 'string') {
                                        var img = this.attributes['<http://dbpedia.org/ontology/thumbnail>'];
                                        img = img.substring(1, img.length - 1);
                                    }
                                    if(responseType === 'object') {
                                        var img = '';
                                        img = this.attributes['<http://dbpedia.org/ontology/thumbnail>'][0].value;
                                    }
                                    
                                    jQuery('.imageThumbnailContainer ul').append('<li><img id="si-' + thumbId + '" src="' + img + '" class="imageThumbnail"></li>');
                                    thumbId++;
                                }
                            });
                            
                            if (run === articleTags.length) {
                                cleanUp();
                            }
                            run++;
                            jQuery('#activitySpinner').hide();
                        });
                });

                return this.options.dialog.dialog("open");
            },
            _closeDialog: function () {
                return this.options.dialog.dialog("close");
            },
            _addDragnDrop: function () {
                var dnd, draggables, editable, helper, offset, overlay, overlayMiddleConfig, third, widgetOptions;
                helper = {
                    delayAction: function (functionToCall, delay) {
                        var timer;
                        timer = clearTimeout(timer);
                        if (!timer) {
                            return timer = setTimeout(functionToCall, delay);
                        }
                    },
                    calcPosition: function (offset, event) {
                        var position;
                        position = offset.left + third;
                        if (event.pageX >= position && event.pageX <= (offset.left + third * 2)) {
                            return "middle";
                        } else if (event.pageX < position) {
                            return "left";
                        } else {
                            if (event.pageX > (offset.left + third * 2)) {
                                return "right";
                            }
                        }
                    },
                    createInsertElement: function (image, tmp) {
                        var altText, imageInsert, tmpImg, width, height, maxWidth, maxHeight, ratio;
                        maxWidth = 250;
                        maxHeight = 250;
                        tmpImg = new Image();
                        tmpImg.src = image.src;
                        if (!tmp) {
                            if (this.startPlace.parents(".tab-suggestions").length > 0) {
                                altText = jQuery("#caption-sugg").val();
                            } else if (this.startPlace.parents(".tab-search").length > 0) {
                                altText = jQuery("#caption-search").val();
                            } else {
                                altText = jQuery(image).attr("alt");
                            }
                        }
                        width = tmpImg.width;
                        height = tmpImg.height;
                        if (width > maxWidth || height > maxHeight) {
                            if (width > height) {
                                ratio = (tmpImg.width/maxWidth).toFixed();
                            } else {
                                ratio = (tmpImg.height/maxHeight).toFixed();
                            }
                            width = (tmpImg.width/ratio).toFixed();
                            height = (tmpImg.height/ratio).toFixed();
                        }
                        imageInsert = $("<img>").attr({
                            src: tmpImg.src,
                            width: width,
                            height: height,
                            alt: altText,
                            "class": (tmp ? "tmp" : "")
                        }).show();
                        return imageInsert;
                    },
                    createLineFeedbackElement: function () {
                        return $("<div/>").addClass("tmpLine");
                    },
                    removeFeedbackElements: function () {
                        return $('.tmp, .tmpLine', editable).remove();
                    },
                    removeCustomHelper: function () {
                        return $('.customHelper').remove();
                    },
                    showOverlay: function (position) {
                        var eHeight;
                        eHeight = editable.height() + parseFloat(editable.css('paddingTop')) + parseFloat(editable.css('paddingBottom'));
                        overlay.big.css({
                            height: eHeight
                        });
                        overlay.left.css({
                            height: eHeight
                        });
                        overlay.right.css({
                            height: eHeight
                        });
                        switch (position) {
                        case "left":
                            overlay.big.addClass("bigOverlayLeft").removeClass("bigOverlayRight").css({
                                left: third
                            }).show();
                            overlay.left.hide();
                            return overlay.right.hide();
                        case "middle":
                            overlay.big.removeClass("bigOverlayLeft bigOverlayRight");
                            overlay.big.hide();
                            overlay.left.show();
                            return overlay.right.show();
                        case "right":
                            overlay.big.addClass("bigOverlayRight").removeClass("bigOverlayLeft").css({
                                left: 0
                            }).show();
                            overlay.left.hide();
                            return overlay.right.hide();
                        }
                    },
                    checkOrigin: function (event) {
                        if ($(event.target).parents("[contenteditable]").length !== 0) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    startPlace: ""
                };
                dnd = {
                    createTmpFeedback: function (image, position) {
                        var el;
                        if (position === 'middle') {
                            return helper.createLineFeedbackElement();
                        } else {
                            el = helper.createInsertElement(image, true);
                            return el.addClass("inlineImage-" + position);
                        }
                    },
                    handleOverEvent: function (event, ui) {
                        var postPone;
                        postPone = function () {
                            var position;
                            window.waitWithTrash = clearTimeout(window.waitWithTrash);
                            position = helper.calcPosition(offset, event);
                            $('.trashcan', ui.helper).remove();
                            editable.append(overlay.big);
                            editable.append(overlay.left);
                            editable.append(overlay.right);
                            helper.removeFeedbackElements();
                            $(event.target).prepend(dnd.createTmpFeedback(ui.draggable[0], position));
                            if (position === "middle") {
                                $(event.target).prepend(dnd.createTmpFeedback(ui.draggable[0], 'right'));
                                $('.tmp', $(event.target)).hide();
                            } else {
                                $(event.target).prepend(dnd.createTmpFeedback(ui.draggable[0], 'middle'));
                                $('.tmpLine', $(event.target)).hide();
                            }
                            return helper.showOverlay(position);
                        };
                        return setTimeout(postPone, 5);
                    },
                    handleDragEvent: function (event, ui) {
                        var position, tmpFeedbackLR, tmpFeedbackMiddle;
                        position = helper.calcPosition(offset, event);
                        if (position === dnd.lastPositionDrag) {
                            return;
                        }
                        dnd.lastPositionDrag = position;
                        tmpFeedbackLR = $('.tmp', editable);
                        tmpFeedbackMiddle = $('.tmpLine', editable);
                        if (position === "middle") {
                            tmpFeedbackMiddle.show();
                            tmpFeedbackLR.hide();
                        } else {
                            tmpFeedbackMiddle.hide();
                            tmpFeedbackLR.removeClass("inlineImage-left inlineImage-right").addClass("inlineImage-" + position).show();
                        }
                        return helper.showOverlay(position);
                    },
                    handleLeaveEvent: function (event, ui) {
                        var func;
                        func = function () {
                            if (!$('div.trashcan', ui.helper).length) {
                                $(ui.helper).append($('<div class="trashcan"></div>'));
                            }
                            return $('.bigOverlay, .smallOverlay').remove();
                        };
                        window.waitWithTrash = setTimeout(func, 200);
                        return helper.removeFeedbackElements();
                    },
                    handleStartEvent: function (event, ui) {
                        var internalDrop;
                        internalDrop = helper.checkOrigin(event);
                        if (internalDrop) {
                            $(event.target).remove();
                        }
                        jQuery(document).trigger('startPreventSave');
                        return helper.startPlace = jQuery(event.target);
                    },
                    handleStopEvent: function (event, ui) {
                        var internalDrop;
                        internalDrop = helper.checkOrigin(event);
                        if (internalDrop) {
                            $(event.target).remove();
                        } else {
                            editable.trigger('change');
                        }
                        overlay.big.hide();
                        overlay.left.hide();
                        overlay.right.hide();
                        return $(document).trigger('stopPreventSave');
                    },
                    handleDropEvent: function (event, ui) {
                        var imageInsert, internalDrop, position;
                        internalDrop = helper.checkOrigin(event);
                        position = helper.calcPosition(offset, event);
                        helper.removeFeedbackElements();
                        helper.removeCustomHelper();
                        imageInsert = helper.createInsertElement(ui.draggable[0], false);
                        if (position === "middle") {
                            imageInsert.show();
                            imageInsert.removeClass("inlineImage-middle inlineImage-left inlineImage-right").addClass("inlineImage-" + position).css({
                                position: "relative",
                                left: ((editable.width() + parseFloat(editable.css('paddingLeft')) + parseFloat(editable.css('paddingRight'))) - imageInsert.attr('width')) / 2
                            });
                            imageInsert.insertBefore($(event.target));
                        } else {
                            imageInsert.removeClass("inlineImage-middle inlineImage-left inlineImage-right").addClass("inlineImage-" + position).css("display", "block");
                            $(event.target).prepend(imageInsert);
                        }
                        overlay.big.hide();
                        overlay.left.hide();
                        overlay.right.hide();
                        editable.trigger('change');
                        return dnd.init(editable);
                    },
                    createHelper: function (event) {
                        return $('<div>').css({
                            backgroundImage: "url(" + $(event.currentTarget).attr('src') + ")"
                        }).addClass('customHelper').appendTo('body');
                    },
                    init: function () {
                        var draggable, initDraggable;
                        draggable = [];
                        initDraggable = function (elem) {
                            if (!elem.jquery_draggable_initialized) {
                                elem.jquery_draggable_initialized = true;
                                $(elem).draggable({
                                    cursor: "move",
                                    helper: dnd.createHelper,
                                    drag: dnd.handleDragEvent,
                                    start: dnd.handleStartEvent,
                                    stop: dnd.handleStopEvent,
                                    disabled: !editable.hasClass('inEditMode'),
                                    cursorAt: {
                                        top: 50,
                                        left: 50
                                    }
                                });
                            }
                            return draggables.push(elem);
                        };
                        $(".rotationWrapper img", widgetOptions.dialog).each(function (index, elem) {
                            if (!elem.jquery_draggable_initialized) {
                                return initDraggable(elem);
                            }
                        });
                        $("img", editable).each(function (index, elem) {
                            elem.contentEditable = false;
                            if (!elem.jquery_draggable_initialized) {
                                return initDraggable(elem);
                            }
                        });
                        return $("p", editable).each(function (index, elem) {
                            if (!elem.jquery_droppable_initialized) {
                                elem.jquery_droppable_initialized = true;
                                return $('p', editable).droppable({
                                    tolerance: "pointer",
                                    drop: dnd.handleDropEvent,
                                    over: dnd.handleOverEvent,
                                    out: dnd.handleLeaveEvent
                                });
                            }
                        });
                    },
                    enableDragging: function () {
                        return jQuery.each(draggables, function (index, d) {
                            return jQuery(d).draggable('option', 'disabled', false);
                        });
                    },
                    disableDragging: function () {
                        return jQuery.each(draggables, function (index, d) {
                            return jQuery(d).draggable('option', 'disabled', true);
                        });
                    }
                };
                draggables = [];
                editable = $(this.options.editable.element);
                widgetOptions = this.options;
                offset = editable.offset();
                third = parseFloat(editable.width() / 3);
                overlayMiddleConfig = {
                    width: third,
                    height: editable.height()
                };
                overlay = {
                    big: $("<div/>").addClass("bigOverlay").css({
                        width: third * 2,
                        height: editable.height()
                    }),
                    left: $("<div/>").addClass("smallOverlay smallOverlayLeft").css(overlayMiddleConfig),
                    right: $("<div/>").addClass("smallOverlay smallOverlayRight").css(overlayMiddleConfig).css("left", third * 2)
                };
                dnd.init();
                editable.bind('halloactivated', dnd.enableDragging);
                return editable.bind('hallodeactivated', dnd.disableDragging);
            }
        });
    })(jQuery);
}).call(this);
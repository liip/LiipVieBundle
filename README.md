Introduction
============

VIE is a way to make any site using RDFa editable.

For more information see http://wiki.iks-project.eu/index.php/Semantic_Editor

Installation
============

This bundle is best included using Composer.

Edit your project composer file to add a new require for liip/vie-bundle.
Then create a scripts section or add to the existing one:

    "scripts": {
        "post-install-cmd": [
            "Liip\\VieBundle\\Composer\\ScriptHandler::initSubmodules",
            ...
        ],
        "post-update-cmd": [
            "Liip\\VieBundle\\Composer\\ScriptHandler::initSubmodules",
            ...
        ]
    },

Add this bundle to your application's kernel:

    // application/ApplicationKernel.php
    public function registerBundles()
    {
        return array(
            // ...
            new Liip\VieBundle\LiipVieBundle(),
            // ...
        );
    }

Add a mapping to the `config.yml` and enable a controller

        liip_vie:
            phpcr_odm: true
            #orm: my_document_manager
            map:
                '<sioc:Post>': 'Liip\HelloBundle\Document\Article'
            base_path: /cms/routes
            cms_path: /cms/content/static
            # stanbol_url: custom stanbol url, otherwise defaults to the demo install

Currently you need to provide a route called hallo_image_upload that can handle
post of images. See the ImageController in the cmf sandbox for an example.

Finally add the relevant routing to your configuration

        <import resource="liip_vie.phpcr.controller" type="rest" />

        vie:
            resource: "@LiipVieBundle/Resources/config/routing/phpcr_odm.xml"

Optional: Aloha Editor (this bundle comes with the hallo editor, but if you prefer you can also use aloha)

        To use the Aloha editor with this bundle, download the files here: https://github.com/alohaeditor/Aloha-Editor/downloads/aloha-0.9.3.zip
        Unzip the contents of the "aloha" subfolder of this zip as folder vendor/bundles/Liip/VieBundle/vendor/aloha
        Make sure you have just one aloha folder with the js, not aloha/aloha/... - you should have vendor/bundles/Liip/VieBundle/vendor/aloha/aloha.js


Usage
=====

Adjust your template to load the editor js files if the current session is allowed to edit content.

    {% render "liip_vie.controller.vie:includeJSFilesAction" %}

Plus include the css files from Resources/public/css.

The other thing you have to do is adjusting your templates to include semantic RDFa annotations so VIE knows what content is editable.
For an example RDFa annotation, see the cmf sandbox template:
https://github.com/symfony-cmf/cmf-sandbox/blob/master/src/Sandbox/MainBundle/Resources/views/EditableStaticContent/index.html.twig


What is this?
=============

<b>This Bundle currently is a gigantic security hole, since it doesn't attempt to check any permissions and does not cleanup or validate the content (XSS attacks, ...).</b>

The main goal is to eventually support tools to easily output Entity/Document instances
as RDFa inside HTML, as well as map them back from JSON-LD for processing.

The bundle currently provides:
* A REST handler to save JSON-LD data into ORM/ODM Entities resp. Documents.
* The VIE library and the hallo editor, and support for integration the aloha editor
* TODO: Think if we can help with outputting Entity/Documents with RDFa somehow (annotations on Document + twig extension?)



Dependencies
============

This bundle includes vie and the hallo editor as submodules.
Your symfony must have two bundles activated:
* FOSRestBundle to handle the requests (see installation instructions above)
* AsseticBundle to be able to provide the javascript files. (part of symfony-standard, just make sure you did not disable it)

Furthermore there is an optional dependency in DMS\Filter:
https://github.com/rdohms/DMS-Filter

Add the following to your deps file:

```
[DMS-Filter]
   git=http://github.com/rdohms/DMS-Filter.git
```

And the following to your autoload.php

```
$loader->registerNamespaces(array(
    'DMS\Filter'       => __DIR__.'/vendor/DMS-Filter',
));
```

And finally enable the filter service:

```
liip_vie:
    filter: true
```


Developping hallo editor
========================

You can develop the hallo editor inside the VIE bundle. If you set the
``liip_vie: use_coffee`` option to true, it will include the coffee script
files with assetic, rather than the precompiled javascript.
This also means that if you have a mapping for coffeescript in your assetic
configuration, you need to have the coffee compiler set up correctly. In the
sandbox we did a little hack to not trigger coffee script compiling. In
config.yml we make the coffee extension configurable:

    assetic:
        filters:
            cssrewrite: ~
            coffee:
                bin: %coffee.bin%
                node: %coffee.node%
                apply_to: %coffee.extension%

    liip_vie:
        # set this to true if you want to develop hallo and edit the coffee files
        use_coffee: true|false

Now if the parameters.yml sets ``coffee.extension`` to ``\.coffee`` the
coffeescript is compiled and the coffee compiler needs to be installed.
If you set it to anything else like ``\.nocoffee`` then you do not need the
coffee compiler installed.

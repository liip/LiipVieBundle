Introduction
============

VIE is a way to make any site using RDFa editable.

For more information see http://wiki.iks-project.eu/index.php/Semantic_Editor

Installation
============

    1. Add this bundle to your project as Git submodules:

        $ git submodule add git://github.com/liip/LiipVieBundle.git vendor/bundles/Liip/VieBundle

    2. Add the Liip namespace to your autoloader:

        // app/autoload.php
        $loader->registerNamespaces(array(
            'Liip' => __DIR__.'/../vendor/bundles',
            // your other namespaces
        ));

    3. Add this bundle to your application's kernel:

    // application/ApplicationKernel.php
    public function registerBundles()
    {
        return array(
            // ...
            new Liip\VieBundle\LiipVieBundle(),
            // ...
        );
    }

    4. Initialize the vie submodule

        $ git submodule init
        $ git submodule update --recursive

    5. It is required to also install FOSRestBundle

        see https://github.com/FriendsOfSymfony/FOSRestBundle

    6. Add a mapping to the `config.yml` and enable a controller

        liip_vie:
            phpcr_odm: true
            #orm: my_document_manager
            map:
                '<sioc:Post>': 'Liip\HelloBundle\Document\Article'
            base_path: /cms/routes
            cms_path: /cms/content/static

    7. Finally add the relevant routing to your configuration

        <import resource="liip_vie.phpcr.controller" type="rest" />

        vie:
            resource: "@LiipVieBundle/Resources/config/routing/phpcr_odm.xml"

    8. Optional: Aloha Editor (this bundle comes with the hallo editor, but if you prefer you can also use aloha)

        To use the Aloha editor with this bundle, download the files here: https://github.com/alohaeditor/Aloha-Editor/downloads/aloha-0.9.3.zip
        Unzip the contents of the "aloha" subfolder of this zip as folder vendor/bundles/Liip/VieBundle/vendor/aloha
        Make sure you have just one aloha folder with the js, not aloha/aloha/... - you should have vendor/bundles/Liip/VieBundle/vendor/aloha/aloha.js


Usage
=====

Adjust your template to load the editor js files if the current session is allowed to edit content.

    {% render "liip_vie.controller.vie:includeJSFilesAction" %}

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

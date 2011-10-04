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
            #orm: doctrine.orm.my_entity_manager
            map:
                '<sioc:Post>': 'Liip\HelloBundle\Document\Article'

    7. Finally add the relevant routing to your configuration

        <import resource="liip_vie.phpcr.controller" type="rest" />

        vie:
            resource: "@LiipVieBundle/Resources/config/routing/phpcr_odm.xml"


    8. Editor (TODO: detect if there and make optional)

        To use the Aloha editor with this bundle, download the files here: https://github.com/alohaeditor/Aloha-Editor/downloads/aloha-0.9.3.zip
        Unzip the contents of the "aloha" subfolder of this zip as folder vendor/bundles/Liip/VieBundle/vendor/aloha
        Make sure you have just one aloha folder with the js, not aloha/aloha/... - you should have vendor/bundles/Liip/VieBundle/vendor/aloha/aloha.js

What is this?
=============

This Bundle doesn't do much at this point, also its a gigantic security hole, since it
doesn't attempt to check any permissions.

The main goal is to eventually support tools to easily output Entity/Document instances
as RDFa inside HTML, as well as map them back from JSON-LD for processing.

TODO: Think if we can help with outputting Entity/Documents with RDFa somehow (annotations on Document + twig extension?)

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

What is this?
=============

This Bundle doesn't do much at this point, also its a gigantic security hole, since it
doesn't attempt to check any permissions.

The main goal is to eventually support tools to easily output Entity/Document instances
as RDFa inside HTML, as well as map them back from JSON-LD for processing.

Installation
============

  1. Add this bundle to your project as Git submodules:

          $ git submodule add git://github.com/liip/LiipVieBundle.git vendor/bundles/Liip/vieBundle

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
                  new Liip\HelloBundle\LiipVieBundle(),
                  // ...
              );
          }

  4. Initialize the view submodule

          $ git submodule init
          $ git submodule update --recursive

What is this?
=============

This Bundle atm doesn't really do anything besides maintain the VIE git submodule.

The main is to eventually support tools to easily output Entity/Document instances
as RDFa inside HTML, as well as map them back from JSON-LD for processing.

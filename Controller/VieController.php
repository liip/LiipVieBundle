<?php

namespace Liip\VieBundle\Controller;

use FOS\RestBundle\View\ViewHandlerInterface,
    FOS\RestBundle\View\View;

class VieController
{
    /**
     * @var FOS\RestBundle\View\ViewHandlerInterface
     */
    private $viewHandler;

    /**
     * @var Boolean
     */
    private $coffee;

    /**
     * Create the Vie Controller
     *
     * When using hallo, the controller can include the compiled js files from
     * hallo's examples folder or use the assetic coffee filter.
     * When developing hallo, make sure to use the coffee filter.
     *
     * @param ViewHandlerInterface $viewHandler view handler
     * @param Boolean $useCoffee whether assetic is set up to use coffee script
     */
    public function __construct(ViewHandlerInterface $viewHandler, $useCoffee = false)
    {
        $this->viewHandler = $viewHandler;
        $this->coffee = $useCoffee;
    }

    /**
     * Render js for VIE and a semantic editor.
     *
     * Hallo is a submodule of this bundle and available after right after you
     * followed the installation instructions.
     * To use aloha, you need to download the zip, as explained in step 8 of
     * the README.
     *
     * @param string $editor the name of the editor to load, currently hallo and aloha are supported
     */
    public function includeJSFilesAction($editor = 'hallo')
    {
        // We could inject a list of names to template mapping for this
        // to allow adding other editors without changing this bundle

        $view = new View();
        switch ($editor) {
            case 'hallo':
                if ($this->coffee) {
                    $view->setTemplate('LiipVieBundle::includecoffeefiles-hallo.html.twig');
                } else {
                    $view->setTemplate('LiipVieBundle::includejsfiles-hallo.html.twig');
                }
                break;
            case 'aloha':
                $view->setTemplate('LiipVieBundle::includejsfiles-aloha.html.twig');
                break;
            default:
                throw new \InvalidArgumentException("Unknown editor '$editor' requested");
        }

        return $this->viewHandler->handle($view);
    }
}

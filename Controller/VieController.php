<?php

namespace Liip\VieBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\DependencyInjection\ContainerInterface;

class VieController extends Controller
{
    private $coffee;

    /**
     * Create the Vie Controller
     *
     * When using hallo, the controller can include the compiled js files from
     * hallo's examples folder or use the assetic coffee filter.
     * When developping hallo, make sure to use the coffee filter.
     *
     * @param ContainerInterface $container the container
     * @param string $useCoffee whether assetic is set up to use coffee script
     */
    public function __construct(ContainerInterface $container, $useCoffee = false)
    {
        $this->setContainer($container);
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
        if ('hallo' == $editor) {
            if ($this->coffee) {
                return $this->render('LiipVieBundle::includecoffeefiles-hallo.html.twig');
            } else {
                return $this->render('LiipVieBundle::includejsfiles-hallo.html.twig');
            }
        } elseif ('aloha' == $editor) {
            return $this->render('LiipVieBundle::includejsfiles-aloha.html.twig');
        } else {
            throw new \InvalidArgumentException("Unknown editor '$editor' requested");
        }
    }
}

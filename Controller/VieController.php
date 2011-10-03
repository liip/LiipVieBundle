<?php

namespace Liip\VieBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class VieController extends Controller
{
    public function includeJSFilesAction()
    {
        // TODO: config option to tell if coffee is enabled
        // return $this->render('LiipVieBundle::includejsfiles-hallo.html.twig');
        return $this->render('LiipVieBundle::includecoffeefiles-hallo.html.twig');

        // TODO: check for aloha files and allow other editors as well
        //return $this->render('LiipVieBundle::includejsfiles-aloha.html.twig');
    }
}

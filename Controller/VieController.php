<?php

namespace Liip\VieBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class VieController extends Controller
{
    public function includeJSFilesAction()
    {
        // TODO: check for aloha files and allow other editors as well
        return $this->render('LiipVieBundle::includejsfiles-aloha.html.twig');
    }
}

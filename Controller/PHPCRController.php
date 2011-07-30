<?php

namespace Liip\VieBundle\Controller;

class PHPCRController extends Controller
{
    /**
     * Handle article PUT
     */
    public function putDocumentAction($id)
    {
        return parent::putDocumentAction('/'.$id);
    }
}

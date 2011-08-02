<?php

namespace Liip\VieBundle\Controller;

class PhpcrOdmController extends DoctrineController
{
    /**
     * Handle article PUT
     */
    public function putDocumentAction($id)
    {
        return parent::putDocumentAction('/'.$id);
    }
}

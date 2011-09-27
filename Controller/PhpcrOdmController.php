<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request;

class PhpcrOdmController extends DoctrineController
{
    /**
     * Handle article PUT
     */
    public function putDocumentAction(Request $request, $id)
    {
        return parent::putDocumentAction($request, '/'.$id);
    }
}

<?php

namespace Liip\VieBundle\Controller;

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

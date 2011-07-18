<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Routing\Exception\ResourceNotFoundException;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use FOS\RestBundle\Controller\Annotations\Prefix;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\View\ViewInterface;

use Doctrine\ODM\PHPCR\DocumentManager;

/**
 * @Prefix("liip/vie/phpcr")
 * @NamePrefix("liip_vie_phpcr_")
 */
class PHPCRController
{
    /**
     * @var FOS\RestBundle\View\ViewInterface
     */
    protected $view;

    /**
     * @var Symfony\Component\HttpFoundation\Request
     */
    protected $request;

    /**
     * @var Doctrine\ODM\PHPCR\DocumentManager
     */
    protected $dm;

    /**
     * @var array
     */
    protected $map;

    public function __construct(Request $request, ViewInterface $view, DocumentManager $dm, array $map)
    {
        $this->request = $request;
        $this->view = $view;
        $this->dm = $dm;
        $this->map = $map;
    }

    /**
     * @throws \Symfony\Component\Routing\Exception\ResourceNotFoundException
     * @param array $data
     * @return \Doctrine\ODM\PHPCR\DocumentRepository
     */
    protected function getRepository($data)
    {
        if (empty($this->map[$data['a']])) {
            throw new ResourceNotFoundException($data['a'].' is not mapped to a class');
        }

        return $this->dm->getRepository($this->map[$data['a']]);
    }

    /**
     * Handle article PUT
     */
    public function putDocumentAction($id)
    {
        $data = $this->request->request->all();

        $repo = $this->getRepository($data);
        $id = '/'.$id;
        $document = $repo->find($id);
        if (empty($document)) {
            throw new ResourceNotFoundException($id.' not found');
        }

        $document->fromJsonLD($data);
        $this->dm->flush();

        // return the updated version
        $this->view->setParameters($document->toJsonLd());
        $this->view->setFormat('json');
        return $this->view;
    }
}

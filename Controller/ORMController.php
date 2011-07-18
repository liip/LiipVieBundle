<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Routing\Exception\ResourceNotFoundException;

use FOS\RestBundle\Controller\Annotations\Prefix;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\View\ViewInterface;

use Doctrine\ORM\EntityManager;

/**
 * @Prefix("liip/vie/orm")
 * @NamePrefix("liip_vie_orm_")
 */
class ORMController
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
     * @var Doctrine\ORM\EntityManager
     */
    protected $em;

    /**
     * @var array
     */
    protected $map;

    public function __construct(Request $request, ViewInterface $view, EntityManager $em, array $map)
    {
        $this->request = $request;
        $this->view = $view;
        $this->em = $em;
        $this->map = $map;
    }

    /**
     * @throws \Symfony\Component\Routing\Exception\ResourceNotFoundException
     * @param array $data
     * @return \Doctrine\ORM\EntityRepository
     */
    protected function getRepository($data)
    {
        if (empty($this->map[$data['a']])) {
            throw new ResourceNotFoundException($data['a'].' is not mapped to a class');
        }

        return $this->em->getRepository($this->map[$data['a']]);
    }

    /**
     * Handle article PUT
     */
    public function putEntityAction($id)
    {
        $data = $this->request->request->all();

        $repo = $this->getRepository($data);
        $document = $repo->find($id);
        if (empty($document)) {
            throw new ResourceNotFoundException($id.' not found');
        }

        $document->fromJsonLD($data);
        $this->em->flush();

        // return the updated version
        $this->view->setParameters($document->toJsonLd());
        $this->view->setFormat('json');
        return $this->view;
    }
}

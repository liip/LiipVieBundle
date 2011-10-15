<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\Routing\Exception\ResourceNotFoundException;

use FOS\RestBundle\View\ViewHandlerInterface,
    FOS\RestBundle\View\View,
    FOS\RestBundle\Response\Codes;

use Doctrine\Common\Persistence\ManagerRegistry;

use Liip\VieBundle\FromJsonLdInterface,
    Liip\VieBundle\ToJsonLdInterface;

abstract class DoctrineController
{
    /**
     * @var FOS\RestBundle\View\ViewHandlerInterface
     */
    protected $viewHandler;

    /**
     * @var ManagerRegistry
     */
    protected $registry;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var array
     */
    protected $map;

    public function __construct(ViewHandlerInterface $viewHandler, ManagerRegistry $registry, $name = null, array $map = array())
    {
        $this->viewHandle = $viewHandler;
        $this->registry = $registry;
        $this->name = $name;
        $this->map = $map;
    }

    /**
     * @return Doctrine\Common\Persistence\ObjectManager
     */
    protected function getManager()
    {
        return $this->registry->getManager($this->name);
    }

    /**
     * @throws \Symfony\Component\Routing\Exception\ResourceNotFoundException
     * @param array $data
     * @return object a repository instance
     */
    protected function getRepository($data)
    {
        if (empty($this->map[$data['a']])) {
            throw new ResourceNotFoundException($data['a'].' is not mapped to a class');
        }

        return $this->getManager()->getRepository($this->map[$data['a']]);
    }

    /**
     * Handle article PUT
     */
    public function putDocumentAction(Request $request, $id)
    {
        $data = $request->request->all();

        $repository = $this->getRepository($data);
        $model = $repository->find($id);
        if (empty($model)) {
            throw new ResourceNotFoundException($id.' not found');
        }

        if (!($model instanceof FromJsonLdInterface)) {
            throw new \LogicException('Document does not support FromJsonLdInterface.');
        }

        $model->fromJsonLD($data);
        $this->getManager()->flush();

        if (!($model instanceof ToJsonLdInterface)) {
            return new Response('', Codes::HTTP_NO_CONTENT);
        }

        // return the updated version
        $view = View::create($model->toJsonLd())->setFormat('json');
        return $this->viewHandler->handle($view, $request);
    }
}

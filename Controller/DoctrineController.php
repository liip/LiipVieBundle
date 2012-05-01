<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\Routing\Exception\ResourceNotFoundException,
    Symfony\Component\Security\Core\Exception\AccessDeniedException,
    Symfony\Component\Security\Core\SecurityContextInterface,
    Symfony\Component\Validator\ValidatorInterface;

use FOS\RestBundle\View\ViewHandlerInterface,
    FOS\RestBundle\View\View,
    FOS\Rest\Util\Codes;

use Doctrine\Common\Persistence\ManagerRegistry;

use DMS\Filter\FilterInterface;

use Liip\VieBundle\FromJsonLdInterface,
    Liip\VieBundle\ToJsonLdInterface;

abstract class DoctrineController
{
    /**
     * @var SecurityContext
     */
    protected $securityContext;

    /**
     * @var ViewHandlerInterface
     */
    protected $viewHandler;

    /**
     * @var FilterInterface
     */
    protected $filter;

    /**
     * @var ValidatorInterface
     */
    protected $validator;

    /**
     * @var ManagerRegistry
     */
    protected $registry;

    /**
     * @var string
     */
    protected $name;

    public function __construct(SecurityContextInterface $securityContext, ViewHandlerInterface $viewHandler, ValidatorInterface $validator, ManagerRegistry $registry, FilterInterface $filter = null, $name = null)
    {
        $this->securityContext = $securityContext;
        $this->viewHandler = $viewHandler;
        $this->filter = $filter;
        $this->validator = $validator;
        $this->registry = $registry;
        $this->name = $name;
    }

    /**
     * @return Doctrine\Common\Persistence\ObjectManager
     */
    protected function getManager()
    {
        return $this->registry->getManager($this->name);
    }

    /**
     * Handle article PUT
     */
    public function putDocumentAction(Request $request, $id)
    {
        if (false === $this->securityContext->isGranted("IS_AUTHENTICATED_ANONYMOUSLY")) {
            throw new AccessDeniedException();
        }

        $data = $request->request->all();
        $model = $this->getManager()->find(null, $id);

        if (empty($model)) {
            throw new ResourceNotFoundException($id.' not found');
        }

        if (!($model instanceof FromJsonLdInterface)) {
            throw new \LogicException('Document does not support FromJsonLdInterface.');
        }

        $model->fromJsonLD($data);
        if ($this->filter) {
            $this->filter->filter($model);
        }

        $errors = $this->validator->validate($model);

        if (count($errors)) {
            // TODO ensure we are returning JSON-LD
            $view = View::create($errors, 400)->setFormat('json');
        } else {
            $this->getManager()->flush();

            if (!($model instanceof ToJsonLdInterface)) {
                return new Response('', Codes::HTTP_NO_CONTENT);
            }

            // return the updated version
            $view = View::create($model->toJsonLd())->setFormat('json');
        }

        return $this->viewHandler->handle($view, $request);
    }
}

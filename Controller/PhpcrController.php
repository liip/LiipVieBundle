<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Routing\Exception\ResourceNotFoundException;

use FOS\RestBundle\View\ViewHandlerInterface,
    FOS\RestBundle\View\View;

use PHPCR\NodeInterface;

use Doctrine\Common\Persistence\ManagerRegistry;

use Liip\VieBundle\FromJsonLdInterface,
    Liip\VieBundle\ToJsonLdInterface;

class PhpcrController
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

    public function __construct(ViewHandlerInterface $viewHandler, ManagerRegistry $registry, $name = null)
    {
        $this->viewHandle = $viewHandler;
        $this->registry = $registry;
    }

    protected function fromJsonLD(NodeInterface $node, array $data)
    {
        unset($data['@'], $data['a']);
        foreach ($data as $key => $value) {
            $node->setProperty($key, $value);
        }
    }

    protected function toJsonLD(NodeInterface $node)
    {
        $data = $node->getPropertiesValues(null, false);
        $data['@'] = $node->getPath();
        $data['a'] = $node->getPrimaryNodeType();
        return $data;
    }

    /**
     * Handle article PUT
     */
    public function putDocumentAction(Request $request, $id)
    {
        $data = $request->request->all();

        $session = $this->registry->getConnection($this->name);
        $node = $session->getNode($id);
        if (empty($node)) {
            throw new ResourceNotFoundException($id.' not found');
        }

        $this->fromJsonLD($node, $data);
        $session->save();

        // return the updated version
        $view = View::create($this->toJsonLd($node))->setFormat('json');
        return $this->viewHandler->handle($view, $request);
    }
}

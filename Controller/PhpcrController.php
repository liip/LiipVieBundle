<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Routing\Exception\ResourceNotFoundException;

use FOS\RestBundle\View\ViewInterface;

use PHPCR\SessionInterface,
    PHPCR\NodeInterface;

class PhpcrController
{
    /**
     * @var FOS\RestBundle\View\ViewInterface
     */
    protected $view;

    /**
     * @var PHPCR\SessionInterface
     */
    protected $session;

    public function __construct(ViewInterface $view, SessionInterface $session)
    {
        $this->view = $view;
        $this->session = $session;
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
        $path = '/'.$id;
        $data = $request->request->all();

        $node = $this->session->getNode($path);
        if (empty($node)) {
            throw new ResourceNotFoundException($path.' not found');
        }

        $this->fromJsonLD($node, $data);
        $this->session->save();

        // return the updated version
        $this->view->setParameters($this->toJsonLd($node));
        $this->view->setFormat('json');
        return $this->view->handle();
    }
}

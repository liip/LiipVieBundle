<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Routing\Exception\ResourceNotFoundException;

use FOS\RestBundle\View\ViewHandlerInterface;

use PHPCR\SessionInterface,
    PHPCR\NodeInterface;

class PhpcrController
{
    /**
     * @var FOS\RestBundle\View\ViewHandlerInterface
     */
    protected $viewHandler;

    /**
     * @var PHPCR\SessionInterface
     */
    protected $session;

    public function __construct(ViewHandlerInterface $viewHandler, SessionInterface $session)
    {
        $this->viewHandler = $viewHandler;
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
        $view = View::create($this->toJsonLd($node))->setFormat('json');
        return $this->viewHandler->handle($view, $request);
    }
}

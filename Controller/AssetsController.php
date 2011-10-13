<?php

namespace Liip\VieBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Request;

class AssetsController extends Controller
{

    public function __construct(ContainerInterface $container)
    {
        $this->setContainer($container);
    }

    /**
     * Search for assets matching the query
     *
     * This function currently only returns some fixture data to try the editor
     *
     */
    public function searchAction(Request $request)
    {
        $data = array(
            array(
                'url' => 'http://www.perfectoutdoorweddings.com/wp-content/uploads/2011/06/beach.jpg',
                'alt' => 'Crazy beach, but no girls'
            ),
            array(
                'url' => 'http://www.photosnewportbeach.com/artwork/newport-beach-sunset.jpg',
                'alt' => 'Sunset from my balconey'
            ),
            array(
                'url' => 'http://www.capetowndailyphoto.com/uploaded_images/Beach_Girl_IMG_3563-761741.jpg',
                'alt' => 'My sister in Capetown'
            ),
            array(
                'url' => 'http://news.fullorissa.com/wp-content/uploads/2011/06/PuriBeach.jpg',
                'alt' => 'New Dehli chatting'
            ),
            array(
                'url' => 'http://www.ouramazingplanet.com/images/stories/pattaya-beach-110201-02.jpg',
                'alt' => 'Amazing view from my plane'
            )
        );

        $page = $request->query->get('page');
        if ($page === null || !is_numeric($page) || $page < 1) {
            $page = 1;
        }
        $length = $request->query->get('length');
        if ($length === null || !is_numeric($length) || $length < 1) {
            $length = 4;
        }

        $responseArray = array(
            'page' => $page,
            'length' => $length,
            'total' => count($data),
            'assets' => array_slice($data, ($page-1)*$length, $length)
        );

        return $responseArray;
    }
}

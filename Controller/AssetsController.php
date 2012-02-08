<?php

namespace Liip\VieBundle\Controller;

use Symfony\Component\HttpFoundation\Request;

use FOS\RestBundle\View\ViewHandlerInterface,
    FOS\RestBundle\View\View;

use Symfony\Cmf\Bundle\CoreBundle\Helper\PathMapperInterface;
use Symfony\Component\Routing\RouterInterface;

/**
 * TODO this controller should eventually be removed
 * Or at most an example optional service using the FS could be offered
 *
 * Instead a REST API should be defined
 */
class AssetsController
{
    private $dm;

    private $basePath;

    private $router;

    private $cmsPath;

    /**
     * @var FOS\RestBundle\View\ViewHandlerInterface
     */
    private $viewHandler;

    public function __construct($dm, $basePath, $cmsPath, RouterInterface $router, ViewHandlerInterface $viewHandler)
    {
        $this->dm = $dm;
        $this->basePath = $basePath;
        $this->cmsPath = $cmsPath;
        $this->router = $router;
        $this->viewHandler = $viewHandler;
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
                'url' => 'http://www.hotelplan.ch/CMS/1/1823506/4/ferien_auf_den_malediven.jpg',
            ),
            array(
                'url' => 'http://stuckincustoms.smugmug.com/Portfolio-The-Best/your-favorites/3410783929310572ed16o/742619149_CYkrj-750x750.jpg',
                'alt' => 'Blue mountains'
            ),
            array(
                'url' => 'http://media.smashingmagazine.com/images/fantastic-hdr-pictures/hdr-10.jpg',
                'alt' => 'Sun, Clouds, Stuff'
            ),
            array(
                'url' => 'http://farm3.static.flickr.com/2139/1524795919_62631ab870.jpg',
                'alt' => 'Two lone trees'
            ),
            array(
                'url' => 'http://www.bigpicture.in/wp-content/uploads/2010/12/HDR-Photography-By-Paul-21-660x494.jpg',
                'alt' => 'Bridge'
            )
        );

        $offset = (int)$request->query->get('offset', 0);
        if ($offset < 0) {
            $offset = 0;
        }

        $limit = (int)$request->query->get('limit', 8);
        if ($limit < 1) {
            $limit = 8;
        }

        $data = array(
            'offset' => $offset,
            'total' => count($data),
            'assets' => array_slice($data, $offset, $limit)
        );

        $view = View::create($data);
        return $this->viewHandler->handle($view);
    }

    /**
     * List Images from Repo
     *
     * This function currently only returns some fixture data to try the editor
     *
     */
    public function listAction(Request $request)
    {
        $tags = $request->query->get('tags');
        $tags = explode(',', $tags);

        foreach ($tags as $i => $tag) {
            $tags[$i] = 'images.tags = ' . $this->dm->quote($tag);
        }

        $sql = 'SELECT images.* FROM [nt:unstructured] AS images
                    WHERE ISDESCENDANTNODE(images, ' . $this->dm->quote($this->cmsPath) . ') AND (' . implode(' OR ', $tags) . ')';
        $query = $this->dm->createQuery($sql, \PHPCR\Query\QueryInterface::JCR_SQL2);
        $query->setLimit(-1);
        $images = $this->dm->getDocumentsByQuery($query);

        $data = array();

        foreach ($images as $image) {

            if ($image instanceof \Sandbox\MainBundle\Document\Image) {

                $url = $this->router->generate('image_display', array('id' => $image->name), true);
                $data[] = array('url' => $url, 'alt' => $image->name);
            }
        }

        $data = array(
            'assets' => $data,
        );

        $view = View::create($data);
        return $this->viewHandler->handle($view);
    }

    public function showRelatedAction(Request $request)
    {
        $tags = $request->query->get('tags');
        $page = $request->query->get('page');

        $tags = explode(',', $tags);

        $lang = $request->getLocale();

        $data = $this->getPagesByTags($tags, $page, $lang);
        $data = array(
            'links' => $data,
        );

        $view = View::create($data);
        return $this->viewHandler->handle($view);
    }

    /**
     * Connect to Jackrabbit, and filter pages by tags
     * @params $tags array with stanbol references
     * @params $currentUrl string current url
     * @params $lang string language
     * @retrun array with links to pages
    */
    protected function getPagesByTags($tags, $currentUrl, $lang) {

        $this->basePath = $this->basePath.'/'.$lang;

        foreach ($tags as $i => $tag) {
            $tags[$i] = 'referring.tags = ' . $this->dm->quote($tag);
        }

        $sql = 'SELECT routes.* FROM [nt:unstructured] AS routes';
        $sql .= ' INNER JOIN [nt:unstructured] AS referring ON referring.[jcr:uuid] = routes.[routeContent]';
        $sql .= ' WHERE (ISDESCENDANTNODE(routes, ' . $this->dm->quote($this->basePath) . ') OR ISSAMENODE(routes, ' . $this->dm->quote($this->basePath) . '))';
        $sql .= ' AND (' . implode(' OR ', $tags) . ')';
        $query = $this->dm->createQuery($sql, \PHPCR\Query\QueryInterface::JCR_SQL2);
        $query->setLimit(-1);
        $pages = $this->dm->getDocumentsByQuery($query);

        $links = array();
        foreach ($pages as $page) {

            if ($page instanceof \Symfony\Cmf\Bundle\ChainRoutingBundle\Document\Route && $page->getRouteContent()) {

                $url = $this->router->generate('', array('_locale' => $lang, 'content' => $page->getRouteContent()), true);

                if (preg_replace('/^\/|\/$/', '', $url) !== preg_replace('/^\/|\/$/', '', $currentUrl)) {

                    $label = $page->getRouteContent()->title;

                    $links[] = array('url' => $url, 'label' => $label);
                }
            }
        }

        return $links;
    }
}

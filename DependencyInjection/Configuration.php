<?php

namespace Liip\VieBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('liip_vie');

        $rootNode
            ->children()
                ->arrayNode('map')
                    ->useAttributeAsKey('name')
                    ->prototype('scalar')->end()
                ->end()
                ->scalarNode('role')->defaultValue('IS_AUTHENTICATED_ANONYMOUSLY')->end()
                ->scalarNode('phpcr')->defaultFalse()->end()
                ->scalarNode('phpcr_odm')->defaultFalse()->end()
                ->scalarNode('orm')->defaultFalse()->end()
                ->scalarNode('use_coffee')->defaultFalse()->end()
                ->scalarNode('filter')->defaultFalse()->end()
                ->scalarNode('base_path')->defaultValue('/')->end()
                ->scalarNode('cms_path')->defaultValue('/')->end()
                ->arrayNode('rdf_config_dirs')
                    ->useAttributeAsKey('dir')
                    ->prototype('scalar')->end()
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}

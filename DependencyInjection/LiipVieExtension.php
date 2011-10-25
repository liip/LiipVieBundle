<?php

namespace Liip\VieBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class LiipVieExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $processor = new Processor();
        $configuration = new Configuration();
        $config = $processor->processConfiguration($configuration, $configs);

        $loader = new Loader\XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        if (!empty($config['phpcr'])) {
            $loader->load('phpcr.xml');
            if (is_string($config['phpcr'])) {
                $phpcr = $container->getDefinition('liip_vie.phpcr.controller');
                $phpcr->replaceArgument(4, $config['phpcr']);
            }
        }
        if (!empty($config['phpcr_odm'])) {
            $loader->load('phpcr_odm.xml');
            if (is_string($config['phpcr_odm'])) {
                $phpcr_odm = $container->getDefinition('liip_vie.phpcr_odm.controller');
                $phpcr_odm->replaceArgument(4, $config['phpcr_odm']);
            }
        }
        if (!empty($config['orm'])) {
            $loader->load('orm.xml');
            if (is_string($config['orm'])) {
                $phpcr = $container->getDefinition('liip_vie.orm.controller');
                $phpcr->replaceArgument(4, $config['orm']);
            }
        }

        $container->setParameter($this->getAlias().'.map', $config['map']);
        $container->setParameter($this->getAlias().'.use_coffee', $config['use_coffee']);

        $loader->load('services.xml');
    }
}

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
                $session = new Reference($config['phpcr']);
                $phpcr->replaceArgument(2, $session);
            }
        }
        if (!empty($config['phpcr_odm'])) {
            $loader->load('phpcr_odm.xml');
            if (is_string($config['phpcr_odm'])) {
                $phpcr_odm = $container->getDefinition('liip_vie.phpcr_odm.controller');
                $dm = new Reference($config['phpcr_odm']);
                $phpcr_odm->replaceArgument(2, $dm);
            }
        }
        if (!empty($config['orm'])) {
            $loader->load('orm.xml');
            if (is_string($config['orm'])) {
                $phpcr = $container->getDefinition('liip_vie.orm.controller');
                $em = new Reference($config['orm']);
                $phpcr->replaceArgument(2, $em);
            }
        }

        $container->setParameter($this->getAlias().'.map', $config['map']);
    }
}

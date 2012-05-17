<?php

namespace Liip\VieBundle\Composer;

use Symfony\Component\ClassLoader\ClassCollectionLoader;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\PhpExecutableFinder;

/**
 * A hack to work around the missing support for js assets in composer
 *
 * @see http://groups.google.com/group/composer-dev/browse_thread/thread/e9e2f7d919aadfec
 *
 * @author David Buchmann
 */
class ScriptHandler
{
    public static function initSubmodules($event)
    {
        exec('git submodule update --init --recursive') or die('failed to run git submodule update');
    }
}

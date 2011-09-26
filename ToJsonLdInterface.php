<?php

namespace Liip\VieBundle;

/**
 * An interface to mark a model (i.e. doctrine entity or document) as being
 * able to convert itself into JSON-LD data.
 *
 * @see http://json-ld.org/
 */
interface ToJsonLdInterface
{
    /**
     * Get a key-value array for JSON-LD with the keys @ for the id, "a" for
     * the type and appropriate names for the data fields, plus any other
     * JSON-LD things you want to use.
     *
     * @return array with JSON-LD data
     */
    function toJsonLd();
}

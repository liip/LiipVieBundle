<?php

namespace Liip\VieBundle;

/**
 * An interface to mark a model (i.e. doctrine entity or document) as being
 * able to update its data from JSON-LD data.
 *
 * @see http://json-ld.org/
 */
interface FromJsonLdInterface
{
    /**
     * Update this entity or document with data coming from json.
     *
     * @param array $data keys are the field names you used, values the new values for that data.
     *
     * @return void
     */
    function fromJsonLd($data);
}
